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
  Update,
} = query

import { GetProvidedFaunaDBClient } from '../Common/FaunaDBClient'

export function GetOrganismesFromFaunaDB() {
  return GetProvidedFaunaDBClient().query<
    values.Document<values.Document<Types.Canonical.OrganismeParlementaire>[]>
  >(
    Map(
      Paginate(Documents(Collection('OrganismeParlementaire'))),
      Lambda('X', Get(Var('X')))
    )
  )
}

export function DoesOrganismeParlementaireExistsByNom(nom: string) {
  return GetProvidedFaunaDBClient().query<values.Document<boolean>>(
    Exists(Match(Index('unique_OrganismeParlementaire_Nom'), nom))
  )
}

export function GetOrganismeParlementaireByRef(ref) {
  return GetProvidedFaunaDBClient().query<
    values.Document<Types.Canonical.OrganismeParlementaire>
  >(Get(ref))
}

export function GetOrganismeParlementaireRefByNom(nom: string) {
  return Select(
    'ref',
    Get(Match(Index('unique_GroupeParlementaire_Nom'), nom))
  )
}

export function CreateOrganismeParlementaire(
  data: Types.Canonical.OrganismeParlementaire
) {
  return GetProvidedFaunaDBClient().query<
    values.Document<Types.Canonical.OrganismeParlementaire>
  >(Create(Collection('OrganismeParlementaire'), { data }))
}

export function UpdateOrganismeParlementaire(
  data: Types.Canonical.OrganismeParlementaire
) {
  return GetProvidedFaunaDBClient().query<
    values.Document<values.Document<Types.Canonical.OrganismeParlementaire>[]>
  >(
    Map(
      Paginate(Match(Index('unique_OrganismeParlementaire_Nom'), data.Nom)),
      Lambda(
        'X',
        Update(Var('X'), {
          data: {
            Nom: data.Nom, 
          },
        })
      )
    )
  )
}
