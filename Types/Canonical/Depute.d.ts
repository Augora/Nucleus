declare namespace Types.Canonical {
  interface Depute {
    Slug: string
    Nom?: string
    NomDeFamille?: string
    Prenom?: string
    Sexe?: string
    DateDeNaissance?: string
    LieuDeNaissance?: string
    NumeroDepartement?: string
    NomDepartement?: string
    NumeroRegion?: string
    NomRegion?: string
    NomCirconscription?: string
    NumeroCirconscription?: number
    DebutDuMandat?: string
    RattachementFinancier?: string
    Profession?: string
    PlaceEnHemicycle?: string
    URLAssembleeNationale?: string
    IDAssembleeNationale?: string
    URLNosdeputes?: string
    URLNosdeputesAPI?: string
    NombreMandats?: number
    Twitter?: string
    EstEnMandat?: boolean
    Age?: number
    URLPhotoAssembleeNationale?: string
    URLTwitter?: string
    URLFacebook?: string
    URLLinkedIn?: string
    URLInstagram?: string
    URLPhotoAugora?: string
    SitesWeb?: string[]
    Emails?: string[]
    Collaborateurs?: string[]
    Adresses?: Adresse[]
    AutreMandat?: AutreMandat[]
    AncienMandat?: AncienMandat[]
    OrganismeParlementaire?: OrganismeParlementaire[]
    GroupeParlementaire?: string
    ResponsabiliteGroupe?: ResponsabiliteGroupe
  }
}
