import Color from 'ac-colors'

export function MapGroupeParlementaire(
  groupe: Types.External.NosDeputesFR.Organisme
): Types.Canonical.GroupeParlementaire {
  const color = new Color({
    type: 'rgb',
    color: groupe.couleur.split(',').map((n) => parseInt(n, 10)),
  })

  return {
    Sigle: groupe.acronyme,
    NomComplet: groupe.nom,
    Couleur: `hsla(${Math.round(color.hsl[0])}, ${Math.round(
      color.hsl[1]
    )}%, ${Math.round(color.hsl[2])}%, 1)`,
    Ordre: groupe.order,
    Actif: groupe.groupe_actuel === undefined ? false : groupe.groupe_actuel,
    URLImage: '',
  }
}
