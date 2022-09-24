import { PostgrestResponse } from '@supabase/supabase-js'
import supabaseClient from '../Common/SupabaseClient'

async function handleSupabaseError<T>(response: PostgrestResponse<T>) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.body)
}

export async function GetActivitesBySlugFromSupabase(slug: string) {
  return supabaseClient
    .from<Types.Canonical.Activite>('Activite')
    .select()
    .eq('DeputeSlug', slug)
    .then(handleSupabaseError)
}

export async function CreateActiviteToSupabase(data: Types.Canonical.Activite) {
  return supabaseClient
    .from<Types.Canonical.Activite>('Activite')
    .insert([data])
    .then(handleSupabaseError)
}

export async function UpdateActiviteToSupabase(data: Types.Canonical.Activite) {
  return supabaseClient
    .from<Types.Canonical.Activite>('Activite')
    .update(data)
    .match({ Id: data.Id })
    .then(handleSupabaseError)
}

export async function DeleteActiviteToSupabase(data: Types.Canonical.Activite) {
  return supabaseClient
    .from<Types.Canonical.Activite>('Activite')
    .delete()
    .match({ Id: data.Id })
    .then(handleSupabaseError)
}
