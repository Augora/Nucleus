import faunadb, { values } from "faunadb";
import axios from "axios";
import { from, merge } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { getDeputes, createDepute, updateDeputeByRef } from "./Refs";
import { MapDepute, areTheSameDeputes } from "../Mappings/Depute";
import { CompareLists, Action, DiffType } from "../Tools/Comparison";
import { manageActivitesByDeputeID } from "./Activites";

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
          // console.log("Number of deputes on NosDeputes.fr:", deputes.length);
          // console.log("Number of deputes on FaunaDB:", rd_acts.length);
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
                // console.log(action);
                if (action.Action === Action.Create) {
                  // console.log("Create:", action.Data);
                  return client
                    .query(createDepute(action.Data))
                    .then((ret: any) => {
                      console.log("Inserted depute:", ret.data);
                      return Promise.all([
                        manageActivitesByDeputeID(action.Data.Slug, client)
                      ]);
                    });
                } else if (action.Action === Action.Update) {
                  // console.log("Update:", action.Data);
                  return client
                    .query(updateDeputeByRef(action.Data))
                    .then((ret: any) => {
                      console.log("Updated depute:", ret.data);
                      return Promise.all([
                        manageActivitesByDeputeID(action.Data.Slug, client)
                      ]);
                    });
                } else if (action.Action === Action.Remove) {
                  // console.log("Remove:", action.Data);
                  // TODO: Think about this kind of cases.
                  return Promise.resolve();
                } else if (action.Action === Action.None) {
                  // console.log("None:", action.Data);
                  return Promise.all([
                    // manageActivitesByDeputeID(action.Data.Slug, client)
                  ]);
                }
              }, 1)
            )
            .toPromise();
        });
    })
    .catch(err => {
      console.error("Something went wrong while retriving deputies:", err);
    });
}
