import faunadb, { values } from 'faunadb'
import { from, concat } from 'rxjs'
import { mergeMap, retry } from 'rxjs/operators'

import {
  getAdressesByDeputeSlug,
  getAdressByAdresseComplete,
  createAdresse,
  updateAdresse,
  createAdresseDeputeRelationLink,
  removeAdresseDeputeRelationLink,
} from './Refs'
import { MapAdresse, areTheSameAdresses } from '../Mappings/Depute'
import { CompareLists, Action, DiffType } from '../Tools/Comparison'

export function manageAdresses(
  slug: string,
  client: faunadb.Client,
  adresses: string[]
) {
  const LDAds = adresses.map((ad) => MapAdresse(ad))
  return concat(
    from(LDAds).pipe(
      mergeMap((adresse: Types.Canonical.Adresse) => {
        console.log('Processing', adresse)
        return client
          .query(getAdressByAdresseComplete(adresse.AdresseComplete))
          .then((ret: values.Document<Types.Canonical.Adresse>) => ret.data)
          .then((adresseFromFauna) => {
            if (!areTheSameAdresses(adresse, adresseFromFauna)) {
              console.log('Updating adresse:', adresseFromFauna, 'to', adresse)
              return client.query(updateAdresse(adresse)).then((ret: any) => {
                console.log('Updated adresse:', ret)
              })
            } else {
              console.log('Nothing to do on', adresse)
            }
          })
          .catch((e) => {
            console.log('Creating adresse:', adresse)
            return client.query(createAdresse(adresse)).then((ret: any) => {
              console.log('Created adresse:', ret)
            })
          })
      }, 1),
      retry(2)
    ),
    from(
      client
        .query(getAdressesByDeputeSlug(slug))
        .then(
          (ret: values.Document<values.Document<Types.Canonical.Adresse>[]>) =>
            ret.data.map((e) => e.data)
        )
        .then((RSAds) =>
          CompareLists(LDAds, RSAds, areTheSameAdresses, 'AdresseComplete')
        )
    ).pipe(
      mergeMap((actions: DiffType<Types.Canonical.Adresse>[]) => {
        return from(actions).pipe(
          mergeMap((action: DiffType<Types.Canonical.Adresse>) => {
            if (action.Action === Action.Create) {
              console.log('Creating adresse link:', action.Data)
              return client
                .query(
                  createAdresseDeputeRelationLink(
                    slug,
                    action.Data.AdresseComplete
                  )
                )
                .then((ret: any) => {
                  console.log('Created adresse link:', ret)
                })
            } else if (action.Action === Action.Remove) {
              console.log('Removing adresse link:', action.Data)
              return client
                .query(
                  removeAdresseDeputeRelationLink(
                    slug,
                    action.Data.AdresseComplete
                  )
                )
                .then((ret: any) => {
                  console.log('Removed adresse link:', ret.data)
                })
            } else {
              // Nothing to do
              console.log('Nothing to do at all on :', action.Data)
              return Promise.resolve()
            }
          }, 1),
          retry(2)
        )
      }, 1),
      retry(2)
    )
  ).toPromise()
}
