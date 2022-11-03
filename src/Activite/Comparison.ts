import dayjs from 'dayjs'

import { Database } from '../../Types/database.types'

type Activite = Database['public']['Tables']['Activite']['Insert']

export function AreTheSameActivites(actA: Activite, actB: Activite): boolean {
  return (
    actA.NumeroDeSemaine === actB.NumeroDeSemaine &&
    dayjs(actA.DateDeDebut).diff(actB.DateDeDebut, 'days', false) === 0 &&
    dayjs(actA.DateDeFin).diff(actB.DateDeFin, 'days', false) === 0 &&
    actA.ParticipationEnHemicycle === actB.ParticipationEnHemicycle &&
    actA.ParticipationsEnCommission === actB.ParticipationsEnCommission &&
    actA.PresenceEnHemicycle === actB.PresenceEnHemicycle &&
    actA.PresencesEnCommission === actB.PresencesEnCommission &&
    actA.Question === actB.Question &&
    actA.Vacances === actB.Vacances &&
    actA.MedianeCommission === actB.MedianeCommission &&
    actA.MedianeHemicycle === actB.MedianeHemicycle &&
    actA.MedianeTotal === actB.MedianeTotal
  )
}
