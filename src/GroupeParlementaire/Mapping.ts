import Color from 'color'

export function MapGroupeParlementaire(
  groupe: Types.External.NosDeputesFR.Organisme
): Types.Canonical.GroupeParlementaire {
  const color = Color.rgb(groupe.couleur.split(',').map((n) => parseInt(n, 10)))

  return {
    Sigle: groupe.acronyme,
    NomComplet: groupe.nom,
    Couleur: color.hsl().string(),
    CouleurDetail: {
      HEX: color.hex(),
      HSL: {
        Full: color.hsl().string(0),
        H: Math.round(color.hsl().object().h),
        S: Math.round(color.hsl().object().s),
        L: Math.round(color.hsl().object().l),
      },
      RGB: {
        Full: color.rgb().string(0),
        R: Math.round(color.rgb().object().r),
        G: Math.round(color.rgb().object().g),
        B: Math.round(color.rgb().object().b),
      },
    },
    Ordre: groupe.order,
    Actif: groupe.groupe_actuel === undefined ? false : groupe.groupe_actuel,
    URLImage: '',
  }
}
