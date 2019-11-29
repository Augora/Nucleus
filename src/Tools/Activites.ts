import faunadb from "faunadb";
import axios from "axios";
import { from } from "rxjs";
import { mergeMap } from "rxjs/operators";

import {
  getActivitesByDeputeID,
  getDeputeRefByDeputeSlug,
  createActivite,
  deleteActiviteByID
} from "./Refs";
import { MapActivites } from "../Mappings/Depute";

export function manageActivitesByDeputeID(
  id: string,
  slug: string,
  client: faunadb.Client
) {
  client
    .query(getActivitesByDeputeID(id))
    .then((ret: any) => ret.data)
    .then(rd_acts => {
      axios
        .get(
          `https://www.nosdeputes.fr/${slug}/graphes/lastyear/total?questions=true&format=json`
        )
        .then(response => {
          const { data } = response;
          const ld_acts = MapActivites(data);
          const activitesToCreate = ld_acts.filter(ld_act => {
            return (
              rd_acts
                .map(rd_acts => rd_acts.data)
                .find(rd_act => {
                  return (
                    ld_act.DateDeDebut === rd_act.DateDeDebut &&
                    ld_act.DateDeFin === rd_act.DateDeFin &&
                    ld_act.NumeroDeSemaine === rd_act.NumeroDeSemaine &&
                    ld_act.ParticipationEnHemicycle ===
                      rd_act.ParticipationEnHemicycle &&
                    ld_act.ParticipationsEnCommission ===
                      rd_act.ParticipationsEnCommission &&
                    ld_act.PresenceEnHemicycle === rd_act.PresenceEnHemicycle &&
                    ld_act.PresencesEnCommission ===
                      rd_act.PresencesEnCommission &&
                    ld_act.Question === rd_act.Question &&
                    ld_act.Vacances === rd_act.Vacances
                  );
                }) === undefined
            );
          });
          const activitesToDelete = rd_acts
            .filter(rd_act => {
              return (
                ld_acts.find(ld_act => {
                  return (
                    ld_act.DateDeDebut === rd_act.data.DateDeDebut &&
                    ld_act.DateDeFin === rd_act.data.DateDeFin &&
                    ld_act.NumeroDeSemaine === rd_act.data.NumeroDeSemaine &&
                    ld_act.ParticipationEnHemicycle ===
                      rd_act.data.ParticipationEnHemicycle &&
                    ld_act.ParticipationsEnCommission ===
                      rd_act.data.ParticipationsEnCommission &&
                    ld_act.PresenceEnHemicycle ===
                      rd_act.data.PresenceEnHemicycle &&
                    ld_act.PresencesEnCommission ===
                      rd_act.data.PresencesEnCommission &&
                    ld_act.Question === rd_act.data.Question &&
                    ld_act.Vacances === rd_act.data.Vacances
                  );
                }) === undefined
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
                    console.log("Inserted activite:", ret.data);
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
                    console.log("Deleted activite:", ret.data);
                  })
                  .catch(e => console.error(e));
              }, 1)
            )
            .toPromise();
          return Promise.all([
            activitesToCreatePromise,
            activitesToDeletePromise
          ]);
        });
    });
}
