namespace Types.Canonical {
  export interface Activite {
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
