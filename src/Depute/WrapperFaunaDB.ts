import { GetProvidedFaunaDBClient } from '../Common/FaunaDBClient'
import { GetGroupeParlementaireRefBySigle } from '../GroupeParlementaire/WrapperFaunaDB'

import { query, values } from 'faunadb'
const {
  Get,
  Match,
  Index,
  Select,
  Update,
  Collection,
  Create,
  Map,
  Paginate,
  Lambda,
  Var,
  Documents,
  Merge,
  Delete,
} = query

export function GetDeputesFromFaunaDB() {
  return GetProvidedFaunaDBClient().query<
    values.Document<values.Document<Types.Canonical.Depute>[]>
  >(
    Map(
      Paginate(Documents(Collection('Depute')), { size: 1000 }),
      Lambda('X', {
        data: Merge(Select('data', Get(Var('X'))), {
          GroupeParlementaire: Select(
            ['data'],
            Get(Select(['data', 'GroupeParlementaire'], Get(Var('X'))))
          ),
        }),
      })
    )
  )
}

export function GetDeputeBySlug(
  slug: string
): Promise<values.Document<Types.Canonical.Depute>> {
  return GetProvidedFaunaDBClient().query<
    values.Document<Types.Canonical.Depute>
  >(Get(Match(Index('unique_Depute_Slug'), slug)))
}

export function GetDeputeRefByDeputeSlug(slug: string) {
  return Select('ref', Get(Match(Index('unique_Depute_Slug'), slug)))
}

export function CreateDepute(
  data: Types.Canonical.Depute
): Promise<values.Document<Types.Canonical.Depute>> {
  return GetProvidedFaunaDBClient().query<
    values.Document<Types.Canonical.Depute>
  >(
    Create(Collection('Depute'), {
      data: Object.assign({}, data, {
        GroupeParlementaire: GetGroupeParlementaireRefBySigle(
          data.GroupeParlementaire.Sigle
        ),
      }),
    })
  )
}

export function UpdateDepute(data: Types.Canonical.Depute) {
  return GetProvidedFaunaDBClient().query<
    values.Document<values.Document<Types.Canonical.Depute>[]>
  >(
    Map(
      Paginate(Match(Index('unique_Depute_Slug'), data.Slug)),
      Lambda(
        'X',
        Update(Var('X'), {
          data: Object.assign({}, data, {
            GroupeParlementaire: GetGroupeParlementaireRefBySigle(
              data.GroupeParlementaire.Sigle
            ),
          }),
        })
      )
    )
  )
}

export function DeleteDepute(slug: string) {
  return GetProvidedFaunaDBClient().query<
    values.Document<values.Document<Types.Canonical.Depute>[]>
  >(
    Map(
      Paginate(Match(Index('unique_Depute_Slug'), slug)),
      Lambda('X', Delete(Var('X')))
    )
  )
}
