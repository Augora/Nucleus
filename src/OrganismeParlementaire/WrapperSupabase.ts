import { PostgrestResponse } from '@supabase/supabase-js'
import supabaseClient from '../Common/SupabaseClient'

async function handleSupabaseError<T>(response: PostgrestResponse<T>) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.body)
}

export function GetOrganismesFromSupabase() {
  return supabaseClient
    .from<Types.Canonical.OrganismeParlementaire>('OrganismeParlementaire')
    .select()
    .then(handleSupabaseError)
}

export function CreateOrganismeToSupabase(
  data: Types.Canonical.OrganismeParlementaire
) {
  return supabaseClient
    .from<Types.Canonical.OrganismeParlementaire>('OrganismeParlementaire')
    .insert([data])
    .then(handleSupabaseError)
}

export function UpdateOrganismeToSupabase(
  data: Types.Canonical.OrganismeParlementaire
) {
  return supabaseClient
    .from<Types.Canonical.OrganismeParlementaire>('OrganismeParlementaire')
    .update(data)
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
}

export function DeleteOrganismeToSupabase(
  data: Types.Canonical.OrganismeParlementaire
) {
  return supabaseClient
    .from<Types.Canonical.OrganismeParlementaire>('OrganismeParlementaire')
    .delete()
    .match({ Slug: data.Slug })
    .then(handleSupabaseError)
}
