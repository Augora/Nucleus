import moment from "moment";
import _ from "lodash";

export function MapDepute(
  depute: Types.External.NosDeputesFR.Depute
): Types.Canonical.Depute {
  return {
    Slug: depute.slug,
    Nom: depute.nom,
    NomDeFamille: depute.nom_de_famille,
    Prenom: depute.prenom,
    Sexe: depute.sexe,
    DateDeNaissance: depute.date_naissance,
    LieuDeNaissance: depute.lieu_naissance,
    NumeroDepartement: depute.num_deptmt,
    NomCirconscription: depute.nom_circo,
    NumeroCirconscription: depute.num_circo,
    DebutDuMandat: depute.mandat_debut,
    SigleGroupePolitique: depute.groupe_sigle,
    parti_ratt_financier: depute.parti_ratt_financier,
    Profession: depute.profession,
    PlaceEnHemicycle: depute.place_en_hemicycle,
    URLAssembleeNationnale: depute.url_an,
    IDAssembleeNationnale: depute.id_an,
    URLNosdeputes: depute.url_nosdeputes,
    URLNosdeputesAPI: depute.url_nosdeputes_api,
    NombreMandats: depute.nb_mandats,
    Twitter: depute.twitter,
    EstEnMandat: depute.ancien_depute !== 1,
    Age: moment().diff(depute.date_naissance, "years", false),
    SitesWeb: depute.sites_web.map(s => s.site),
    Emails: depute.emails.map(e => e.email),
    Adresses: depute.adresses.map(a => a.adresse),
    Collaborateurs: depute.collaborateurs.map(c => c.collaborateur)
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

export function MapActivites(
  activites: Types.External.NosDeputesFR.Activite
): Types.Canonical.Activite[] {
  return Object.keys(activites.labels).map(weekNumber => {
    const weekNumberAsInt = parseInt(weekNumber);
    return {
      DateDeDebut: moment(activites.date_fin, "yyyy-MM-dd")
        .startOf("isoWeek")
        .subtract(weekNumberAsInt - 1, "w")
        .format(),
      DateDeFin: moment(activites.date_fin, "yyyy-MM-dd")
        .startOf("isoWeek")
        .subtract(weekNumberAsInt, "w")
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
      Vacances: Math.ceil(activites.vacances[weekNumber])
    };
  });
}

export function areTheSameActivites(
  actA: Types.Canonical.Activite,
  actB: Types.Canonical.Activite
): Boolean {
  return (
    actA.NumeroDeSemaine === actB.NumeroDeSemaine &&
    actA.ParticipationEnHemicycle === actB.ParticipationEnHemicycle &&
    actA.ParticipationsEnCommission === actB.ParticipationsEnCommission &&
    actA.PresenceEnHemicycle === actB.PresenceEnHemicycle &&
    actA.PresencesEnCommission === actB.PresencesEnCommission &&
    actA.Question === actB.Question &&
    actA.Vacances === actB.Vacances
  );
}

export function areTheSameDeputes(
  depA: Types.Canonical.Depute,
  depB: Types.Canonical.Depute
): Boolean {
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
  );
}

export function MapAdresse(adresse: string): Types.Canonical.Adresse {
  const CPRegex = /\ ([0-9]{5})\ /;
  const [AdresseComplete, Telephone] = _.split(adresse, " Téléphone : ");
  const TelephoneCleaned = Telephone
    ? _.replace(Telephone, /[\.\ ]+/g, "")
    : Telephone;
  const CodePostal = CPRegex.exec(adresse)[1];
  return {
    AdresseComplete,
    CodePostal,
    Telephone: TelephoneCleaned
  };
}
