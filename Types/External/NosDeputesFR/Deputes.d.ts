declare namespace Types.External.NosDeputesFR {
  interface DeputesWrapper {
    deputes: [SimpleDeputeWrapper]
  }

  interface SimpleDeputeWrapper {
    depute: SimpleDepute
  }

  interface SiteWeb {
    site: string
  }

  interface Email {
    email: string
  }

  interface Adresse {
    adresse: string
  }

  interface Collaborateur {
    collaborateur: string
  }

  interface AutreMandat {
    mandat: string
  }

  interface AncienAutreMandat {
    mandat: string
  }

  interface AncienMandat {
    mandat: string
  }

  interface SimpleDepute {
    id: number
    nom: string
    nom_de_famille: string
    prenom: string
    sexe: string
    date_naissance: string
    lieu_naissance: string
    num_deptmt: string
    nom_circo: string
    num_circo: number
    mandat_debut: string
    groupe_sigle: string
    parti_ratt_financier: string
    sites_web: SiteWeb[]
    emails: Email[]
    adresses: Adresse[]
    collaborateurs: Collaborateur[]
    autres_mandats: AutreMandat[]
    anciens_autres_mandats: AncienAutreMandat[]
    anciens_mandats: AncienMandat[]
    profession: string
    place_en_hemicycle: string
    url_an: string
    id_an: string
    slug: string
    url_nosdeputes: string
    url_nosdeputes_api: string
    nb_mandats: number
    twitter: string
    ancien_depute?: number
  }

  interface Activite {
    periode: string
    fin: boolean
    labels: { [key: string]: string }
    vacances: { [key: string]: number }
    date_debut: Date
    date_debut_parl: Date
    date_fin: Date
    n_presences: NP
    n_participations: NP
    n_questions: { [key: string]: number }
    presences_medi: PresencesMedi
  }

  interface NP {
    commission: { [key: string]: number }
    hemicycle: { [key: string]: number }
  }

  interface PresencesMedi {
    commission: { [key: string]: number | string }
    hemicycle: { [key: string]: number | string }
    total: { [key: string]: number | string }
  }
}
