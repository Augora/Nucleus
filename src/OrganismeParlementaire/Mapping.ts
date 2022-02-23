export function MapOrganismeParlementaire(
  organisme: Types.External.NosDeputesFR.OrganismeParlementaire
): Types.Canonical.OrganismeParlementaire {

  return {
    Nom: organisme.nom,
    Slug: organisme.slug,
    Type: organisme.type,
    URLNosdeputes: organisme.url_nosdeputes,
    URLNosdeputesAPI: organisme.url_nosdeputes_api,
  }
}
