import faunadb from "faunadb";

import {
  getDeputeRefByDeputeSlug,
  createAutreMandat,
  getAutresMandatByDeputeID,
  deleteAutreMandatByID
} from "./Refs";
import { MapAutreMandat } from "../Mappings/Depute";

export function manageAutresMandatsByDeputeID(
  id: string,
  slug: string,
  autresMandats: Types.External.NosDeputesFR.AutreMandat[],
  client: faunadb.Client
) {
  return client
    .query(getAutresMandatByDeputeID(id))
    .then((ret: any) => ret.data)
    .then(ams => {
      const autresMandatsToCreate = autresMandats.filter(ld_am => {
        return (
          ams
            .map(rd_am => rd_am.data)
            .find(rd_am => {
              return (
                [rd_am.Localite, rd_am.Institution, rd_am.Intitule].join(
                  " / "
                ) === ld_am.mandat
              );
            }) === undefined
        );
      });
      const autresMandatsToDelete = ams
        .filter(rd_am => {
          return (
            autresMandats.find(ld_am => {
              return (
                [
                  rd_am.data.Localite,
                  rd_am.data.Institution,
                  rd_am.data.Intitule
                ].join(" / ") === ld_am.mandat
              );
            }) === undefined
          );
        })
        .map(am => am.ref.id);
      const autresMandatsToCreatePromise = Promise.all(
        autresMandatsToCreate.map(am => {
          const mappedAutreMandat = MapAutreMandat(am);
          return client
            .query(
              createAutreMandat(
                Object.assign({}, mappedAutreMandat, {
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
      const autresMandatsToDeletePromise = Promise.all(
        autresMandatsToDelete.map(am_id => {
          return client
            .query(deleteAutreMandatByID(am_id))
            .then((ret: any) => {
              console.log("Deleted mandat:", ret.data);
            })
            .catch(e => console.error(e));
        })
      );
      return Promise.all([
        autresMandatsToDeletePromise,
        autresMandatsToCreatePromise
      ]);
    })
    .catch(e => e);
}
