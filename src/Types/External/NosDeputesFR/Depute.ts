namespace Types.External.NosDeputesFR {
  export interface SiteWeb {
    site: string;
  }

  export interface Email {
    email: string;
  }

  export interface Adresse {
    adresse: string;
  }

  export interface Collaborateur {
    collaborateur: string;
  }

  export interface AutreMandat {
    mandat: string;
  }

  export interface AncienAutreMandat {
    mandat: string;
  }

  export interface AncienMandat {
    mandat: string;
  }

  export interface Depute {
    id: number;
    nom: string;
    nom_de_famille: string;
    prenom: string;
    sexe: string;
    date_naissance: string;
    lieu_naissance: string;
    num_deptmt: string;
    nom_circo: string;
    num_circo: number;
    mandat_debut: string;
    groupe_sigle: string;
    parti_ratt_financier: string;
    sites_web: SiteWeb[];
    emails: Email[];
    adresses: Adresse[];
    collaborateurs: Collaborateur[];
    autres_mandats: AutreMandat[];
    anciens_autres_mandats: AncienAutreMandat[];
    anciens_mandats: AncienMandat[];
    profession: string;
    place_en_hemicycle: string;
    url_an: string;
    id_an: string;
    slug: string;
    url_nosdeputes: string;
    url_nosdeputes_api: string;
    nb_mandats: number;
    twitter: string;
  }

  export interface Activite {
    periode: string;
    fin: boolean;
    labels: { [key: string]: string };
    vacances: { [key: string]: number };
    date_debut: Date;
    date_debut_parl: Date;
    date_fin: Date;
    n_presences: NP;
    n_participations: NP;
    n_questions: { [key: string]: number };
    presences_medi: PresencesMedi;
  }

  export interface NP {
    commission: { [key: string]: number };
    hemicycle: { [key: string]: number };
  }

  export interface PresencesMedi {
    commission: { [key: string]: number | string };
    hemicycle: { [key: string]: number | string };
    total: { [key: string]: number | string };
  }
}
