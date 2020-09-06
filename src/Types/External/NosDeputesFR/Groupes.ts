namespace Types.External.NosDeputesFR {
  export interface Organismes {
    organismes: [OrganismeWrapper]
  }

  export interface OrganismeWrapper {
    organisme: Organisme
  }

  export interface Organisme {
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
