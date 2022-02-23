const commissionsPermanentes = [
  'commission-des-affaires-culturelles-et-de-l-education',
  'commission-des-affaires-economiques',
  'commission-des-affaires-etrangeres',
  'commission-des-affaires-sociales',
  'commission-de-la-defense-nationale-et-des-forces-armees',
  'commission-du-developpement-durable-et-de-l-amenagement-du-territoire',
  'commission-des-finances-de-l-economie-generale-et-du-controle-budgetaire',
  'commission-des-lois-constitutionnelles-de-la-legislation-et-de-l-administration-generale-de-la-republique',
]

export function MapOrganismeParlementaire(
  organisme: Types.External.NosDeputesFR.OrganismeParlementaire
): Types.Canonical.OrganismeParlementaire {
  return {
    Nom: organisme.nom,
    Slug: organisme.slug,
    Type: organisme.type,
    EstPermanant: commissionsPermanentes.includes(organisme.slug),
    URLNosdeputes: organisme.url_nosdeputes,
    URLNosdeputesAPI: organisme.url_nosdeputes_api,
  }
}
