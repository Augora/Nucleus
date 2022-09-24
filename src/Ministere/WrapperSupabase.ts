import supabaseClient from '../Common/SupabaseClient'

function handleSupabaseError({ error, ...rest }) {
  if (error) {
    throw error
  }
  return rest
}

export function GetMinisteresFromSupabase() {
  return supabaseClient
    .from<Types.Canonical.Ministere>('Ministere')
    .select()
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function CreateMinistereToSupabase(data: Types.Canonical.Ministere) {
  return supabaseClient
    .from<Types.Canonical.Ministere>('Ministere')
    .insert([data])
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function UpdateMinistereToSupabase(data: Types.Canonical.Ministere) {
  return supabaseClient
    .from<Types.Canonical.Ministere>('Ministere')
    .update(data)
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
    .then((d) => d.body)
}
