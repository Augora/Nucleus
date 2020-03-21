namespace Types.Canonical {
  export interface Depute {
    Slug: String;
    Nom: String;
    NomDeFamille: String;
    Prenom: String;
    Sexe: String;
    DateDeNaissance: String;
    LieuDeNaissance: String;
    NumeroDepartement: String;
    NomCirconscription: String;
    NumeroCirconscription: Number;
    DebutDuMandat: String;
    SigleGroupePolitique: String;
    parti_ratt_financier: String;
    Profession: String;
    PlaceEnHemicycle: String;
    URLAssembleeNationnale: String;
    IDAssembleeNationnale: String;
    URLAssembleeNationale: String;
    IDAssembleeNationale: String;
    URLNosdeputes: String;
    URLNosdeputesAPI: String;
    NombreMandats: Number;
    Twitter: String;
    EstEnMandat: Boolean;
    Age: Number;
    URLPhotoAssembleeNationnale: String;
    URLPhotoAugora: String;
    SitesWeb: String[];
    Emails: String[];
    Adresses: String[];
    Collaborateurs: String[];
  }
}
