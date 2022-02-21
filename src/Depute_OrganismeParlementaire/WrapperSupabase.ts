import supabaseClient from '../Common/SupabaseClient'
import concat from 'lodash/concat'

function handleSupabaseError({ error, ...rest }) {
  if (error) {
    throw error
  }
  return rest
}

function handleSupabasePagination(from: number, to: number) {
  return function (res) {
    if (res.body.length === 1000) {
      return GetDeputeOrganismeParlementaireFromSupabase(to, to + 1000).then(
        (r) => {
          r.body = concat(res.body, r)
          return r
        }
      )
    }
    return res
  }
}

export function GetOrganismesFromSupabase() {
  return supabaseClient
    .from<Types.Canonical.OrganismeParlementaire>('OrganismeParlementaire')
    .select()
    .then(handleSupabaseError)
    .then((d) => d.body)
}

export function GetDeputeOrganismeParlementaireFromSupabase(
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
    .then(handleSupabasePagination(from, to))
    .then((d) => d.body)
}

export function CreateDeputeOrganismeParlementaireToSupabase(
  data: Types.Canonical.DeputeOrganismeParlementaire
) {
  return supabaseClient
    .from<Types.Canonical.DeputeOrganismeParlementaire>(
      'Depute_OrganismeParlementaire'
    )
    .insert([data])
    .then(handleSupabaseError)
    .then((d) => d.body)
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
    .then((d) => d.body)
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
    .then((d) => d.body)
}
