import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import {
  split,
  toLower,
  upperFirst,
  join,
  isUndefined,
  isNull,
  includes,
  lowerCase,
  replace,
  trim,
  isEmpty,
} from 'lodash'

import Departements from '../StaticData/Deputes/departments.json'
import Regions from '../StaticData/Deputes/regions.json'

function processNomDepartement(numeroDepartement: string, slug: string) {
  if (!numeroDepartement) return undefined
  if (numeroDepartement === '999') {
    return 'Établis Hors de France'
  } else {
    const departement = Departements.find((d) => d.code === numeroDepartement)
    if (departement) {
      return departement.name
    } else {
      throw new Error(
        `${slug}: Département ${numeroDepartement} introuvable dans nos données.`
      )
    }
  }
}

function processNumeroRegion(numeroDepartement: string, slug: string) {
  if (!numeroDepartement) return undefined
  if (numeroDepartement === '999') {
    return '00'
  } else {
    const departement = Departements.find((d) => d.code === numeroDepartement)
    const region = Regions.find((r) => r.code === departement.region_code)
    if (departement && region) {
      return region.code
    } else {
      throw new Error(
        `${slug}: Département ${numeroDepartement} introuvable dans nos données.`
      )
    }
  }
}

function processNomRegion(numeroDepartement: string, slug: string) {
  if (!numeroDepartement) return undefined
  if (numeroDepartement === '999') {
    return 'Établis Hors de France'
  } else {
    const departement = Departements.find((d) => d.code === numeroDepartement)
    const region = Regions.find((r) => r.code === departement.region_code)
    if (departement && region) {
      return region.name
    } else {
      throw new Error(
        `${slug}: Département ${numeroDepartement} introuvable dans nos données.`
      )
    }
  }
}

function isWebSiteTwitter(website: string) {
  return includes(lowerCase(website), 'twitter')
}

function isWebSiteFacebook(website: string) {
  return includes(lowerCase(website), 'facebook')
}

function isWebSiteInstagram(website: string) {
  return includes(lowerCase(website), 'instagram')
}

function isWebSiteLinkedIn(website: string) {
  return includes(lowerCase(website), 'linkedin')
}

export function MapDepute(
  depute: Types.External.NosDeputesFR.Depute
): Types.Canonical.Depute {
  return {
    Slug: depute.slug,
    Nom: depute.nom,
    NomDeFamille: depute.nom_de_famille,
    Prenom: depute.prenom,
    Sexe: depute.sexe,
    DateDeNaissance: depute.date_naissance,
    LieuDeNaissance: depute.lieu_naissance,
    NumeroDepartement: depute.num_deptmt,
    NomDepartement: processNomDepartement(depute.num_deptmt, depute.slug),
    NumeroRegion: processNumeroRegion(depute.num_deptmt, depute.slug),
    NomRegion: processNomRegion(depute.num_deptmt, depute.slug),
    NomCirconscription: depute.nom_circo,
    NumeroCirconscription: depute.num_circo,
    DebutDuMandat: depute.mandat_debut,
    RattachementFinancier: isEmpty(depute.parti_ratt_financier)
      ? 'Non déclaré(s)'
      : depute.parti_ratt_financier,
    Profession: depute.profession ? depute.profession : '',
    PlaceEnHemicycle: depute.place_en_hemicycle,
    URLAssembleeNationale: depute.url_an,
    IDAssembleeNationale: depute.id_an,
    URLNosdeputes: depute.url_nosdeputes,
    URLNosdeputesAPI: depute.url_nosdeputes_api,
    NombreMandats: depute.nb_mandats,
    Twitter: depute.twitter,
    EstEnMandat: depute.ancien_depute !== 1,
    Age: dayjs().diff(depute.date_naissance, 'years', false),
    URLPhotoAssembleeNationale: `http://www2.assemblee-nationale.fr/static/tribun/15/photos/${depute.id_an}.jpg`,
    URLPhotoAugora: `https://static.augora.fr/depute/${depute.slug}`,
    URLTwitter: depute.sites_web
      .map((s) => s.site)
      .find((s) => isWebSiteTwitter(s)),
    URLFacebook: depute.sites_web
      .map((s) => s.site)
      .find((s) => isWebSiteFacebook(s)),
    URLInstagram: depute.sites_web
      .map((s) => s.site)
      .find((s) => isWebSiteInstagram(s)),
    URLLinkedIn: depute.sites_web
      .map((s) => s.site)
      .find((s) => isWebSiteLinkedIn(s)),
    SitesWeb: depute.sites_web
      .map((s) => s.site)
      .filter(
        (s) =>
          !isWebSiteTwitter(s) &&
          !isWebSiteFacebook(s) &&
          !isWebSiteInstagram(s) &&
          !isWebSiteLinkedIn(s)
      ),
    Emails: depute.emails.map((e) => e.email),
    Adresses: depute.adresses
      .map((a) => a.adresse)
      .filter(
        (a) =>
          !a.startsWith('Sur rendez-vous') &&
          !a.startsWith('Varsovie/Konstancin') &&
          !a.startsWith('Allemagne et Autriche')
      )
      .map((a) => MapAdresse(a)),
    Collaborateurs: depute.collaborateurs.map((c) =>
      join(
        split(c.collaborateur, ' ').map((mc) =>
          join(
            split(mc, '-').map((mcsplitted) => upperFirst(toLower(mcsplitted))),
            '-'
          )
        ),
        ' '
      )
    ),
    GroupeParlementaire:
      isUndefined(depute.groupe_sigle) || isNull(depute.groupe_sigle)
        ? 'NI'
        : depute.groupe_sigle,
    ResponsabiliteGroupe: {
      GroupeParlementaire: {
        Sigle:
          isUndefined(depute.groupe_sigle) || isNull(depute.groupe_sigle)
            ? 'NI'
            : depute.groupe_sigle,
      },
      Fonction: depute.groupe ? depute.groupe.fonction : 'membre',
      DebutFonction: depute.groupe
        ? depute.groupe.debut_fonction
        : depute.mandat_debut,
      FinFonction: depute.groupe
        ? depute.groupe.fin_fonction
        : depute.mandat_fin,
    },
    AutreMandat: depute.autres_mandats.map((am) => MapAutreMandat(am.mandat)),
    AncienMandat: depute.anciens_mandats.map((am) =>
      MapAncienMandat(am.mandat)
    ),
  }
}

