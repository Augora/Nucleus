declare namespace Types.Canonical {
  interface Activite {
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
  }
}
