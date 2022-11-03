import { difference, isArray, isObject } from 'lodash'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { CompareLists } from '../Tools/Comparison'
import { Database } from '../../Types/database.types'

type Depute = Database['public']['Tables']['Depute']['Insert']

function areArraysTheSame(arr1: any[], arr2: any[]) {
  return (
    difference(arr1, arr2).length === 0 && difference(arr2, arr1).length === 0
  )
}

export function areTheSameAdresses(adA, adB) {
  return (
    adA.AdresseComplete === adB.AdresseComplete &&
    adA.Adresse === adB.Adresse &&
    adA.CodePostal === adB.CodePostal &&
    adA.Telephone === adB.Telephone
  )
}

function areAdresseArraysTheSame(arr1, arr2) {
  return (
    isArray(arr1) &&
    isArray(arr2) &&
    CompareLists(arr1, arr2, areTheSameAdresses, 'AdresseComplete').length === 0
  )
}

function areAncienMandatArraysTheSame(arr1, arr2) {
  return (
    isArray(arr1) &&
    isArray(arr2) &&
    CompareLists(arr1, arr2, areTheSameAnciensMandats, 'AncienMandatComplet')
      .length === 0
  )
}

function areAutreMandatArraysTheSame(arr1, arr2) {
  return (
    isArray(arr1) &&
    isArray(arr2) &&
    CompareLists(arr1, arr2, areTheSameAutresMandats, 'AutreMandatComplet')
      .length === 0
  )
}

export function areTheSameAnciensMandats(amA, amB): boolean {
  return (
    amA.AncienMandatComplet === amB.AncienMandatComplet &&
    dayjs(amA.DateDeDebut).diff(amB.DateDeDebut, 'days', false) === 0 &&
    dayjs(amA.DateDeFin).diff(amB.DateDeFin, 'days', false) === 0 &&
    amA.Intitule === amB.Intitule
  )
}

export function areTheSameAutresMandats(amA, amB): boolean {
  return (
    amA.AutreMandatComplet === amB.AutreMandatComplet &&
    amA.Institution === amB.Institution &&
    amA.Intitule === amB.Intitule &&
    amA.Localite === amB.Localite
  )
}

export function AreTheSameDeputes(depA: Depute, depB: Depute): boolean {
  return (
    depA.Slug === depB.Slug &&
    depA.Nom === depB.Nom &&
    depA.NomDeFamille === depB.NomDeFamille &&
    depA.Prenom === depB.Prenom &&
    depA.Sexe === depB.Sexe &&
    depA.DateDeNaissance === depB.DateDeNaissance &&
    depA.LieuDeNaissance === depB.LieuDeNaissance &&
    depA.NumeroDepartement === depB.NumeroDepartement &&
    depA.NomDepartement === depB.NomDepartement &&
    depA.NumeroRegion === depB.NumeroRegion &&
    depA.NomRegion === depB.NomRegion &&
    depA.NomCirconscription === depB.NomCirconscription &&
    depA.NumeroCirconscription === depB.NumeroCirconscription &&
    depA.DebutDuMandat === depB.DebutDuMandat &&
    depA.RattachementFinancier === depB.RattachementFinancier &&
    // depA.Profession === depB.Profession &&
    depA.PlaceEnHemicycle === depB.PlaceEnHemicycle &&
    depA.URLAssembleeNationale === depB.URLAssembleeNationale &&
    depA.IDAssembleeNationale === depB.IDAssembleeNationale &&
    depA.URLNosdeputes === depB.URLNosdeputes &&
    depA.URLNosdeputesAPI === depB.URLNosdeputesAPI &&
    depA.NombreMandats === depB.NombreMandats &&
    depA.Twitter === depB.Twitter &&
    depA.EstEnMandat === depB.EstEnMandat &&
    depA.Age === depB.Age &&
    depA.URLPhotoAssembleeNationale === depB.URLPhotoAssembleeNationale &&
    depA.URLPhotoAugora === depB.URLPhotoAugora &&
    areArraysTheSame(depA.SitesWeb, depB.SitesWeb) &&
    areArraysTheSame(depA.Emails, depB.Emails) &&
    areAdresseArraysTheSame(depA.Adresses, depB.Adresses) &&
    areAncienMandatArraysTheSame(depA.AncienMandat, depB.AncienMandat) &&
    areAutreMandatArraysTheSame(depA.AutreMandat, depB.AutreMandat) &&
    areArraysTheSame(depA.Collaborateurs, depB.Collaborateurs) &&
    depA?.GroupeParlementaire === depB?.GroupeParlementaire
    // depA?.ResponsabiliteGroupe?.Fonction ===
    //   depB?.ResponsabiliteGroupe?.Fonction
  )
}
