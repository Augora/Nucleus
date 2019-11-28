import faunadb from "faunadb";

import {
  getDeputeRefByDeputeSlug,
  createAncienMandat,
  getAnciensMandatByDeputeID,
  deleteAncienMandatByID
} from "./Refs";
import { MapAncienMandat } from "../Mappings/Depute";

export function manageAnciensMandatsByDeputeID(
  id: string,
  slug: string,
  anciensMandats: Types.External.NosDeputesFR.AncienMandat[],
  client: faunadb.Client
) {
  return client
    .query(getAnciensMandatByDeputeID(id))
    .then((ret: any) => ret.data)
    .then(ams => {
      const anciensMandatsToCreate = anciensMandats
        .map(am => MapAncienMandat(am))
        .filter(ld_am => {
          return (
            ams
              .map(rd_am => rd_am.data)
              .find(rd_am => {
                return (
                  rd_am.DateDeDebut === ld_am.DateDeDebut &&
                  rd_am.DateDeFin === ld_am.DateDeFin &&
                  rd_am.Intitule === ld_am.Intitule
                );
              }) === undefined
          );
        });
      const anciensMandatsToDelete = ams
        .filter(rd_am => {
          return (
            anciensMandats
              .map(am => MapAncienMandat(am))
              .find(ld_am => {
                return (
                  rd_am.data.DateDeDebut === ld_am.DateDeDebut &&
                  rd_am.data.DateDeFin === ld_am.DateDeFin &&
                  rd_am.data.Intitule === ld_am.Intitule
                );
              }) === undefined
          );
        })
        .map(am => am.ref.id);
      const anciensMandatsToCreatePromise = Promise.all(
        anciensMandatsToCreate.map(am => {
          return client
            .query(
              createAncienMandat(
                Object.assign({}, am, {
                  Depute: getDeputeRefByDeputeSlug(slug)
                })
              )
            )
            .then((ret: any) => {
              console.log("Inserted mandat:", ret.data);
            })
            .catch(e => console.error(e));
        })
      );
      const anciensMandatsToDeletePromise = Promise.all(
        anciensMandatsToDelete.forEach(am_id => {
          return client
            .query(deleteAncienMandatByID(am_id))
            .then((ret: any) => {
              console.log("Deleted mandat:", ret.data);
            })
            .catch(e => console.error(e));
        })
      );
      return Promise.all([
        anciensMandatsToCreatePromise,
        anciensMandatsToDeletePromise
      ]);
    })
    .catch(e => e);
}
