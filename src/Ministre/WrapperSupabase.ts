import { PostgrestResponse } from '@supabase/supabase-js'

import supabaseClient from '../Common/SupabaseClient'
import { Database } from '../../Types/database.types'

type Ministre = Database['public']['Tables']['Ministre']['Row']

async function handleSupabaseError<T>(response: PostgrestResponse<T>) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.data)
}

export function GetMinistresFromSupabase() {
  return supabaseClient.from('Ministre').select().then(handleSupabaseError)
}

export function CreateMinistreToSupabase(data: Ministre) {
  return supabaseClient
    .from('Ministre')
    .insert([data])
    .then(handleSupabaseError)
}

export function UpdateMinistreToSupabase(data: Ministre) {
  return supabaseClient
    .from('Ministre')
    .update(data)
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
}
