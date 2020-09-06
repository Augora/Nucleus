namespace Types.External.NosDeputesFR {
  export interface Organismes {
    oganismes: [OrganismeWrapper]
  }

  export interface OrganismeWrapper {
    oganisme: Organisme
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
