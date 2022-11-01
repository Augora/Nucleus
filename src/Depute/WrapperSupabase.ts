import { PostgrestResponse } from '@supabase/supabase-js'

import supabaseClient from '../Common/SupabaseClient'
import { Database } from '../../Types/database.types'

type Depute = Database['public']['Tables']['Depute']['Row']

async function handleSupabaseError<T>(response: PostgrestResponse<T>) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.data)
}

export async function GetDeputesFromSupabase() {
  return await supabaseClient.from('Depute').select().then(handleSupabaseError)
}

export async function CreateDeputeToSupabase(data: Depute) {
  return await supabaseClient
    .from('Depute')
    .insert([data])
    .select()
    .then(handleSupabaseError)
}

export async function UpdateDeputeToSupabase(data: Depute) {
  return await supabaseClient
    .from('Depute')
    .update(data)
    .match({ Slug: data.Slug })
    .select()
    .then(handleSupabaseError)
}

export async function DeleteDeputeToSupabase(data: Depute) {
  return await supabaseClient
    .from('Depute')
    .delete()
    .match({ Slug: data.Slug })
    .select()
    .then(handleSupabaseError)
}
