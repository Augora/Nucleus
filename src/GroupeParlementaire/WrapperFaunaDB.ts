import { query, values } from 'faunadb'
const {
  Get,
  Match,
  Index,
  Select,
  Exists,
  Map,
  Paginate,
  Documents,
  Collection,
  Lambda,
  Var,
  Create,
} = query

import { GetProvidedFaunaDBClient } from '../Common/FaunaDBClient'

export function GetGroupesFromFaunaDB() {
  return GetProvidedFaunaDBClient().query<
    values.Document<values.Document<Types.Canonical.GroupeParlementaire>[]>
  >(
    Map(
      Paginate(Documents(Collection('GroupeParlementaire'))),
      Lambda('X', Get(Var('X')))
    )
  )
}

export function DoesGroupeParlementaireExistsBySigle(sigle: string) {
  return GetProvidedFaunaDBClient().query<values.Document<boolean>>(
    Exists(Match(Index('GroupeParlementaire'), sigle))
  )
}

export function GetGroupeParlementaireRefBySigle(sigle: string) {
  return Select('ref', Get(Match(Index('GroupeParlementaire'), sigle)))
}

export function CreateGroupeParlementaire(
  data: Types.Canonical.GroupeParlementaire
) {
  return GetProvidedFaunaDBClient().query<
    values.Document<Types.Canonical.GroupeParlementaire>
  >(Create(Collection('GroupeParlementaire'), { data }))
}
