declare namespace Types.External.NosDeputesFR {
  interface Organismes {
    organismes: [OrganismeWrapper]
  }

  interface OrganismeWrapper {
    organisme: Organisme
  }

  interface Organisme {
    id: number
    slug: string
    nom: string
    acronyme: string
    groupe_actuel: boolean
    couleur: string
    order: number
    type: string
    url_nosdeputes: string
    url_nosdeputes_api: string
  }
}
