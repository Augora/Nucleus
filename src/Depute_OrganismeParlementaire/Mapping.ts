import { Database } from '../../Types/database.types'

type Depute_OrganismeParlementaire =
  Database['public']['Tables']['Depute_OrganismeParlementaire']['Insert']

export function MapDeputeOrganismeParlementaire(
  organismeSlug: string,
  deputeSlug: string,
  fonction: string
): Depute_OrganismeParlementaire {
  return {
    Id: `${deputeSlug}_${organismeSlug}`,
    DeputeSlug: deputeSlug,
    OrganismeSlug: organismeSlug,
    Fonction: fonction,
  }
}
