import concat from 'lodash/concat'
import supabaseClient from '../Common/SupabaseClient'
import { PostgrestResponse } from '@supabase/supabase-js'
import { Database } from '../../Types/database.types'

type Depute_OrganismeParlementaire =
  Database['public']['Tables']['Depute_OrganismeParlementaire']['Insert']

async function handleSupabaseError<T>(response: PostgrestResponse<T>) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.data)
}

function handleSupabasePagination(from: number, to: number) {
  return async (
    res: Depute_OrganismeParlementaire[]
  ): Promise<Depute_OrganismeParlementaire[]> => {
    if (res.length === 1000) {
      return GetDeputeOrganismeParlementaireFromSupabase(from, to).then(
        (r: Depute_OrganismeParlementaire[]) => {
          return Promise.resolve(concat<Depute_OrganismeParlementaire>(res, r))
        }
      )
    }
    return Promise.resolve(res)
  }
}

export async function GetOrganismesFromSupabase() {
  return supabaseClient
    .from('OrganismeParlementaire')
    .select()
    .then(handleSupabaseError)
}

export async function GetDeputeOrganismeParlementaireFromSupabase(
  from: number = 0,
  to: number = 1000
) {
  return supabaseClient
    .from('Depute_OrganismeParlementaire')
    .select()
    .range(from, to)
    .then(handleSupabaseError)
    .then(handleSupabasePagination(from + 1000, to + 1000))
}

export async function CreateDeputeOrganismeParlementaireToSupabase(
  data: Depute_OrganismeParlementaire
) {
  return supabaseClient
    .from('Depute_OrganismeParlementaire')
    .insert([data])
    .then(handleSupabaseError)
}

export async function UpdateDeputeOrganismeParlementaireToSupabase(
  data: Depute_OrganismeParlementaire
) {
  return supabaseClient
    .from('Depute_OrganismeParlementaire')
    .update(data)
    .match({ Id: data.Id })
    .then(handleSupabaseError)
}

export async function DeleteDeputeOrganismeParlementaireToSupabase(
  data: Depute_OrganismeParlementaire
) {
  return supabaseClient
    .from('Depute_OrganismeParlementaire')
    .delete()
    .match({ Id: data.Id })
    .then(handleSupabaseError)
}
