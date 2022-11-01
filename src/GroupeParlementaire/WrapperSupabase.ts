import { PostgrestResponse } from '@supabase/supabase-js'
import supabaseClient from '../Common/SupabaseClient'
import { Database } from '../../Types/database.types'

type GroupeParlementaire =
  Database['public']['Tables']['GroupeParlementaire']['Row']

async function handleSupabaseError<T>(response: PostgrestResponse<T>) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.data)
}

export function GetGroupesFromSupabase() {
  return supabaseClient
    .from('GroupeParlementaire')
    .select()
    .then(handleSupabaseError)
}

export function CreateGroupeParlementaireToSupabase(data: GroupeParlementaire) {
  return supabaseClient
    .from('GroupeParlementaire')
    .insert([data])
    .then(handleSupabaseError)
}

export function UpdateGroupeParlementaireToSupabase(data: GroupeParlementaire) {
  return supabaseClient
    .from('GroupeParlementaire')
    .update(data)
    .match({ Sigle: data.Sigle })
    .then(handleSupabaseError)
}
