import { PostgrestResponse } from '@supabase/supabase-js'

import supabaseClient from '../Common/SupabaseClient'
import { Database } from '../../Types/database.types'

type Activite = Database['public']['Tables']['Activite']['Insert']

async function handleSupabaseError<T>(response: PostgrestResponse<T>) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.data)
}

export async function GetActivitesBySlugFromSupabase(slug: string) {
  return supabaseClient
    .from('Activite')
    .select()
    .eq('DeputeSlug', slug)
    .then(handleSupabaseError)
}

export async function CreateActiviteToSupabase(data: Activite) {
  return supabaseClient
    .from('Activite')
    .insert([data])
    .then(handleSupabaseError)
}

export async function UpdateActiviteToSupabase(data: Activite) {
  return supabaseClient
    .from('Activite')
    .update(data)
    .match({ Id: data.Id })
    .then(handleSupabaseError)
}

export async function DeleteActiviteToSupabase(data: Activite) {
  return supabaseClient
    .from('Activite')
    .delete()
    .match({ Id: data.Id })
    .then(handleSupabaseError)
}
