import moment from 'moment'
import _ from 'lodash'

export function MapAutreMandat(
  autreMandat: string
): Types.Canonical.AutreMandat {
  const [Localite, Institution, Intitule] = autreMandat.split(' / ')
  return {
    AutreMandatComplet: autreMandat,
    Localite,
    Institution,
    Intitule,
  }
}

export function MapAncienMandat(
  ancienMandat: string
): Types.Canonical.AncienMandat {
  const [dateDebut, dateFin, intitule] = ancienMandat.split(' / ')
  return {
    AncienMandatComplet: ancienMandat,
    DateDeDebut: moment(dateDebut, 'dd/MM/yyyy').format(),
    DateDeFin: moment(dateFin, 'dd/MM/yyyy').format(),
    Intitule: intitule,
  }
}

export function MapActivites(
  activites: Types.External.NosDeputesFR.Activite
): Types.Canonical.Activite[] {
  return Object.keys(activites.labels).map((weekNumber) => {
    const weekNumberAsInt = parseInt(weekNumber, 10)
    return {
      DateDeDebut: moment(activites.date_fin, 'yyyy-MM-dd')
        .startOf('isoWeek')
        .subtract(weekNumberAsInt - 1, 'w')
        .format(),
      DateDeFin: moment(activites.date_fin, 'yyyy-MM-dd')
        .startOf('isoWeek')
        .subtract(weekNumberAsInt, 'w')
        .format(),
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

export function areTheSameActivites(
  actA: Types.Canonical.Activite,
  actB: Types.Canonical.Activite
): boolean {
  return (
    actA.NumeroDeSemaine === actB.NumeroDeSemaine &&
    actA.ParticipationEnHemicycle === actB.ParticipationEnHemicycle &&
    actA.ParticipationsEnCommission === actB.ParticipationsEnCommission &&
    actA.PresenceEnHemicycle === actB.PresenceEnHemicycle &&
    actA.PresencesEnCommission === actB.PresencesEnCommission &&
    actA.Question === actB.Question &&
    actA.Vacances === actB.Vacances
  )
}

export function areTheSameDeputes(
  depA: Types.Canonical.Depute,
  depB: Types.Canonical.Depute
): boolean {
  return (
    depA.Slug === depB.Slug &&
    depA.Nom === depB.Nom &&
    depA.NomDeFamille === depB.NomDeFamille &&
    depA.Prenom === depB.Prenom &&
    depA.Sexe === depB.Sexe &&
    depA.DateDeNaissance === depB.DateDeNaissance &&
    depA.LieuDeNaissance === depB.LieuDeNaissance &&
    depA.NumeroDepartement === depB.NumeroDepartement &&
    depA.NomCirconscription === depB.NomCirconscription &&
    depA.NumeroCirconscription === depB.NumeroCirconscription &&
    depA.DebutDuMandat === depB.DebutDuMandat &&
    depA.SigleGroupePolitique === depB.SigleGroupePolitique &&
    depA.parti_ratt_financier === depB.parti_ratt_financier &&
    // depA.Profession === depB.Profession &&
    depA.PlaceEnHemicycle === depB.PlaceEnHemicycle &&
    depA.URLAssembleeNationnale === depB.URLAssembleeNationnale &&
    depA.IDAssembleeNationnale === depB.IDAssembleeNationnale &&
    depA.URLNosdeputes === depB.URLNosdeputes &&
    depA.URLNosdeputesAPI === depB.URLNosdeputesAPI &&
    depA.NombreMandats === depB.NombreMandats &&
    depA.Twitter === depB.Twitter &&
    depA.EstEnMandat === depB.EstEnMandat &&
    _.difference(depA.SitesWeb, depB.SitesWeb).length === 0 &&
    _.difference(depA.Emails, depB.Emails).length === 0 &&
    _.difference(depA.Adresses, depB.Adresses).length === 0 &&
    _.difference(depA.Collaborateurs, depB.Collaborateurs).length === 0
  )
}

export function MapAdresse(adresse: string): Types.Canonical.Adresse {
  const CPRegex = /\ ([0-9]{5})/
  const PhoneRegex = /Téléphone : (((\+|00)\s?[0-9]{2})?\s?(?:[\s.-]?\d{1}){10})/
  const FaxRegex = /Télécopie : (((\+|00)\s?[0-9]{2})?\s?(?:[\s.-]?\d{1}){10})/

  // Postal code processing
  const CPRegexResult = CPRegex.exec(adresse)
  const CodePostal = CPRegexResult !== null ? CPRegexResult[1] : undefined

  // Phone number processing
  const PhoneRegexResult = PhoneRegex.exec(adresse)
  const Telephone =
    PhoneRegexResult !== null
      ? _.replace(PhoneRegexResult[1], /[\.\ ]+/g, '')
      : undefined

  // Fax number processing
  const FaxRegexResult = FaxRegex.exec(adresse)
  const Fax =
    FaxRegexResult !== null
      ? _.replace(FaxRegexResult[1], /[\.\ ]+/g, '')
      : undefined

  const [Adresse] = _.split(adresse, ' Téléphone : ')

  return {
    Adresse,
    CodePostal,
    Telephone,
    Fax,
    AdresseComplete: adresse,
  }
}

export function areTheSameAdresses(
  adA: Types.Canonical.Adresse,
  adB: Types.Canonical.Adresse
): boolean {
  return (
    adA.AdresseComplete === adB.AdresseComplete &&
    adA.Adresse === adB.Adresse &&
    adA.CodePostal === adB.CodePostal &&
    adA.Telephone === adB.Telephone
  )
}

export function areTheSameAnciensMandats(
  amA: Types.Canonical.AncienMandat,
  amB: Types.Canonical.AncienMandat
): boolean {
  return (
    amA.AncienMandatComplet === amB.AncienMandatComplet &&
    amA.DateDeDebut === amB.DateDeDebut &&
    amA.DateDeFin === amB.DateDeFin &&
    amA.Intitule === amB.Intitule
  )
}

export function areTheSameAutresMandats(
  amA: Types.Canonical.AutreMandat,
  amB: Types.Canonical.AutreMandat
): boolean {
  return (
    amA.AutreMandatComplet === amB.AutreMandatComplet &&
    amA.Institution === amB.Institution &&
    amA.Intitule === amB.Intitule &&
    amA.Localite === amB.Localite
  )
}
