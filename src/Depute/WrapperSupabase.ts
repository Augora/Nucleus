import { PostgrestResponse } from '@supabase/supabase-js'
import supabaseClient from '../Common/SupabaseClient'

async function handleSupabaseError<T>(response: PostgrestResponse<T>) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.body)
}

export async function GetDeputesFromSupabase() {
  return supabaseClient
    .from<Types.Canonical.Depute>('Depute')
    .select()
    .then(handleSupabaseError)
}

export function CreateDeputeToSupabase(data: Types.Canonical.Depute) {
  return supabaseClient
    .from<Types.Canonical.Depute>('Depute')
    .insert([data])
    .then(handleSupabaseError)
}

export function UpdateDeputeToSupabase(data: Types.Canonical.Depute) {
  return supabaseClient
    .from<Types.Canonical.Depute>('Depute')
    .update(data)
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
}

export function DeleteDeputeToSupabase(data: Types.Canonical.Depute) {
  return supabaseClient
    .from<Types.Canonical.Depute>('Depute')
    .delete()
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
}
