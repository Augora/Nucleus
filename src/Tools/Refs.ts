import { query } from "faunadb";
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
  return Create(Collection("Depute"), {
    data: Object.assign({}, data, {
      GroupeParlementaire: getGroupeParlementaireRefBySigle(
        data.SigleGroupePolitique
      )
    })
  });
}

export function createAutreMandat(data: Types.Canonical.AutreMandat) {
  return Create(Collection("AutreMandat"), {
    data
  });
}

export function updateAutreMandat(data: Types.Canonical.AutreMandat) {
  return Map(
    Paginate(
      Match(
        Index("unique_AutreMandat_AutreMandatComplet"),
        data.AutreMandatComplet
      )
    ),
    Lambda(
      "X",
      Update(Var("X"), {
        data
      })
    )
  );
}

export function getAutreMandatByAncienMandatComplet(ancienMandat: String) {
  return Get(
    Match(Index("unique_AutreMandat_AutreMandatComplet"), ancienMandat)
  );
}

export function getAutresMandatByDeputeSlug(slug: String) {
  return Map(
    Paginate(
      Match(
        Index("autreMandat_Depute_by_depute"),
        getDeputeRefByDeputeSlug(slug)
      )
    ),
    Lambda("X", Get(Var("X")))
  );
}

export function createAutreMandatDeputeRelationLink(
  slug: String,
  ancienMandatComplet: String
) {
  return Create(Collection("autreMandat_Deputes"), {
    data: {
      ancienMandatID: Select(
        "ref",
        Get(
          Match(
            Index("unique_AutreMandat_AutreMandatComplet"),
            ancienMandatComplet
          )
        )
      ),
      deputeID: Select("ref", Get(Match(Index("unique_Depute_Slug"), slug)))
    }
  });
}

export function removeAutreMandatDeputeRelationLink(
  slug: String,
  ancienMandatComplet: String
) {
  return Map(
    Paginate(
      Match(Index("autreMandat_Deputes_by_autreMandat_and_depute"), [
        Select(
          "ref",
          Get(
            Match(
              Index("unique_AutreMandat_AutreMandatComplet"),
              ancienMandatComplet
            )
          )
        ),
        Select("ref", Get(Match(Index("unique_Depute_Slug"), slug)))
      ])
    ),
    Lambda("X", Delete(Var("X")))
  );
}

export function createAncienMandat(data: Types.Canonical.AncienMandat) {
  return Create(Collection("AncienMandat"), {
    data
  });
}

export function updateAncienMandat(data: Types.Canonical.AncienMandat) {
  return Map(
    Paginate(
      Match(
        Index("unique_AncienMandat_AncienMandatComplet"),
        data.AncienMandatComplet
      )
    ),
    Lambda(
      "X",
      Update(Var("X"), {
        data
      })
    )
  );
}

export function getAncienMandatByAncienMandatComplet(ancienMandat: String) {
  return Get(
    Match(Index("unique_AncienMandat_AncienMandatComplet"), ancienMandat)
  );
}

export function getAnciensMandatByDeputeSlug(slug: String) {
  return Map(
    Paginate(
      Match(
        Index("ancienMandat_Deputes_by_depute"),
        getDeputeRefByDeputeSlug(slug)
      )
    ),
    Lambda("X", Get(Var("X")))
  );
}

export function createAncienMandatDeputeRelationLink(
  slug: String,
  ancienMandatComplet: String
) {
  return Create(Collection("ancienMandat_Deputes"), {
    data: {
      ancienMandatID: Select(
        "ref",
        Get(
          Match(
            Index("unique_AncienMandat_AncienMandatComplet"),
            ancienMandatComplet
          )
        )
      ),
      deputeID: Select("ref", Get(Match(Index("unique_Depute_Slug"), slug)))
    }
  });
}

export function removeAncienMandatDeputeRelationLink(
  slug: String,
  ancienMandatComplet: String
) {
  return Map(
    Paginate(
      Match(Index("ancienMandat_Deputes_by_ancienMandat_and_depute"), [
        Select(
          "ref",
          Get(
            Match(
              Index("unique_AncienMandat_AncienMandatComplet"),
              ancienMandatComplet
            )
          )
        ),
        Select("ref", Get(Match(Index("unique_Depute_Slug"), slug)))
      ])
    ),
    Lambda("X", Delete(Var("X")))
  );
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
    Paginate(
      Match(Index("unique_Adresse_AdresseComplete"), data.AdresseComplete)
    ),
    Lambda(
      "X",
      Update(Var("X"), {
        data
      })
    )
  );
}

export function createAdresseDeputeRelationLink(
  slug: String,
  adresseComplete: String
) {
  return Create(Collection("adresse_Deputes"), {
    data: {
      adresseID: Select(
        "ref",
        Get(Match(Index("unique_Adresse_AdresseComplete"), adresseComplete))
      ),
      deputeID: Select("ref", Get(Match(Index("unique_Depute_Slug"), slug)))
    }
  });
}

export function removeAdresseDeputeRelationLink(
  slug: String,
  adresseComplete: String
) {
  return Map(
    Paginate(
      Match(Index("adresse_Deputes_by_adresse_and_depute"), [
        Select(
          "ref",
          Get(Match(Index("unique_Adresse_AdresseComplete"), adresseComplete))
        ),
        Select("ref", Get(Match(Index("unique_Depute_Slug"), slug)))
      ])
    ),
    Lambda("X", Delete(Var("X")))
  );
}
