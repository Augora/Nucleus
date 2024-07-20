import cheerio from 'cheerio'
import puppeteer, { Browser } from 'puppeteer'
import axios from 'axios'

import { GetLogger } from '../Common/Logger'
import { slugify } from '../Tools/String'
import { Database } from '../../Types/database.types'
import { retryGoto } from '../Tools/Promises'
import fs from 'fs/promises'

// Lien commissions
//`https://www2.assemblee-nationale.fr/recherche/resultats_recherche/(offset)/10/(tri)/date/(legislature)/16/(query)/eyJxIjoidHlwZURvY3VtZW50OlwiY29tcHRlIHJlbmR1XCIgYW5kIGNvbnRlbnU6YSIsInJvd3MiOjEwLCJzdGFydCI6MCwid3QiOiJwaHAiLCJobCI6ImZhbHNlIiwiZmwiOiJ1cmwsdGl0cmUsdXJsRG9zc2llckxlZ2lzbGF0aWYsdGl0cmVEb3NzaWVyTGVnaXNsYXRpZix0ZXh0ZVF1ZXN0aW9uLHR5cGVEb2N1bWVudCxzc1R5cGVEb2N1bWVudCxydWJyaXF1ZSx0ZXRlQW5hbHlzZSxtb3RzQ2xlcyxhdXRldXIsZGF0ZURlcG90LHNpZ25hdGFpcmVzQW1lbmRlbWVudCxkZXNpZ25hdGlvbkFydGljbGUsc29tbWFpcmUsc29ydCIsInNvcnQiOiIifQ==`

// Liste organismes parlementaires nosdeputes : https://www.nosdeputes.fr/organismes/parlementaire
// Commissions et autres organes Gouvernement : https://www.assemblee-nationale.fr/dyn/commissions-et-autres-organes
// ✅ Commissions permanentes
// 🔴 https://www.assemblee-nationale.fr/dyn/17/organes/autres-commissions-permanentes/caeu
// 🔴 https://www.assemblee-nationale.fr/dyn/16/organes/autres-commissions/commissions-speciales?statut=termine&limit=12
// 🔴 https://www.assemblee-nationale.fr/dyn/16/organes/autres-commissions-permanentes/cs-comptes
// 🔴 https://www.assemblee-nationale.fr/dyn/16/organes/autres-commissions/cmp?statut=termine&limit=12
// 🔴 https://www.assemblee-nationale.fr/dyn/16/organes/autres-commissions-permanentes/commission-article26
// 🔴 https://www.assemblee-nationale.fr/dyn/16/organes/autres-commissions/commissions-enquete

// Organisation de l'assemblée : https://www.assemblee-nationale.fr/dyn/organisation-de-assemblee (contient les informations du bureau, conférence des présidents, collège des questeurs)

const commissionsPermanentes = [
    'commission-des-affaires-culturelles-et-de-leducation',
    'commission-des-affaires-economiques',
    'commission-des-affaires-etrangeres',
    'commission-des-affaires-sociales',
    'commission-de-la-defense-nationale-et-des-forces-armees',
    'commission-du-developpement-durable-et-de-lamenagement-du-territoire',
    'commission-des-finances-de-leconomie-generale-et-du-controle-budgetaire',
    'commission-des-lois-constitutionnelles-de-la-legislation-et-de-ladministration-generale-de-la-republique',
]

type OrganismeParlementaire = Database['public']['Tables']['OrganismeParlementaire']['Insert']

export async function GetCommissionsListFromGouvernementFR(): Promise<OrganismeParlementaire[]> {
    GetLogger().info('Retrieving organismes parlementaires from gouvernement.fr...')
    const organismeParlementaire: OrganismeParlementaire[] = []

    const url = "https://www.assemblee-nationale.fr"
    const uri = "/dyn/commissions-et-autres-organes"
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    try {
        await page.goto(`${url}${uri}`)
        await page.waitForSelector('#main')
        const bodyHTML = await page.content()
        const $ = cheerio.load(bodyHTML)

        let commissionUrl = []
        $('._gutter-xs .block-list--item').each((_, element) => {
            const href = $(element).find('a.inner').attr('href')
            if (href) {
                commissionUrl.push(href)
            }
        })
        page.close()
        for (const href of commissionUrl) {
            const commissionData = await GetCommissionsFromGouvernementFR(url, href, browser)
            organismeParlementaire.push(commissionData)
        }

    } catch (error) {
        GetLogger().error('Failed to retrieve organismes parlementaires: ', error)
    }
    finally {
        await browser.close()
        // console.log(organismeParlementaire)
        return Promise.resolve(organismeParlementaire)
    }
}

export async function GetCommissionsFromGouvernementFR(url: string, href: string, browser: Browser): Promise<OrganismeParlementaire> {
    GetLogger().info('Retrieving commissions permanentes from gouvernement.fr...')

    const pageCommission = await browser.newPage()
    const commissionUrl = `${url}${href}`
    let commissionName = ""
    let isPermanent = false
    let slug, replacedCommissionSlug
    try {
        await pageCommission.goto(commissionUrl)
        await pageCommission.waitForSelector('.page-content')
        const bodyHTML = await pageCommission.content()
        const $ = cheerio.load(bodyHTML)
        commissionName = $('h1.h1').text().trim()
        console.log(commissionName)
        slug = slugify(commissionName)
        isPermanent = $('span:contains("Commission permanente")') ? true : false
        replacedCommissionSlug = isPermanent ? commissionsPermanentes.find(o => o.includes(slug)) : slug

    } catch (error) {
        GetLogger().error('Failed to retrieve organismes parlementaires: ', error)
    }
    finally {
        await pageCommission.close()
        const commissionPermanente: OrganismeParlementaire = {
            EstPermanent: isPermanent,
            Slug: replacedCommissionSlug,
            Nom: commissionName,
        }
        return commissionPermanente
    }
}

