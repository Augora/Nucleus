import { GetProvidedFaunaDBClient } from "../Common/FaunaDBClient";
import { GetLogger } from "../Common/Logger";

import { query, values } from "faunadb";
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
  Documents
} = query;

export function GetDeputesFromFaunaDB() {
  return GetProvidedFaunaDBClient().query<
    values.Document<values.Document<Types.Canonical.Depute>[]>
  >(
    Map(
      Paginate(Documents(Collection("Depute")), { size: 1000 }),
      Lambda("X", Get(Var("X")))
    )
  );
}

export function getDeputeBySlug(slug: String) {
  return Get(Match(Index("unique_Depute_Slug"), slug));
}

export function getDeputeRefByDeputeSlug(slug: String) {
  return Select("ref", Get(Match(Index("unique_Depute_Slug"), slug)));
}

export function UpdateDepute(data) {
  return GetProvidedFaunaDBClient().query<
    values.Document<values.Document<Types.Canonical.Depute>[]>
  >(
    Map(
      Paginate(Match(Index("unique_Depute_Slug"), data.Slug)),
      Lambda(
        "X",
        Update(Var("X"), {
          data: Object.assign({}, data, {
            GroupeParlementaire: getGroupeParlementaireRefBySigle(
              data.SigleGroupePolitique
            )
          })
        })
      )
    )
  );
}

function getGroupeParlementaireRefBySigle(sigle: String) {
  return Select("ref", Get(Match(Index("GroupeParlementaire"), sigle)));
}

export function CreateDepute(
  data: Types.Canonical.Depute
): Promise<values.Document<Types.Canonical.Depute>> {
  return GetProvidedFaunaDBClient().query<
    values.Document<Types.Canonical.Depute>
  >(
    Create(Collection("Depute"), {
      data: Object.assign({}, data, {
        GroupeParlementaire: getGroupeParlementaireRefBySigle(
          data.SigleGroupePolitique
        )
      })
    })
  );
}
