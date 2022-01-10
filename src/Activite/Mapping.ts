import dayjs from 'dayjs'

export function MapActivites(
  slug: string,
  activites: Types.External.NosDeputesFR.Activite
): Types.Canonical.Activite[] {
  return Object.keys(activites.labels).map((weekNumber) => {
    const weekNumberAsInt = parseInt(weekNumber, 10)
    return {
      Id: `${slug}_${weekNumber}`,
      DeputeSlug: slug,
      DateDeDebut: dayjs(activites.date_debut, 'YYYY-MM-DD')
        .startOf('w')
        .add(weekNumberAsInt, 'w')
        .format('YYYY-MM-DDTHH:mm:ss'),
      DateDeFin: dayjs(activites.date_debut, 'YYYY-MM-DD')
        .startOf('w')
        .add(weekNumberAsInt + 1, 'w')
        .format('YYYY-MM-DDTHH:mm:ss'),
      NumeroDeSemaine: weekNumberAsInt,
      PresencesEnCommission: Math.ceil(
        activites.n_presences.commission[weekNumber]
      ),
      PresenceEnHemicycle: Math.ceil(
        activites.n_presences.hemicycle[weekNumber]
      ),
      ParticipationsEnCommission: Math.ceil(
        activites.n_participations.commission[weekNumber]
      ),
      ParticipationEnHemicycle: Math.ceil(
        activites.n_participations.hemicycle[weekNumber]
      ),
      Question: Math.ceil(activites.n_questions[weekNumber]),
      Vacances: Math.ceil(activites.vacances[weekNumber]),
    }
  })
}
