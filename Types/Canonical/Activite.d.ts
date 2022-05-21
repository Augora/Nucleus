declare namespace Types.Canonical {
  interface Activite {
    Id: string
    DeputeSlug: string
    NumeroDeSemaine: number
    DateDeDebut?: string
    DateDeFin?: string
    PresencesEnCommission?: number
    PresenceEnHemicycle?: number
    ParticipationsEnCommission?: number
    ParticipationEnHemicycle?: number
    Question?: number
    Vacances?: number
    AvantMandat?: number
    MedianeCommission?: number
    MedianeHemicycle?: number
    MedianeTotal?: number
  }
}
