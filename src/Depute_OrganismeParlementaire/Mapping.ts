export function MapDeputeOrganismeParlementaire(
  organismeSlug: string,
  deputeSlug: string
): Types.Canonical.DeputeOrganismeParlementaire {
  return {
    Id: `${deputeSlug}_${organismeSlug}`,
    DeputeSlug: deputeSlug,
    OrganismeSlug: organismeSlug,
  }
}
