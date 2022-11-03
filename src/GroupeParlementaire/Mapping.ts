import Color from 'color'
import { Database } from '../../Types/database.types'

type GroupeParlementaire =
  Database['public']['Tables']['GroupeParlementaire']['Insert']

export function MapGroupeParlementaire(
  groupe: Types.External.NosDeputesFR.Organisme,
  groupeFromSupabase?: GroupeParlementaire
): GroupeParlementaire {
  const color = Color.rgb(groupe.couleur.split(',').map((n) => parseInt(n, 10)))

  return {
    Sigle: groupe.acronyme,
    NomComplet: groupe.nom,
    Couleur: groupeFromSupabase
      ? groupeFromSupabase.Couleur
      : color.hsl().string(),
    CouleurDetail: groupeFromSupabase
      ? groupeFromSupabase.CouleurDetail
      : {
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
  }
}
