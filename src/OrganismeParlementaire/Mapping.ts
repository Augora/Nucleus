import Color from 'color'

export function MapOrganismeParlementaire(
  organisme: Types.External.NosDeputesFR.OrganismeParlementaire
): Types.Canonical.OrganismeParlementaire {

  return {
    Nom: organisme.nom,
    Slug: organisme.slug,
    Id: organisme.id,
    Type: organisme.type,
  }
}
