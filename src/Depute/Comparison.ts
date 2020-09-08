import { difference } from 'lodash'

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
    depA.NomCirconscription === depB.NomCirconscription &&
    depA.NumeroCirconscription === depB.NumeroCirconscription &&
    depA.DebutDuMandat === depB.DebutDuMandat &&
    depA.parti_ratt_financier === depB.parti_ratt_financier &&
    // depA.Profession === depB.Profession &&
    depA.PlaceEnHemicycle === depB.PlaceEnHemicycle &&
    depA.URLNosdeputes === depB.URLNosdeputes &&
    depA.URLNosdeputesAPI === depB.URLNosdeputesAPI &&
    depA.NombreMandats === depB.NombreMandats &&
    depA.Twitter === depB.Twitter &&
    depA.EstEnMandat === depB.EstEnMandat &&
    depA.URLAssembleeNationale === depB.URLAssembleeNationale &&
    depA.IDAssembleeNationale === depB.IDAssembleeNationale &&
    depA.URLPhotoAugora === depB.URLPhotoAugora &&
    difference(depA.SitesWeb, depB.SitesWeb).length === 0 &&
    difference(depA.Emails, depB.Emails).length === 0 &&
    difference(depA.Adresses, depB.Adresses).length === 0 &&
    difference(depA.Collaborateurs, depB.Collaborateurs).length === 0
  )
}
