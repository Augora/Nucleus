import { difference, isArray } from 'lodash'
import { CompareLists } from '../Tools/Comparison'

function areArraysTheSame(arr1: any[], arr2: any[]) {
  return (
    difference(arr1, arr2).length === 0 && difference(arr2, arr1).length === 0
  )
}

export function areTheSameAdresses(
  adA: Types.Canonical.Adresse,
  adB: Types.Canonical.Adresse
) {
  return (
    adA.AdresseComplete === adB.AdresseComplete &&
    adA.Adresse === adB.Adresse &&
    adA.CodePostal === adB.CodePostal &&
    adA.Telephone === adB.Telephone
  )
}

function areAdressTheSame(
  arr1: Types.Canonical.Adresse[],
  arr2: Types.Canonical.Adresse[]
) {
  return (
    isArray(arr1) &&
    isArray(arr2) &&
    CompareLists(arr1, arr2, areTheSameAdresses, 'AdresseComplete').length === 0
  )
}

export function AreTheSameDeputes(
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
    areAdressTheSame(depA.Adresses, depB.Adresses) &&
    areArraysTheSame(depA.Collaborateurs, depB.Collaborateurs) &&
    depA?.GroupeParlementaire?.Sigle === depB?.GroupeParlementaire?.Sigle &&
    depA?.ResponsabiliteGroupe?.Fonction ===
      depB?.ResponsabiliteGroupe?.Fonction
  )
}