export function MapAdresse(adresse: string): Types.Canonical.Adresse {
  const CPRegex = /\ ([0-9]{5})/
  const PhoneRegex =
    /Téléphone : (((\+|00)\s?[0-9]{2})?\s?(?:[\s.-]?\d{1}){10})/
  const FaxRegex = /Télécopie : (((\+|00)\s?[0-9]{2})?\s?(?:[\s.-]?\d{1}){10})/

  // Postal code processing
  const CPRegexResult = CPRegex.exec(adresse)
  const CodePostal = CPRegexResult !== null ? CPRegexResult[1] : undefined

  // Phone number processing
  const PhoneRegexResult = PhoneRegex.exec(adresse)
  const Telephone =
    PhoneRegexResult !== null
      ? replace(PhoneRegexResult[1], /[\.\ ]+/g, '')
      : undefined

  // Fax number processing
  const FaxRegexResult = FaxRegex.exec(adresse)
  const Fax =
    FaxRegexResult !== null
      ? replace(FaxRegexResult[1], /[\.\ ]+/g, '')
      : undefined

  const [Adresse] = split(adresse, ' Téléphone : ')

  return {
    Adresse,
    CodePostal,
    Telephone,
    Fax,
    AdresseComplete: adresse,
  }
}

export function MapAutreMandat(
  autreMandat: string
): Types.Canonical.AutreMandat {
  const [Localite, Institution, Intitule] = autreMandat.split(' / ')
  return {
    AutreMandatComplet: autreMandat,
    Localite,
    Institution,
    Intitule,
  }
}

export function MapAncienMandat(
  ancienMandat: string
): Types.Canonical.AncienMandat {
  const [dateDebut, dateFin, intitule] = ancienMandat
    .split(' /')
    .map((s) => trim(s))
  return {
    AncienMandatComplet: ancienMandat,
    DateDeDebut:
      dateDebut && dateDebut.length > 0
        ? dayjs(dateDebut, 'DD/MM/YYYY', true).format('YYYY-MM-DDTHH:mm:ss')
        : undefined,
    DateDeFin:
      dateFin && dateFin.length > 0
        ? dayjs(dateFin, 'DD/MM/YYYY', true).format('YYYY-MM-DDTHH:mm:ss')
        : undefined,
    Intitule: intitule && intitule.length > 0 ? intitule : undefined,
  }
}
