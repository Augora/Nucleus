import dayjs from 'dayjs'

export function AreTheSameActivites(
  actA: Types.Canonical.Activite,
  actB: Types.Canonical.Activite
): boolean {
  return (
    actA.NumeroDeSemaine === actB.NumeroDeSemaine &&
    dayjs(actA.DateDeDebut).diff(actB.DateDeDebut, 'days', false) === 0 &&
    dayjs(actA.DateDeFin).diff(actB.DateDeFin, 'days', false) === 0 &&
    actA.ParticipationEnHemicycle === actB.ParticipationEnHemicycle &&
    actA.ParticipationsEnCommission === actB.ParticipationsEnCommission &&
    actA.PresenceEnHemicycle === actB.PresenceEnHemicycle &&
    actA.PresencesEnCommission === actB.PresencesEnCommission &&
    actA.Question === actB.Question &&
    actA.Vacances === actB.Vacances
  )
}
