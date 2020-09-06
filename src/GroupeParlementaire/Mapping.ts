import Color from 'ac-colors'

export function MapGroupeParlementaire(
  groupe: Types.External.NosDeputesFR.Organisme
): Types.Canonical.GroupeParlementaire {
  var color = new Color({
    type: 'rgb',
    color: groupe.couleur.split(',').map((n) => parseInt(n)),
  })

  return {
    Sigle: groupe.acronyme,
    NomComplet: groupe.nom,
    Couleur: `hsla(${Math.round(color.hsl[0])}, ${Math.round(
      color.hsl[1]
    )}%, ${Math.round(color.hsl[2])}%, 1)`,
    Ordre: groupe.order,
    Actif: groupe.groupe_actuel ? false : groupe.groupe_actuel,
    URLImage: '',
  }
}
