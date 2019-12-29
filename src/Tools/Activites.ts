import faunadb, { values } from "faunadb";
import axios from "axios";
import { from, merge } from "rxjs";
import { mergeMap } from "rxjs/operators";

import {
  getActivitesByDeputeSlug,
  createActivite,
  deleteActiviteByID,
  updateActiviteByRef
} from "./Refs";
import { MapActivites, areTheSameActivites } from "../Mappings/Depute";
import { CompareLists, Action, DiffType } from "../Tools/Comparison";

export function manageActivitesByDeputeID(
  slug: string,
  client: faunadb.Client
) {
  return client
    .query(getActivitesByDeputeSlug(slug))
    .then((ret: values.Document<values.Document<Types.Canonical.Activite>[]>) =>
      ret.data.map(e => e.data)
    )
    .then(rd_acts => {
      return axios
        .get(
          `https://www.nosdeputes.fr/${slug}/graphes/lastyear/total?questions=true&format=json`
        )
        .then(response => {
          const { data } = response;
          const ld_acts = MapActivites(data);
          const res = CompareLists(
            ld_acts,
            rd_acts,
            areTheSameActivites,
            "NumeroDeSemaine"
          );
          return from(res)
            .pipe(
              mergeMap((action: DiffType<Types.Canonical.Activite>) => {
                console.log(action);
                if (action.Action === Action.Create) {
                  return client
                    .query(createActivite(action.Data))
                    .then((ret: any) => {
                      console.log("Inserted activity:", ret.data);
                    });
                } else if (action.Action === Action.Update) {
                  console.log(action.Data);
                  return client
                    .query(
                      updateActiviteByRef(
                        slug,
                        action.Data.NumeroDeSemaine,
                        action.Data
                      )
                    )
                    .then((ret: any) => {
                      console.log("Updated activity:", ret.data);
                    });
                }
              }, 1)
            )
            .subscribe(f => f);
        });
    })
    .catch(err => {
      console.error(
        "Something went wrong while retriving activities from",
        slug,
        ":",
        err
      );
    });
}
