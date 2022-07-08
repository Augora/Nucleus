declare namespace Types.Canonical {
  interface GroupeParlementaire {
    Sigle: string
    NomComplet?: string
    Couleur?: string
    CouleurDetail?: CouleurDetail
    URLImage?: string
    Ordre?: number
    Actif?: boolean
    IDWikipedia?: string
    DescriptionWikipedia?: string
    IDAssembleeNationale?: string
  }

  interface CouleurDetail {
    HSL: HSLDetail
    RGB: RGBDetail
    HEX: string
  }

  interface HSLDetail {
    Full: string
    H: number
    S: number
    L: number
  }

  interface RGBDetail {
    Full: string
    R: number
    G: number
    B: number
  }
}
