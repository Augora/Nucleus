import { PostgrestResponse } from '@supabase/supabase-js'

import supabaseClient from '../Common/SupabaseClient'
import { Database } from '../../Types/database.types'

type Ministere = Database['public']['Tables']['Ministere']['Row']

async function handleSupabaseError<T>(response: PostgrestResponse<T>) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.data)
}

export function GetMinisteresFromSupabase() {
  return supabaseClient.from('Ministere').select().then(handleSupabaseError)
}

export function CreateMinistereToSupabase(data: Ministere) {
  return supabaseClient
    .from('Ministere')
    .insert([data])
    .then(handleSupabaseError)
}

export function UpdateMinistereToSupabase(data: Ministere) {
  return supabaseClient
    .from('Ministere')
    .update(data)
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
}
