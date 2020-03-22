namespace Types.Canonical {
  export interface Depute {
    Slug: string
    Nom: string
    NomDeFamille: string
    Prenom: string
    Sexe: string
    DateDeNaissance: string
    LieuDeNaissance: string
    NumeroDepartement: string
    NomCirconscription: string
    NumeroCirconscription: number
    DebutDuMandat: string
    SigleGroupePolitique: string
    parti_ratt_financier: string
    Profession: string
    PlaceEnHemicycle: string
    URLAssembleeNationnale: string
    IDAssembleeNationnale: string
    URLAssembleeNationale: string
    IDAssembleeNationale: string
    URLNosdeputes: string
    URLNosdeputesAPI: string
    NombreMandats: number
    Twitter: string
    EstEnMandat: boolean
    Age: number
    URLPhotoAssembleeNationnale: string
    URLPhotoAugora: string
    SitesWeb: string[]
    Emails: string[]
    Adresses: string[]
    Collaborateurs: string[]
  }
}
