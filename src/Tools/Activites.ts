import faunadb, { values } from "faunadb";
import axios from "axios";
import { from } from "rxjs";
import { mergeMap } from "rxjs/operators";

import {
  getActivitesByDeputeID,
  getDeputeRefByDeputeSlug,
  createActivite,
  deleteActiviteByID,
  updateActiviteByRef
} from "./Refs";
import { MapActivites } from "../Mappings/Depute";

export function manageActivitesByDeputeID(
  id: string,
  slug: string,
  client: faunadb.Client
) {
  client
    .query(getActivitesByDeputeID(id))
    .then((ret: values.Document<any>) => ret.data)
    .then(rd_acts => {
      axios
        .get(
          `https://www.nosdeputes.fr/${slug}/graphes/lastyear/total?questions=true&format=json`
        )
        .then(response => {
          const { data } = response;
          const ld_acts = MapActivites(data);

          const activitiesToUpdate = rd_acts
            .filter(rd_act => {
              return (
                ld_acts.find(
                  ld_act =>
                    rd_act.data.NumeroDeSemaine === ld_act.NumeroDeSemaine &&
                    (ld_act.NumeroDeSemaine !== rd_act.data.NumeroDeSemaine ||
                      ld_act.ParticipationEnHemicycle !==
                        rd_act.data.ParticipationEnHemicycle ||
                      ld_act.ParticipationsEnCommission !==
                        rd_act.data.ParticipationsEnCommission ||
                      ld_act.PresenceEnHemicycle !==
                        rd_act.data.PresenceEnHemicycle ||
                      ld_act.PresencesEnCommission !==
                        rd_act.data.PresencesEnCommission ||
                      ld_act.Question !== rd_act.data.Question ||
                      ld_act.Vacances !== rd_act.data.Vacances)
                ) !== undefined
              );
            })
            .map(rd_act => {
              const ld_act = ld_acts.find(
                ld_act => rd_act.data.NumeroDeSemaine === ld_act.NumeroDeSemaine
              );
              return Object.assign({}, rd_act, { data: ld_act });
            });
          const activitesToCreate = ld_acts.filter(ld_act => {
            return (
              rd_acts
                .map(rd_acts => rd_acts.data)
                .find(
                  rd_act => ld_act.NumeroDeSemaine === rd_act.NumeroDeSemaine
                ) === undefined
            );
          });
          const activitesToDelete = rd_acts
            .filter(rd_act => {
              return (
                ld_acts.find(
                  ld_act =>
                    ld_act.NumeroDeSemaine === rd_act.data.NumeroDeSemaine
                ) === undefined
              );
            })
            .map(act => act.ref.id);
          const activitesToCreatePromise = from(activitesToCreate)
            .pipe(
              mergeMap((act: any) => {
                return client
                  .query(
                    createActivite(
                      Object.assign({}, act, {
                        Depute: getDeputeRefByDeputeSlug(slug)
                      })
                    )
                  )
                  .then((ret: any) => {
                    console.log("Inserted activity:", ret.data);
                  })
                  .catch(e => console.error(e));
              }, 1)
            )
            .toPromise();
          const activitesToDeletePromise = from(activitesToDelete)
            .pipe(
              mergeMap((act_id: string) => {
                return client
                  .query(deleteActiviteByID(act_id))
                  .then((ret: any) => {
                    console.log("Deleted activity:", ret.data);
                  })
                  .catch(e => console.error(e));
              }, 1)
            )
            .toPromise();
          const activitiesToUpdatePromise = from(activitiesToUpdate).pipe(
            mergeMap((act: any) => {
              return client
                .query(updateActiviteByRef(act.ref.id, act.data))
                .then((ret: any) => {
                  console.log("Deleted activity:", ret.data);
                })
                .catch(e => console.error(e));
            }, 1)
          );
          return Promise.all([
            activitesToCreatePromise,
            activitesToDeletePromise,
            activitiesToUpdatePromise
          ]);
        });
    });
}
