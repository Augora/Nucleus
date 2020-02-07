import faunadb, { values } from "faunadb";
import axios from "axios";
import { from, merge } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { getDeputes } from "./Refs";
import { MapDepute, areTheSameDeputes } from "../Mappings/Depute";
import { CompareLists, Action, DiffType } from "../Tools/Comparison";

export function manageDeputes(client: faunadb.Client) {
  return client
    .query(getDeputes())
    .then((ret: values.Document<values.Document<Types.Canonical.Depute>[]>) =>
      ret.data.map(e => e.data)
    )
    .then(rd_acts => {
      return axios
        .get(`https://www.nosdeputes.fr/deputes/json`)
        .then(res => res.data.deputes.map(d => d.depute))
        .then(deputes => {
          console.log("Number of deputes on NosDeputes.fr:", deputes.length);
          console.log("Number of deputes on FaunaDB:", rd_acts.length);
          const ld_acts = deputes.map(d => MapDepute(d));
          const res = CompareLists(
            ld_acts,
            rd_acts,
            areTheSameDeputes,
            "Slug",
            true
          );
          return from(res)
            .pipe(
              mergeMap((action: DiffType<Types.Canonical.Depute>) => {
                console.log(action);
                if (action.Action === Action.Create) {
                  console.log("Create:", action.Data);
                  return Promise.resolve();
                  // return client
                  //   .query(
                  //     createActivite(
                  //       Object.assign({}, action.Data, {
                  //         Depute: getDeputeRefByDeputeSlug(slug)
                  //       })
                  //     )
                  //   )
                  //   .then((ret: any) => {
                  //     console.log("Inserted activity:", ret.data);
                  //   });
                } else if (action.Action === Action.Update) {
                  console.log("Update:", action.Data);
                  return Promise.resolve();
                  // return client
                  //   .query(
                  //     updateActiviteByDeputeSlugAndWeekNumber(
                  //       slug,
                  //       action.Data.NumeroDeSemaine,
                  //       action.Data
                  //     )
                  //   )
                  //   .then((ret: any) => {
                  //     console.log("Updated activity:", ret.data);
                  //   });
                } else if (action.Action === Action.Remove) {
                  console.log("Remove:", action.Data);
                  return Promise.resolve();
                  // return client
                  //   .query(
                  //     deleteActiviteByDeputeSlugAndWeekNumber(
                  //       slug,
                  //       action.Data.NumeroDeSemaine
                  //     )
                  //   )
                  //   .then((ret: any) => {
                  //     console.log("Deleted activity:", ret.data);
                  //   });
                } else if (action.Action === Action.None) {
                  console.log("None:", action.Data);
                  return Promise.resolve();
                }
              }, 1)
            )
            .subscribe(f => f);
        });
    })
    .catch(err => {
      console.error("Something went wrong while retriving deputies:", err);
    });
}
