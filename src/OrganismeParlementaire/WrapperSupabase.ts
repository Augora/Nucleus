import supabaseClient from '../Common/SupabaseClient'

function handleSupabaseError({ error, ...rest }) {
  if (error) {
    throw error
  }
  return rest
}

export function GetOrganismesBySlugFromSupabase(slug: string) {
  return supabaseClient
    .from<Types.Canonical.OrganismeParlementaire>('OrganismeParlementaire')
    .select()
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function CreateOrganismeToSupabase(data: Types.Canonical.OrganismeParlementaire) {
  return supabaseClient
    .from<Types.Canonical.OrganismeParlementaire>('OrganismeParlementaire')
    .insert([data])
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function UpdateOrganismeToSupabase(data: Types.Canonical.OrganismeParlementaire) {
  return supabaseClient
    .from<Types.Canonical.OrganismeParlementaire>('OrganismeParlementaire')
    .update(data)
    .match({ Id: data.Id })
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function DeleteOrganismeToSupabase(data: Types.Canonical.OrganismeParlementaire) {
  return supabaseClient
    .from<Types.Canonical.OrganismeParlementaire>('OrganismeParlementaire')
    .delete()
    .match({ Id: data.Id })
    .then(handleSupabaseError)
    .then((d) => d.body)
}
