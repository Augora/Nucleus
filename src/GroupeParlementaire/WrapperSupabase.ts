import { PostgrestResponse } from '@supabase/supabase-js'
import supabaseClient from '../Common/SupabaseClient'

async function handleSupabaseError<T>(response: PostgrestResponse<T>) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.body)
}

export function GetGroupesFromSupabase() {
  return supabaseClient
    .from<Types.Canonical.GroupeParlementaire>('GroupeParlementaire')
    .select()
    .then(handleSupabaseError)
}

export function CreateGroupeParlementaireToSupabase(
  data: Types.Canonical.GroupeParlementaire
) {
  return supabaseClient
    .from<Types.Canonical.GroupeParlementaire>('GroupeParlementaire')
    .insert([data])
    .then(handleSupabaseError)
}

export function UpdateGroupeParlementaireToSupabase(
  data: Types.Canonical.GroupeParlementaire
) {
  return supabaseClient
    .from<Types.Canonical.GroupeParlementaire>('GroupeParlementaire')
    .update(data)
    .match({ Sigle: data.Sigle })
    .then(handleSupabaseError)
}
