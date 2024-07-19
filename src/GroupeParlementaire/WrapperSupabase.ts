import { PostgrestResponse } from '@supabase/supabase-js'
import supabaseClient from '../Common/SupabaseClient'
import { Database } from '../../Types/database.types'

type GroupeParlementaire =
  Database['public']['Tables']['GroupeParlementaire']['Insert']

async function handleSupabaseError<T>(response: PostgrestResponse<T>) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.data)
}

export async function GetGroupesFromSupabase() {
  return supabaseClient
    .from('GroupeParlementaire')
    .select()
    .then(handleSupabaseError)
}

export async function CreateGroupeParlementaireToSupabase(
  data: GroupeParlementaire
) {
  return supabaseClient
    .from('GroupeParlementaire')
    .insert([data])
    .then(handleSupabaseError)
}

export async function UpdateGroupeParlementaireToSupabase(
  data: GroupeParlementaire
) {
  return supabaseClient
    .from('GroupeParlementaire')
    .update(data)
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
}

export async function SetGroupeParlementaireInactifToSupabase(
  data: GroupeParlementaire
) {
  return supabaseClient
    .from('GroupeParlementaire')
    .update({ Slug: data.Slug, Actif: false })
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
}
