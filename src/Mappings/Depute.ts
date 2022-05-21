import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/fr'
import _ from 'lodash'

dayjs.extend(customParseFormat)
dayjs.locale('fr')

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
  const [dateDebut, dateFin, intitule] = ancienMandat
    .split(' /')
    .map((s) => _.trim(s))
  return {
    AncienMandatComplet: ancienMandat,
    DateDeDebut:
      dateDebut && dateDebut.length > 0
        ? dayjs(dateDebut, 'DD/MM/YYYY', true).format('YYYY-MM-DDTHH:mm:ss')
        : undefined,
    DateDeFin:
      dateFin && dateFin.length > 0
        ? dayjs(dateFin, 'DD/MM/YYYY', true).format('YYYY-MM-DDTHH:mm:ss')
        : undefined,
    Intitule: intitule && intitule.length > 0 ? intitule : undefined,
  }
}

export function areTheSameActivites(
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
    actA.Vacances === actB.Vacances &&
    actA.MedianeCommission === actB.MedianeCommission &&
    actA.MedianeHemicycle === actB.MedianeHemicycle &&
    actA.MedianeTotal === actB.MedianeTotal
  )
}

export function MapAdresse(adresse: string): Types.Canonical.Adresse {
  const CPRegex = /\ ([0-9]{5})/
  const PhoneRegex =
    /Téléphone : (((\+|00)\s?[0-9]{2})?\s?(?:[\s.-]?\d{1}){10})/
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
    dayjs(amA.DateDeDebut).diff(amB.DateDeDebut, 'days', false) === 0 &&
    dayjs(amA.DateDeFin).diff(amB.DateDeFin, 'days', false) === 0 &&
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
