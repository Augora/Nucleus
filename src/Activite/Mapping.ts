import dayjs from 'dayjs'
import ceil from 'lodash/ceil'
import isUndefined from 'lodash/isUndefined'
import isNull from 'lodash/isNull'

export function MapActivites(
  depute: Types.Canonical.Depute,
  activites: Types.External.NosDeputesFR.Activite
): Types.Canonical.Activite[] {
  return Object.keys(activites.labels).map((weekNumber) => {
    const weekNumberAsInt = parseInt(weekNumber, 10)
    const dateDeDebut = dayjs(activites.date_debut, 'YYYY-MM-DD')
      .startOf('w')
      .add(weekNumberAsInt, 'w')
    const isWeekBeforeMandat = dateDeDebut.isBefore(dayjs(depute.DebutDuMandat))

    return {
      Id: `${depute.Slug}_${weekNumber}`,
      DeputeSlug: depute.Slug,
      DateDeDebut: dateDeDebut.format('YYYY-MM-DDTHH:mm:ss'),
      DateDeFin: dateDeDebut.add(1, 'w').format('YYYY-MM-DDTHH:mm:ss'),
      NumeroDeSemaine: weekNumberAsInt,
      PresencesEnCommission: ceil(activites.n_presences.commission[weekNumber]),
      PresenceEnHemicycle: ceil(activites.n_presences.hemicycle[weekNumber]),
      ParticipationsEnCommission: ceil(
        activites.n_participations.commission[weekNumber]
      ),
      ParticipationEnHemicycle: ceil(
        activites.n_participations.hemicycle[weekNumber]
      ),
      Question:
        isUndefined(activites.n_questions) || isNull(activites.n_questions)
          ? 0
          : ceil(activites.n_questions[weekNumber]),
      Vacances: isWeekBeforeMandat ? 0 : ceil(activites.vacances[weekNumber]),
      AvantMandat: isWeekBeforeMandat ? 20 : 0,
    }
  })
}
