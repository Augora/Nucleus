import faunadb from "faunadb";
import axios from "axios";
import { from } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { MapDepute } from "./Mappings/Depute";
import {
  getDeputeRefBySlug,
  updateDeputeByRef,
  createDepute
} from "./Tools/Refs";
import { manageAutresMandatsByDeputeID } from "./Tools/AutresMandat";
import { manageAnciensMandatsByDeputeID } from "./Tools/AnciensMandat";
import { manageActivitesByDeputeID } from "./Tools/Activites";

import "./Types/External/NosDeputesFR/Depute";
import "./Types/Canonical/Activity";

const client = new faunadb.Client({
  secret: process.env.FAUNADB_TOKEN
});

const FILTER_ON_FABIEN_MATRAS = true;

axios
  .get("https://www.nosdeputes.fr/deputes/json")
  .then(response =>
    response.data.deputes.filter(d => {
      if (FILTER_ON_FABIEN_MATRAS) {
        return d.depute.slug === "cedric-roussel";
      } else {
        return true;
      }
    })
  )
  .then(deputes => {
    return from(deputes)
      .pipe(
        mergeMap((d: any) => {
          const localDepute: Types.External.NosDeputesFR.Depute = d.depute;
          const mappedDepute = MapDepute(localDepute);
          return client
            .query(getDeputeRefBySlug(localDepute.slug))
            .then((ret: any) => {
              return client
                .query(updateDeputeByRef(ret.ref.id, mappedDepute))
                .then((ret: any) => {
                  console.log("Updated", ret.data.Slug);
                  return Promise.all([
                    // manageAutresMandatsByDeputeID(
                    //   ret.ref.id,
                    //   ret.data.Slug,
                    //   localDepute.autres_mandats,
                    //   client
                    // ),
                    // manageAnciensMandatsByDeputeID(
                    //   ret.ref.id,
                    //   ret.data.Slug,
                    //   localDepute.anciens_mandats.filter(
                    //     am => am.mandat.split(" / ")[2].length > 0
                    //   ),
                    //   client
                    // ),
                    manageActivitesByDeputeID(ret.data.Slug, client)
                  ]);
                })
                .catch(e => console.error(e));
            })
            .catch(e => {
              if (e.message === "instance not found") {
                client
                  .query(createDepute(mappedDepute))
                  .then((ret: any) => {
                    console.log("Inserted", ret.data.Slug);
                    return Promise.all([
                      manageAutresMandatsByDeputeID(
                        ret.ref.id,
                        ret.data.Slug,
                        localDepute.autres_mandats,
                        client
                      ),
                      manageAnciensMandatsByDeputeID(
                        ret.ref.id,
                        ret.data.Slug,
                        localDepute.anciens_mandats,
                        client
                      ),
                      manageActivitesByDeputeID(ret.data.Slug, client)
                    ]);
                  })
                  .catch(e => console.error(e));
              } else {
                console.error(e);
              }
              return e;
            });
        }, 10)
      )
      .subscribe(f => f);
  });
