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

export async function GetOrganismesFromSupabase() {
  return supabaseClient
    .from('OrganismeParlementaire')
    .select()
    .then(handleSupabaseError)
}

export async function GetOrganismesFromSupabaseBySlug() {
  const client = await supabaseClient
    .from('OrganismeParlementaire')
    .select('Slug')
    .then(handleSupabaseError)
  return client.map(o => o.Slug)
}

export async function CreateOrganismeToSupabase(data: OrganismeParlementaire) {
  return supabaseClient
    .from('OrganismeParlementaire')
    .insert([data])
    .then(handleSupabaseError)
}

export async function UpdateOrganismeToSupabase(data: OrganismeParlementaire) {
  return supabaseClient
    .from('OrganismeParlementaire')
    .update(data)
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
}

export async function DeleteOrganismeToSupabase(data: OrganismeParlementaire) {
  return supabaseClient
    .from('OrganismeParlementaire')
    .delete()
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
}
