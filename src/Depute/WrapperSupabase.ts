import supabaseClient from '../Common/SupabaseClient'

function handleSupabaseError({ error, ...rest }) {
  if (error) {
    throw error
  }
  return rest
}

export function GetDeputesFromSupabase() {
  return supabaseClient
    .from<Types.Canonical.Depute>('Depute')
    .select()
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function CreateDeputeToSupabase(data: Types.Canonical.Depute) {
  return supabaseClient
    .from<Types.Canonical.Depute>('Depute')
    .insert([data])
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function UpdateDeputeToSupabase(data: Types.Canonical.Depute) {
  return supabaseClient
    .from<Types.Canonical.Depute>('Depute')
    .update(data)
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function DeleteDeputeToSupabase(data: Types.Canonical.Depute) {
  return supabaseClient
    .from<Types.Canonical.Depute>('Depute')
    .delete()
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
    .then((d) => d.body)
}