export async function GetOrganismesParlementairesFromGouvernementFR(): Promise<OrganismeParlementaire[]> {
    GetLogger().info('Retrieving commissions from gouvernement.fr...')
    const organismeParlementaire: OrganismeParlementaire[] = []
    const legislature = "17"
    const url = `https://www2.assemblee-nationale.fr/recherche/resultats_recherche/(tri)/date/(legislature)/${legislature}/(query)/eyJxIjoidHlwZURvY3VtZW50OlwiY29tcHRlIHJlbmR1XCIgYW5kIGNvbnRlbnU6YSIsInJvd3MiOjEwLCJzdGFydCI6MCwid3QiOiJwaHAiLCJobCI6ImZhbHNlIiwiZmwiOiJ1cmwsdGl0cmUsdXJsRG9zc2llckxlZ2lzbGF0aWYsdGl0cmVEb3NzaWVyTGVnaXNsYXRpZix0ZXh0ZVF1ZXN0aW9uLHR5cGVEb2N1bWVudCxzc1R5cGVEb2N1bWVudCxydWJyaXF1ZSx0ZXRlQW5hbHlzZSxtb3RzQ2xlcyxhdXRldXIsZGF0ZURlcG90LHNpZ25hdGFpcmVzQW1lbmRlbWVudCxkZXNpZ25hdGlvbkFydGljbGUsc29tbWFpcmUsc29ydCIsInNvcnQiOiIifQ==`

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    let commissionNames: Set<string> = new Set()
    try {
        await retryGoto(page, url)
        await page.waitForSelector('#contenu-page')
        const bodyHTML = await page.content()
        const $ = cheerio.load(bodyHTML)

        const pElement = $('p:contains("résultats trouvés")').text().trim()
        const match = pElement.match(/(\d+) résultats trouvés/)
        const nombreResultats = match ? parseInt(match[1], 10) : undefined
        page.close()

        const resultsPerPage = 10
        const totalPages = Math.ceil(nombreResultats / resultsPerPage)
        for (let page = 1; page < totalPages; page++) {
            const offset = `(offset)/${page * resultsPerPage}/`
            let url = `https://www2.assemblee-nationale.fr/recherche/resultats_recherche/${offset}(tri)/date/(legislature)/${legislature}/(query)/eyJxIjoidHlwZURvY3VtZW50OlwiY29tcHRlIHJlbmR1XCIgYW5kIGNvbnRlbnU6YSIsInJvd3MiOjEwLCJzdGFydCI6MCwid3QiOiJwaHAiLCJobCI6ImZhbHNlIiwiZmwiOiJ1cmwsdGl0cmUsdXJsRG9zc2llckxlZ2lzbGF0aWYsdGl0cmVEb3NzaWVyTGVnaXNsYXRpZix0ZXh0ZVF1ZXN0aW9uLHR5cGVEb2N1bWVudCxzc1R5cGVEb2N1bWVudCxydWJyaXF1ZSx0ZXRlQW5hbHlzZSxtb3RzQ2xlcyxhdXRldXIsZGF0ZURlcG90LHNpZ25hdGFpcmVzQW1lbmRlbWVudCxkZXNpZ25hdGlvbkFydGljbGUsc29tbWFpcmUsc29ydCIsInNvcnQiOiIifQ==`
            const pageOffset = await browser.newPage()
            await retryGoto(pageOffset, url)
            await pageOffset.waitForSelector('#contenu-page')
            const bodyHTML = await pageOffset.content()
            const $ = cheerio.load(bodyHTML)
            $('a[title="Accédez au document"]').each((_, element) => {
                const name = $(element).find('strong').text().trim().split(' - ')[1]
                const url = $(element).attr('href')
                if (name) {
                    if (!commissionNames.has(name)) {
                        commissionNames.add(name)
                        const slugCommission = slugify(name)
                        const isPermanent = commissionsPermanentes.includes(slugCommission)
                        console.log(name)
                        organismeParlementaire.push({
                            Slug: slugCommission,
                            Nom: name,
                            EstPermanent: isPermanent
                        })
                        // } else {
                        //         commissionNamesMap.set(name, 1)
                        //         console.log(name, page + 1)
                        //     }
                        // }
                        // else {
                        //     commissionAutres.add($(element).find('strong').text().trim())
                        // }
                    }
                }

            })
            // sortedMap = new Map(Array.from(commissionNamesMap.entries()).sort((a, b) => { return b[1] - a[1] }))
            // let sum = 0
            // commissionNamesMap.forEach((value) => {
            //     sum += value
            // });
            // console.log(sum)
            pageOffset.close()
        }
        // Get Commission Speciales
        // const commissionSpecialesUrl = `https://www.assemblee-nationale.fr/dyn/${legislature}/organes/autres-commissions/commissions-speciales?statut=en-cours&limit=12`

    } catch (error) {
        GetLogger().error('Failed to retrieve commissions: ', error)
    }
    finally {
        // await fs.writeFile("./organismes.txt", Array.from(sortedMap).join('\n') + '\n')
        // await fs.writeFile("./organismes_names.txt", Array.from(commissionNames).join('\n') + '\n')
        // await fs.writeFile("./organismes2.txt", Array.from(commissionAutres).join('\n') + '\n')
        browser.close()
        console.log(organismeParlementaire)
        return Promise.resolve(organismeParlementaire)
    }
}