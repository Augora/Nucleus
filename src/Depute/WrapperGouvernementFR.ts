import cheerio from 'cheerio'
import puppeteer, { Browser } from 'puppeteer'
import axios, { AxiosRequestConfig } from 'axios'

import { GetLogger } from '../Common/Logger'
import { slugify, removeLastSlashUrl } from '../Tools/String'
import { Database } from '../../Types/database.types'
import dayjs from 'dayjs'
import "dayjs/locale/fr"
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { processNumeroDepartement, processNumeroRegion } from './Mapping'
import { retryGoto } from '../Tools/Promises'

type Deputes = Database['public']['Tables']['newSource_Depute']['Insert']
dayjs.locale("fr")
dayjs.extend(customParseFormat)

export async function GetDeputesFromGouvernementFR(): Promise<Deputes[]> {
  GetLogger().info('Retrieving deputies from gouvernement.fr...')
  const Deputes: Deputes[] = []

  const browser = await puppeteer.launch()
  const listDeputies = await browser.newPage()
  const url = "https://www2.assemblee-nationale.fr/deputes/recherche-multicritere"
  const config = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }
  try {
    await retryGoto(listDeputies, url)
    await listDeputies.waitForSelector('#contenu-page')
    const bodyHTML = await listDeputies.content()
    let $ = cheerio.load(bodyHTML)

    const formData: { [key: string]: string } = {}
    $('input[type="checkbox"]').each(function () {
      const name = $(this).attr('name')
      const value = $(this).val()?.toString() || ''
      if (name && value) {
        formData[name] = value
      }
    })
    const form = $(`form[action="${url}"]`)
    const actionUrl = form.attr('action') || ''
    const postResponse = await axios.post(actionUrl, formData, config)
    $ = cheerio.load(postResponse.data)
    let tableData = []
    $('table tbody tr').each((index, element) => {
      const lienFiche = $(element).find('td:nth-child(1) a').attr('href').match(/OMC_PA(\d+)/)[1]
      const civilite = $(element).find('td:nth-child(2)').text().trim()
      const prenom = $(element).find('td:nth-child(3)').text().trim()
      const nom = $(element).find('td:nth-child(4)').text().trim()
      const groupe = $(element).find('td:nth-child(5)').text().trim()
      const departement = $(element).find('td:nth-child(6)').text().trim()
      const region = $(element).find('td:nth-child(7)').text().trim()
      const circonscription = $(element).find('td:nth-child(8)').text().trim()
      const profession = $(element).find('td:nth-child(13)').text().trim()
      const dateNaissance = $(element).find('td:nth-child(14)').text().trim()

      tableData.push({
        lienFiche,
        civilite,
        prenom,
        nom,
        groupe,
        departement,
        region,
        circonscription,
        profession,
        dateNaissance
      })
    })

    for (let i = 0; i < tableData.length; i++) {
      const rowData = tableData[i]
      const urlDeputy = `https://www2.assemblee-nationale.fr/deputes/fiche/OMC_PA${tableData[i].lienFiche}?force`
      const deputeData = await GetDeputeFromGouvernementFR(urlDeputy, config, browser, rowData, i + 1, tableData.length)
      Deputes.push(deputeData)
    }
  }
  catch (error) {
    GetLogger().error('Failed to retrieve deputies: ', error)
  }
  finally {
    await browser.close();
  }
  return Promise.resolve(Deputes)
}

