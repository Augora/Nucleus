import supabaseClient from '../Common/SupabaseClient'

function handleSupabaseError({ error, ...rest }) {
  if (error) {
    throw error
  }
  return rest
}

export function GetActivitesBySlugFromSupabase(slug: string) {
  return supabaseClient
    .from<Types.Canonical.Activite>('Activite')
    .select()
    .eq('DeputeSlug', slug)
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function CreateActiviteToSupabase(data: Types.Canonical.Activite) {
  return supabaseClient
    .from<Types.Canonical.Activite>('Activite')
    .insert([data])
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function UpdateActiviteToSupabase(data: Types.Canonical.Activite) {
  return supabaseClient
    .from<Types.Canonical.Activite>('Activite')
    .update(data)
    .match({ Id: data.Id })
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function DeleteActiviteToSupabase(data: Types.Canonical.Activite) {
  return supabaseClient
    .from<Types.Canonical.Activite>('Activite')
    .delete()
    .match({ Id: data.Id })
    .then(handleSupabaseError)
    .then((d) => d.body)
}
