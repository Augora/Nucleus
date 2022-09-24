import supabaseClient from '../Common/SupabaseClient'

function handleSupabaseError({ error, ...rest }) {
  if (error) {
    throw error
  }
  return rest
}

export function GetMinistresFromSupabase() {
  return supabaseClient
    .from<Types.Canonical.Ministre>('Ministre')
    .select()
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function CreateMinistreToSupabase(data: Types.Canonical.Ministre) {
  return supabaseClient
    .from<Types.Canonical.Ministre>('Ministre')
    .insert([data])
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function UpdateMinistreToSupabase(data: Types.Canonical.Ministre) {
  return supabaseClient
    .from<Types.Canonical.Ministre>('Ministre')
    .update(data)
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
    .then((d) => d.body)
}