export async function GetDeputeFromGouvernementFR(url: string, config: AxiosRequestConfig, browser: Browser, rowData, i: number, total: number): Promise<Deputes> {
  GetLogger().info(`${i.toString().padStart(3, '0')}/${total} - Retrieving ${rowData.prenom} ${rowData.nom} from gouvernement.fr...`)
  const deputyContent = await browser.newPage()
  await retryGoto(deputyContent, url)
  await deputyContent.waitForSelector('#deputes-fiche')
  const bodyHTML = await deputyContent.content()
  const $ = cheerio.load(bodyHTML)

  const assembleeNationaleID = rowData.lienFiche

  // Informations générales
  const sexe = rowData.civilite === "Mme" ? "F" : "H"
  const deputySurname = rowData.prenom
  const deputyName = rowData.nom
  const slug = slugify(`${deputySurname} ${deputyName}`)

  const biographieContent = $('dt').filter(function () {
    return $(this).text().trim() === 'Biographie';
  }).next('dd').find('ul > li')
  const bioInfo = $(biographieContent[0]).text().replace(/[\s\n\t]+/g, ' ').trim()
  const bioInfoSplit = bioInfo.split(/\s+(à|au)\s+/)
  const placeOfBirth = bioInfoSplit[2] === "()" ? "" : bioInfoSplit[2]

  const birthday = rowData.dateNaissance.includes('T') ? dayjs(rowData.dateNaissance).format('YYYY-MM-DD') : dayjs(rowData.dateNaissance, 'DD/MM/YYYY').format('YYYY-MM-DD')
  const age = dayjs().diff(dayjs(birthday), 'year')

  const profession = rowData.profession
  const suppleant = $('dt').filter(function () {
    return $(this).text().trim().match(/^Suppléant(e)?$/) !== null
  }).next('dd').find('ul > li').text()

  let mails = []
  mails.push($('h3:contains("Mél et site internet")').nextAll('dd').find('a.email').first().attr('href')?.replace('mailto:', ''))
  $('dd:contains("Autre mél")').each(function () {
    $(this).find('a.email').each(function () {
      const email = $(this).attr('href')?.replace('mailto:', '')
      if (email) {
        mails.push(email)
      }
    })
  })
  let adresses = []
  $('dl.adr').each((index, element) => {
    const adresse = $(element)
    const streetAddress = adresse.find('.street-address').text().trim()
    const postalCode = adresse.find('.postal-code').text().trim()
    const locality = adresse.find('.locality').text().trim()
    const adressObj = {
      Adresse: `${streetAddress}, ${postalCode} ${locality}`,
      CodePostal: postalCode,
      AdresseComplete: `${streetAddress} ${postalCode} ${locality}`
    }
    adresses.push(adressObj)
  })
  let sites = []
  $('dd:contains("Site internet :")').each(function () {
    $(this).find('a.url').each(function () {
      const site = $(this).attr('href')
      if (site) {
        sites.push(removeLastSlashUrl(site))
      }
    })
  })

  const facebookUrl = removeLastSlashUrl($('.facebook').attr('href'))
  const twitterUrl = removeLastSlashUrl($('.twitter').attr('href'))
  const instagramUrl = removeLastSlashUrl($('.instagram').attr('href'))
  const linkedinUrl = removeLastSlashUrl($('.linkedin').attr('href'))
  const twitter = twitterUrl ? twitterUrl.split('@')[1] : ""
  const deputyPhotoUri = $('.deputes-image img').attr('src')

  // Données carte
  const numeroCirconscription = rowData.circonscription
  const nomCirconscription = rowData.departement
  const departement = rowData.departement
  const numDepartement = processNumeroDepartement(departement, slug)
  const numRegion = processNumeroRegion(numDepartement, slug)
  const nomRegion = rowData.region

  // Mandats
  const debutMandat = $('ul.fonctions-liste-attributs li:first-child').text().trim().match(/Date de début de mandat\s*:\s*(\d{2}\/\d{2}\/\d{4})/)?.[1] ?? ""
  const formattedDebutMandat = debutMandat !== "" ? dayjs(debutMandat, 'DD/MM/YYYY').format('YYYY-MM-DD') : ""
  const responsabiliteGroupe = $('.pres-groupe').text().trim().split(' ')[0]
  const isMandat = $('.titre-bandeau-bleu p:contains("Mandat")').text().trim() === "Mandat en cours" ? true : false
  const mandatsBlock = $('h4:contains("Mandat de député")').next('ul').find('li').length
  const nombreMandats = mandatsBlock === 0 ? 1 : mandatsBlock + 1
  let ancienMandat = []
  $('h4:contains("Mandat de député")').next('ul').find('li').each((index, element) => {
    const mandat = $(element).text().trim()
    const regex = /Mandat du (\d{2}\/\d{2}\/\d{4}) \(.*?\) au (\d{2}\/\d{2}\/\d{4}) \((.*?)\)/
    const match = mandat.match(regex)
    if (match) {
      const dateDeDebut = dayjs(match[1], 'DD/MM/YYYY').format('YYYY-MM-DD')
      const dateDeFin = dayjs(match[2], 'DD/MM/YYYY').format('YYYY-MM-DD')
      const mandatObj = {
        "AncienMandatComplet": `${match[1]} / ${match[2]} / ${match[3]}`,
        "DateDeDebut": dateDeDebut,
        "DateDeFin": dateDeFin,
        "Intitule": match[3]
      }
      ancienMandat.push(mandatObj)
    }
  })

  // Groupe parlementaire
  const groupeParlementaire = $('a[title="Accédez à la composition du groupe"]').text().trim()
  const slugGroupe = slugify(groupeParlementaire === "Non inscrit" ? "Députés non inscrits" : groupeParlementaire)
  const responsabiliteGroupeBlock = {
    groupeParlementaire: {
      "Slug": slugGroupe
    },
    Fonction: responsabiliteGroupe.match(/^Président(e)?$/) ? responsabiliteGroupe : "Membre",
    DebutFonction: formattedDebutMandat
  }
  const rattachementFinancierBlock = $('dt').filter(function () {
    return $(this).text().trim() === 'Rattachement au titre du financement de la vie politique'
  }).next('dd').find('ul > li').text().trim()
  const rattachementFinancier = rattachementFinancierBlock ? rattachementFinancierBlock : sexe === 'F' ? 'Non rattachée' : 'Non rattaché'
  const hemicycleContainer = $('#hemicycle-container')
  const placeHemicycle = hemicycleContainer.attr('data-place') ? hemicycleContainer.attr('data-place') : ""
  let collaborators = []
  $('div.bloc-standard.plural-element-simple.clearfix div.corps-contenu ul li.allpadding').each((index, element) => {
    const collaboratorName = $(element).text().trim()
    collaborators.push(collaboratorName)
  })
  await deputyContent.close();

  const Depute: Deputes = {
    Slug: slug,
    Nom: deputyName,
    Prenom: deputySurname,
    Sexe: sexe,
    Age: age,
    DateDeNaissance: birthday,
    LieuDeNaissance: placeOfBirth,
    NumeroDepartement: numDepartement,
    NomDepartement: departement,
    NumeroRegion: numRegion,
    NomRegion: nomRegion,
    NomCirconscription: nomCirconscription,
    NumeroCirconscription: +numeroCirconscription,
    DebutDuMandat: formattedDebutMandat,
    RattachementFinancier: rattachementFinancier,
    Profession: profession,
    PlaceEnHemicycle: placeHemicycle,
    URLAssembleeNationale: url,
    IDAssembleeNationale: assembleeNationaleID, // isUnique in Supabase
    NombreMandats: nombreMandats,
    Twitter: twitter,
    EstEnMandat: isMandat,
    URLPhotoAssembleeNationale: `https://www2.assemblee-nationale.fr${deputyPhotoUri}`,
    URLTwitter: twitterUrl,
    URLFacebook: facebookUrl,
    URLLinkedIn: linkedinUrl,
    URLInstagram: instagramUrl,
    URLPhotoAugora: `https://static.augora.fr/depute/${slug}.jpg`,
    SitesWeb: sites,
    Emails: mails,
    Collaborateurs: collaborators,
    Suppleant: suppleant,
    Adresses: adresses,
    AncienMandat: ancienMandat,
    GroupeParlementaire: slugGroupe,
    ResponsabiliteGroupe: responsabiliteGroupeBlock,
    URLGouvernement: url
  }
  return Depute
}