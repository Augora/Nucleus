import { query } from "faunadb";

export function getDeputeRefBySlug(slug: String) {
  return query.Get(query.Match(query.Index("unique_Depute_Slug"), slug));
}

export function getDeputeRefByDeputeSlug(slug: String) {
  return query.Select(
    "ref",
    query.Get(query.Match(query.Index("unique_Depute_Slug"), slug))
  );
}

export function updateDeputeByRef(deputeRef: String, data) {
  return query.Update(query.Ref(query.Collection("Depute"), deputeRef), {
    data
  });
}

export function createDepute(data) {
  return query.Create(query.Collection("Depute"), { data });
}

export function createAutreMandat(data) {
  return query.Create(query.Collection("AutreMandat"), {
    data
  });
}

export function getAutresMandatByDeputeID(id: string) {
  return query.Map(
    query.Paginate(
      query.Match(
        query.Index("autreMandat_Depute_by_depute"),
        query.Ref(query.Collection("Depute"), id)
      )
    ),
    query.Lambda("X", query.Get(query.Var("X")))
  );
}
export function deleteAutreMandatByID(id: string) {
  return query.Delete(query.Ref(query.Collection("AutreMandat"), id));
}

export function createAncienMandat(data) {
  return query.Create(query.Collection("AncienMandat"), {
    data
  });
}

export function getAnciensMandatByDeputeID(id: string) {
  return query.Map(
    query.Paginate(
      query.Match(
        query.Index("ancienMandat_Depute_by_depute"),
        query.Ref(query.Collection("Depute"), id)
      )
    ),
    query.Lambda("X", query.Get(query.Var("X")))
  );
}

export function deleteAncienMandatByID(id: string) {
  return query.Delete(query.Ref(query.Collection("AncienMandat"), id));
}

export function convertToTimeQuery(time: string) {
  return query.Time(time);
}

export function getActivitesByDeputeSlug(slug: string) {
  return query.Map(
    query.Paginate(
      query.Match(
        query.Index("activite_Depute_by_depute"),
        query.Select(
          "ref",
          query.Get(query.Match(query.Index("unique_Depute_Slug"), slug))
        )
      )
    ),
    query.Lambda("X", query.Get(query.Var("X")))
  );
}

export function createActivite(data) {
  return query.Create(query.Collection("Activite"), {
    data
  });
}

export function updateActiviteByRef(
  deputeSlug: String,
  weekNumber: Number,
  data: Types.Canonical.Activite
) {
  return query.Update(
    query.Select(
      "ref",
      query.Get(
        query.Join(
          query.Match(query.Index("unique_Depute_Slug"), deputeSlug),
          query.Match(query.Index("act_by_weekNumber"), weekNumber)
        )
      )
    ),
    {
      data
    }
  );
}

export function deleteActiviteByID(id: string) {
  return query.Delete(query.Ref(query.Collection("Activite"), id));
}
