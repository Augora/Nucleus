import faunadb, { values } from "faunadb";
import { from, concat } from "rxjs";
import { mergeMap } from "rxjs/operators";

import {
  getAdressesByDeputeSlug,
  getAdresses,
  createAdresse,
  updateAdresse,
  createAdresseDeputeRelationLink,
  removeAdresseDeputeRelationLink,
} from "./Refs";
import { MapAdresse, areTheSameAdresses } from "../Mappings/Depute";
import { CompareLists, Action, DiffType } from "../Tools/Comparison";

export function manageAdressesByDeputeID(
  slug: String,
  client: faunadb.Client,
  adresses: String[]
) {
  return client
    .query(getAdresses())
    .then((ret: values.Document<values.Document<Types.Canonical.Adresse>[]>) =>
      ret.data.map(e => e.data)
    )
    .then(all_ads => {
      const ld_ads = adresses.map(ad => MapAdresse(ad));
      const res = CompareLists(ld_ads, all_ads, areTheSameAdresses, "AdresseComplete");
      return concat(
        from(res)
          .pipe(
            mergeMap((action: DiffType<Types.Canonical.Adresse>) => {
              if (action.Action === Action.Create) {
                console.log("Creating adresse:", action.Data);
                return client.query(createAdresse(action.Data))
                  .then((ret: any) => {
                    console.log("Created adresse:", ret.data);
                  });
              } else if (action.Action === Action.Update) {
                console.log("Updating adresse:", action.Data);
                return client
                  .query(
                    updateAdresse(
                      action.Data
                    )
                  )
                  .then((ret: any) => {
                    console.log("Updated adresse:", ret.data);
                  });
              } else {
                //Nothing to do
                return Promise.resolve();
              }
            }, 1)
          ),
        from(client.query(getAdressesByDeputeSlug(slug)).then((ret: values.Document<values.Document<Types.Canonical.Adresse>[]>) =>
          ret.data.map(e => e.data)
        ).then(rd_ads => CompareLists(ld_ads, rd_ads, areTheSameAdresses, "AdresseComplete")))
          .pipe(
            mergeMap((actions: DiffType<Types.Canonical.Adresse>[]) => {
              return from(actions)
                .pipe(mergeMap((action: DiffType<Types.Canonical.Adresse>) => {
                  if (action.Action === Action.Create) {
                    console.log("Creating adresse link:", action.Data);
                    return client.query(createAdresseDeputeRelationLink(slug, action.Data.AdresseComplete))
                      .then((ret: any) => {
                        console.log("Created adresse link:", ret);
                      });
                  } else if (action.Action === Action.Remove) {
                    console.log("Removing adresse link:", action.Data);
                    return client
                      .query(
                        removeAdresseDeputeRelationLink(
                          slug,
                          action.Data.AdresseComplete
                        )
                      )
                      .then((ret: any) => {
                        console.log("Removed adresse link:", ret.data);
                      });
                  } else {
                    //Nothing to do
                    return Promise.resolve();
                  }
                }, 1));
            }, 1))
      ).subscribe(f => f);
    })
}
