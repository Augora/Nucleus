import Color from 'ac-colors'

export function MapGroupeParlementaire(
  groupe: Types.External.NosDeputesFR.Organisme
): Types.Canonical.GroupeParlementaire {
  const color = new Color({
    type: 'rgb',
    color: groupe.couleur.split(',').map((n) => parseInt(n, 10)),
  })
  color.capitalize = false

  return {
    Sigle: groupe.acronyme,
    NomComplet: groupe.nom,
    Couleur: color.hsl,
    CouleurDetail: {
      HEX: color.hex,
      HSL: {
        Full: color.hslString,
        H: color.hsl[0],
        S: color.hsl[1],
        L: color.hsl[2],
      },
      RGB: {
        Full: color.rgbString,
        R: color.rgb[0],
        G: color.rgb[1],
        B: color.rgb[2],
      },
    },
    Ordre: groupe.order,
    Actif: groupe.groupe_actuel === undefined ? false : groupe.groupe_actuel,
    URLImage: '',
  }
}
