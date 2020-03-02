import { query } from "faunadb";
const {
  Get,
  Match,
  Index,
  Select,
  Update,
  Ref,
  Collection,
  Create,
  Map,
  Paginate,
  Lambda,
  Var,
  Delete,
  Documents
} = query;

export function getDeputes() {
  return Map(
    Paginate(Match(Index("Deputes")), { size: 1000 }),
    Lambda("X", Get(Var("X")))
  );
}

export function getDeputeBySlug(slug: String) {
  return Get(Match(Index("unique_Depute_Slug"), slug));
}

export function getDeputeRefByDeputeSlug(slug: String) {
  return Select("ref", Get(Match(Index("unique_Depute_Slug"), slug)));
}

export function updateDeputeByRef(data) {
  return Map(
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
  );
}

export function createDepute(data) {
  return Create(Collection("Depute"), { data });
}

export function createAutreMandat(data) {
  return Create(Collection("AutreMandat"), {
    data
  });
}

export function getAutresMandatByDeputeID(id: string) {
  return Map(
    Paginate(
      Match(
        Index("autreMandat_Depute_by_depute"),
        Ref(Collection("Depute"), id)
      )
    ),
    Lambda("X", Get(Var("X")))
  );
}
export function deleteAutreMandatByID(id: string) {
  return Delete(Ref(Collection("AutreMandat"), id));
}

export function createAncienMandat(data) {
  return Create(Collection("AncienMandat"), {
    data
  });
}

export function getAnciensMandatByDeputeID(id: string) {
  return Map(
    Paginate(
      Match(
        Index("ancienMandat_Depute_by_depute"),
        Ref(Collection("Depute"), id)
      )
    ),
    Lambda("X", Get(Var("X")))
  );
}

export function deleteAncienMandatByID(id: string) {
  return Delete(Ref(Collection("AncienMandat"), id));
}

export function getActivitesByDeputeSlug(slug: String) {
  return Map(
    Paginate(
      Match(
        Index("activite_Depute_by_depute"),
        Select("ref", Get(Match(Index("unique_Depute_Slug"), slug)))
      )
    ),
    Lambda("X", Get(Var("X")))
  );
}

export function createActivite(data) {
  return Create(Collection("Activite"), {
    data
  });
}

export function updateActiviteByDeputeSlugAndWeekNumber(
  deputeSlug: String,
  weekNumber: Number,
  data: Types.Canonical.Activite
) {
  return Map(
    Paginate(
      Match(Index("act_Activite_by_DeputeSlugAndWeekNumber"), [
        getDeputeRefByDeputeSlug(deputeSlug),
        weekNumber
      ])
    ),
    Lambda("X", Update(Var("X"), { data }))
  );
}

export function deleteActiviteByDeputeSlugAndWeekNumber(
  deputeSlug: String,
  weekNumber: Number
) {
  return Map(
    Paginate(
      Match(Index("act_Activite_by_DeputeSlugAndWeekNumber"), [
        getDeputeRefByDeputeSlug(deputeSlug),
        weekNumber
      ])
    ),
    Lambda("X", Delete(Var("X")))
  );
}

function getGroupeParlementaireRefBySigle(sigle: String) {
  return Select("ref", Get(Match(Index("GroupeParlementaire"), sigle)));
}

export function getAdresses() {
  return Map(
    Paginate(Documents(Collection("Adresse")), { size: 1000 }),
    Lambda("X", Get(Var("X")))
  );
}

export function getAdressesByDeputeSlug(slug: String) {
  return Map(
    Paginate(
      Match(
        Index("adresse_Deputes_by_depute"),
        Select("ref", Get(Match(Index("unique_Depute_Slug"), slug)))
      )
    ),
    Lambda("X", Get(Var("X")))
  );
}

export function getAdressByAdresseComplete(adresseComplete: String) {
  return Get(Match(Index("unique_Adresse_AdresseComplete"), adresseComplete));
}

export function createAdresse(data: Types.Canonical.Adresse) {
  return Create(Collection("Adresse"), {
    data
  });
}

export function updateAdresse(data: Types.Canonical.Adresse) {
  return Map(
    Paginate(Match(Index("unique_Adresse_AdresseComplete"), data.AdresseComplete)),
    Lambda(
      "X",
      Update(Var("X"), {
        data,
      })
    )
  );
}

export function createAdresseDeputeRelationLink(slug: String, adresseComplete: String) {
  return Create(Collection("adresse_Deputes"), {
    data: {
      adresseID: Select("ref", Get(Match(Index("unique_Adresse_AdresseComplete"), adresseComplete))),
      deputeID: Select("ref", Get(Match(Index("unique_Depute_Slug"), slug))),
    }
  });
}

export function removeAdresseDeputeRelationLink(slug: String, adresseComplete: String) {
  return Map(
    Paginate(
      Match(Index("adresse_Deputes_by_adresse_and_depute"), [
        Select("ref", Get(Match(Index("unique_Adresse_AdresseComplete"), adresseComplete))),
        Select("ref", Get(Match(Index("unique_Depute_Slug"), slug))),
      ])
    ),
    Lambda("X", Delete(Var("X")))
  );
}

