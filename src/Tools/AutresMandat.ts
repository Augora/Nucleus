import faunadb, { values } from 'faunadb'
import { from, concat } from 'rxjs'
import { mergeMap, retry } from 'rxjs/operators'

import {
  getAutreMandatByAncienMandatComplet,
  updateAutreMandat,
  createAutreMandat,
  getAutresMandatByDeputeSlug,
  createAutreMandatDeputeRelationLink,
  removeAutreMandatDeputeRelationLink,
} from './Refs'
import { MapAutreMandat, areTheSameAutresMandats } from '../Mappings/Depute'
import { CompareLists, Action, DiffType } from '../Tools/Comparison'

export function manageAutresMandats(
  slug: string,
  client: faunadb.Client,
  autresMandats: string[]
) {
  const LDAms = autresMandats.map((am) => MapAutreMandat(am))
  return concat(
    from(LDAms).pipe(
      mergeMap((autreMandat: Types.Canonical.AutreMandat) => {
        console.log('start', autreMandat)
        return client
          .query(
            getAutreMandatByAncienMandatComplet(autreMandat.AutreMandatComplet)
          )
          .then((ret: values.Document<Types.Canonical.AutreMandat>) => ret.data)
          .then((autreMandatFromFauna) => {
            if (!areTheSameAutresMandats(autreMandat, autreMandatFromFauna)) {
              console.log(
                'Updating autre mandat:',
                autreMandatFromFauna,
                'to',
                autreMandat
              )
              return client
                .query(updateAutreMandat(autreMandat))
                .then((ret: any) => {
                  console.log('Updated autre mandat:', ret)
                })
            } else {
              console.log('nothing to do', autreMandat)
              return Promise.resolve()
            }
          })
          .catch((e) => {
            console.error(e)
            console.log('Creating autre mandat:', autreMandat)
            return client
              .query(createAutreMandat(autreMandat))
              .then((ret: any) => {
                console.log('Created autre mandat:', ret)
              })
          })
      }, 1),
      retry(2)
    ),
    from(
      client
        .query(getAutresMandatByDeputeSlug(slug))
        .then(
          (
            ret: values.Document<values.Document<Types.Canonical.AutreMandat>[]>
          ) => ret.data.map((e) => e.data)
        )
        .then((RDAms) => {
          console.log(LDAms, RDAms)
          return CompareLists(
            LDAms,
            RDAms,
            areTheSameAutresMandats,
            'AutreMandatComplet'
          )
        })
    ).pipe(
      mergeMap((actions: DiffType<Types.Canonical.AutreMandat>[]) => {
        return from(actions).pipe(
          mergeMap((action: DiffType<Types.Canonical.AutreMandat>) => {
            if (action.Action === Action.Create) {
              console.log('Creating autre mandat link:', action.NewData)
              return client
                .query(
                  createAutreMandatDeputeRelationLink(
                    slug,
                    action.NewData.AutreMandatComplet
                  )
                )
                .then((ret: any) => {
                  console.log('Created autre mandat link:', ret)
                })
            } else if (action.Action === Action.Remove) {
              console.log('Removing autre mandat link:', action.NewData)
              return client
                .query(
                  removeAutreMandatDeputeRelationLink(
                    slug,
                    action.NewData.AutreMandatComplet
                  )
                )
                .then((ret: any) => {
                  console.log('Removed autre mandat link:', ret.data)
                })
            } else {
              // Nothing to do
              console.log('nothing to do at all.')
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
