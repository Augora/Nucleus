import { PostgrestResponse } from '@supabase/supabase-js'

import supabaseClient from '../Common/SupabaseClient'
import { Database } from '../../Types/database.types'

type Ministre = Database['public']['Tables']['Ministre']['Insert']

async function handleSupabaseError<T>(response: PostgrestResponse<T>) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.data)
}

export async function GetMinistresFromSupabase() {
  return supabaseClient.from('Ministre').select().then(handleSupabaseError)
}

export async function CreateMinistreToSupabase(data: Ministre) {
  return supabaseClient
    .from('Ministre')
    .insert([data])
    .then(handleSupabaseError)
}

export async function UpdateMinistreToSupabase(data: Ministre) {
  return supabaseClient
    .from('Ministre')
    .update(data)
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
}

export async function DeleteMinistreToSupabase(data: Ministre) {
  return supabaseClient
    .from('Ministre')
    .delete()
    .match({ Slug: data.Slug })
    .select()
    .then(handleSupabaseError)
}
