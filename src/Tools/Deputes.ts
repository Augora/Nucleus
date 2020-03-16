import faunadb, { values } from "faunadb";
import axios from "axios";
import { from } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { getDeputes, createDepute, updateDeputeByRef } from "./Refs";
import { MapDepute, areTheSameDeputes } from "../Mappings/Depute";
import { CompareLists, Action, DiffType } from "../Tools/Comparison";
import { manageActivites } from "./Activites";
import { manageAdresses } from "./Adresse";
import { manageAnciensMandats } from "./AnciensMandat";
import { manageAutresMandats } from "./AutresMandat";

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
        .then((deputes: Types.External.NosDeputesFR.Depute[]) => {
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
                console.log("Processing", action.Data.Slug);
                const currentDeputeFromAPI = deputes.find(
                  d => d.slug === action.Data.Slug
                );
                if (action.Action === Action.Create) {
                  return client
                    .query(createDepute(action.Data))
                    .then((ret: any) => {
                      console.log("Inserted depute:", ret.data);
                      return Promise.all([
                        manageActivites(action.Data.Slug, client),
                        manageAdresses(
                          action.Data.Slug,
                          client,
                          action.Data.Adresses
                        ),
                        manageAnciensMandats(
                          action.Data.Slug,
                          client,
                          currentDeputeFromAPI.anciens_mandats.map(
                            am => am.mandat
                          )
                        ),
                        manageAutresMandats(
                          action.Data.Slug,
                          client,
                          currentDeputeFromAPI.autres_mandats.map(
                            am => am.mandat
                          )
                        )
                      ]);
                    });
                } else if (action.Action === Action.Update) {
                  return client
                    .query(updateDeputeByRef(action.Data))
                    .then((ret: any) => {
                      console.log(
                        "Updated depute:",
                        action.Data,
                        "to",
                        ret.data
                      );
                      return Promise.all([
                        manageActivites(action.Data.Slug, client),
                        manageAdresses(
                          action.Data.Slug,
                          client,
                          action.Data.Adresses
                        ),
                        manageAnciensMandats(
                          action.Data.Slug,
                          client,
                          currentDeputeFromAPI.anciens_mandats.map(
                            am => am.mandat
                          )
                        ),
                        manageAutresMandats(
                          action.Data.Slug,
                          client,
                          currentDeputeFromAPI.autres_mandats.map(
                            am => am.mandat
                          )
                        )
                      ]);
                    });
                } else if (action.Action === Action.Remove) {
                  // TODO: Think about this kind of cases.
                  return Promise.resolve();
                } else if (action.Action === Action.None) {
                  console.log("Nothing to do on", action.Data.Slug);
                  return Promise.all([
                    manageActivites(action.Data.Slug, client),
                    manageAdresses(
                      action.Data.Slug,
                      client,
                      action.Data.Adresses
                    ),
                    manageAnciensMandats(
                      action.Data.Slug,
                      client,
                      currentDeputeFromAPI.anciens_mandats
                        .map(am => am.mandat)
                        .filter(am => am.split(" / ")[1] !== "")
                    ),
                    manageAutresMandats(
                      action.Data.Slug,
                      client,
                      currentDeputeFromAPI.autres_mandats.map(am => am.mandat)
                    )
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
