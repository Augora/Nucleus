import moment from 'moment'
import { split, toLower, upperFirst, join } from 'lodash'

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
    parti_ratt_financier: depute.parti_ratt_financier,
    Profession: depute.profession ? depute.profession : '',
    PlaceEnHemicycle: depute.place_en_hemicycle,
    URLAssembleeNationale: depute.url_an,
    IDAssembleeNationale: depute.id_an,
    URLNosdeputes: depute.url_nosdeputes,
    URLNosdeputesAPI: depute.url_nosdeputes_api,
    NombreMandats: depute.nb_mandats,
    Twitter: depute.twitter,
    EstEnMandat: depute.ancien_depute !== 1,
    Age: moment().diff(depute.date_naissance, 'years', false),
    URLPhotoAssembleeNationnale: `http://www2.assemblee-nationale.fr/static/tribun/15/photos/${depute.id_an}.jpg`,
    URLPhotoAugora: `https://static.augora.fr/depute/${depute.slug}`,
    SitesWeb: depute.sites_web.map((s) => s.site),
    Emails: depute.emails.map((e) => e.email),
    Adresses: depute.adresses
      .map((a) => a.adresse)
      .filter(
        (a) =>
          !a.startsWith('Sur rendez-vous') &&
          !a.startsWith('Varsovie/Konstancin') &&
          !a.startsWith('Allemagne et Autriche')
      ),
    Collaborateurs: depute.collaborateurs.map((c) =>
      join(
        split(c.collaborateur, ' ').map((mc) =>
          join(
            split(mc, '-').map((mcsplitted) => upperFirst(toLower(mcsplitted))),
            '-'
          )
        ),
        ' '
      )
    ),
  }
}
