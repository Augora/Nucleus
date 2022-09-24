import supabaseClient from '../Common/SupabaseClient'
import concat from 'lodash/concat'
import { PostgrestResponse } from '@supabase/supabase-js'

async function handleSupabaseError<T>(response: PostgrestResponse<T>) {
  if (response.error) {
    return Promise.reject(response.error)
  }
  return Promise.resolve(response.body)
}

function handleSupabasePagination(from: number, to: number) {
  return async function (
    res: Types.Canonical.DeputeOrganismeParlementaire[]
  ): Promise<Types.Canonical.DeputeOrganismeParlementaire[]> {
    if (res.length === 1000) {
      return GetDeputeOrganismeParlementaireFromSupabase(from, to).then(
        (r: Types.Canonical.DeputeOrganismeParlementaire[]) => {
          return Promise.resolve(
            concat<Types.Canonical.DeputeOrganismeParlementaire>(res, r)
          )
        }
      )
    }
    return Promise.resolve(res)
  }
}

export async function GetOrganismesFromSupabase() {
  return supabaseClient
    .from<Types.Canonical.OrganismeParlementaire>('OrganismeParlementaire')
    .select()
    .then(handleSupabaseError)
}

export async function GetDeputeOrganismeParlementaireFromSupabase(
  from: number = 0,
  to: number = 1000
) {
  return supabaseClient
    .from<Types.Canonical.DeputeOrganismeParlementaire>(
      'Depute_OrganismeParlementaire'
    )
    .select()
    .range(from, to)
    .then(handleSupabaseError)
    .then(handleSupabasePagination(from + 1000, to + 1000))
}

export async function CreateDeputeOrganismeParlementaireToSupabase(
  data: Types.Canonical.DeputeOrganismeParlementaire
) {
  return supabaseClient
    .from<Types.Canonical.DeputeOrganismeParlementaire>(
      'Depute_OrganismeParlementaire'
    )
    .insert([data])
    .then(handleSupabaseError)
}

export function UpdateDeputeOrganismeParlementaireToSupabase(
  data: Types.Canonical.DeputeOrganismeParlementaire
) {
  return supabaseClient
    .from<Types.Canonical.DeputeOrganismeParlementaire>(
      'Depute_OrganismeParlementaire'
    )
    .update(data)
    .match({ Id: data.Id })
    .then(handleSupabaseError)
}

export function DeleteDeputeOrganismeParlementaireToSupabase(
  data: Types.Canonical.DeputeOrganismeParlementaire
) {
  return supabaseClient
    .from<Types.Canonical.DeputeOrganismeParlementaire>(
      'Depute_OrganismeParlementaire'
    )
    .delete()
    .match({ Id: data.Id })
    .then(handleSupabaseError)
}
