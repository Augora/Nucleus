import { PostgrestResponse } from '@supabase/supabase-js'

import supabaseClient from '../Common/SupabaseClient'
import { Database } from '../../Types/database.types'

type OrganismeParlementaire =
  Database['public']['Tables']['OrganismeParlementaire']['Insert']

async function handleSupabaseError<T>(response: PostgrestResponse<T>) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.data)
}

export function GetOrganismesFromSupabase() {
  return supabaseClient
    .from('OrganismeParlementaire')
    .select()
    .then(handleSupabaseError)
}

export function CreateOrganismeToSupabase(data: OrganismeParlementaire) {
  return supabaseClient
    .from('OrganismeParlementaire')
    .insert([data])
    .then(handleSupabaseError)
}

export function UpdateOrganismeToSupabase(data: OrganismeParlementaire) {
  return supabaseClient
    .from('OrganismeParlementaire')
    .update(data)
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
}

export function DeleteOrganismeToSupabase(data: OrganismeParlementaire) {
  return supabaseClient
    .from('OrganismeParlementaire')
    .delete()
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
}
