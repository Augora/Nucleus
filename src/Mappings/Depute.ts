import moment from "moment";

export function MapDepute(depute: Types.External.NosDeputesFR.Depute) {
  return {
    Slug: depute.slug,
    Nom: depute.nom,
    NomDeFamille: depute.nom_de_famille,
    Prenom: depute.prenom
  };
}

export function MapAutreMandat(
  autreMandat: Types.External.NosDeputesFR.AutreMandat
) {
  const splittedMandat = autreMandat.mandat.split(" / ");
  return {
    Localite: splittedMandat[0],
    Institution: splittedMandat[1],
    Intitule: splittedMandat[2]
  };
}

export function MapAncienMandat(
  autreMandat: Types.External.NosDeputesFR.AncienMandat
) {
  const splittedMandat = autreMandat.mandat.split(" / ");
  return {
    DateDeDebut: moment(splittedMandat[0], "dd/MM/yyyy").format(),
    DateDeFin: moment(splittedMandat[1], "dd/MM/yyyy").format(),
    Intitule: splittedMandat[2]
  };
}
