declare namespace Types.External.NosDeputesFR {
  interface DeputeWrapper {
    depute: Depute
  }

  interface Depute {
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
    mandat_fin: string
    groupe: Groupe
    groupe_sigle: string
    parti_ratt_financier: string
    responsabilites: GroupesParlementaire[]
    responsabilites_extra_parlementaires: GroupesParlementaire[]
    groupes_parlementaires: GroupesParlementaire[]
    historique_responsabilites: GroupesParlementaire[]
    sites_web: SitesWeb[]
    emails: Email[]
    adresses: Adress[]
    collaborateurs: Collaborateur[]
    autres_mandats: SMandat[]
    anciens_autres_mandats: any[]
    anciens_mandats: SMandat[]
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
    organisme_parlementaire: OrganismeParlementaire
  }

  interface Adress {
    adresse: string
  }

  interface SMandat {
    mandat: string
  }

  interface Collaborateur {
    collaborateur: string
  }

  interface Email {
    email: string
  }

  interface Groupe {
    organisme: string
    fonction: string
    debut_fonction: string
    fin_fonction?: string
  }

  interface GroupesParlementaire {
    responsabilite: Groupe
  }

  interface SitesWeb {
    site: string
  }
}
