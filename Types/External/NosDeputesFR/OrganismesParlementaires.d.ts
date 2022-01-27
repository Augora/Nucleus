declare namespace Types.External.NosDeputesFR {
  
  interface OrganismesParlementaires {
    organismes: [OrganismeParlementaireWrapper]
  }

  interface OrganismeParlementaireWrapper {
    organisme: OrganismeParlementaire
  }

  interface OrganismeParlementaire {
    id: number
    slug: string
    nom: string
    type: string
    url_nosdeputes: string
    url_nosdeputes_api: string
  }
}
