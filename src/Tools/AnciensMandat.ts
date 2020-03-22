import faunadb, { values } from 'faunadb'
import { from, concat } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import {
  getAncienMandatByAncienMandatComplet,
  updateAncienMandat,
  createAncienMandat,
  getAnciensMandatByDeputeSlug,
  createAncienMandatDeputeRelationLink,
  removeAncienMandatDeputeRelationLink,
} from './Refs'
import { MapAncienMandat, areTheSameAnciensMandats } from '../Mappings/Depute'
import { CompareLists, Action, DiffType } from '../Tools/Comparison'

export function manageAnciensMandats(
  slug: string,
  client: faunadb.Client,
  anciensMandats: string[]
) {
  const LDAms = anciensMandats.map(am => MapAncienMandat(am))
  return concat(
    from(LDAms).pipe(
      mergeMap((ancienMandat: Types.Canonical.AncienMandat) => {
        console.log('start', ancienMandat)
        return client
          .query(
            getAncienMandatByAncienMandatComplet(
              ancienMandat.AncienMandatComplet
            )
          )
          .then(
            (ret: values.Document<Types.Canonical.AncienMandat>) => ret.data
          )
          .then(ancienMandatFromFauna => {
            if (
              !areTheSameAnciensMandats(ancienMandat, ancienMandatFromFauna)
            ) {
              console.log(
                'Updating ancien mandat:',
                ancienMandatFromFauna,
                'to',
                ancienMandat
              )
              return client
                .query(updateAncienMandat(ancienMandat))
                .then((ret: any) => {
                  console.log('Updated ancien mandat:', ret)
                })
            } else {
              console.log('nothing to do', ancienMandat)
              return Promise.resolve()
            }
          })
          .catch(e => {
            console.error(e)
            console.log('Creating ancien mandat:', ancienMandat)
            return client
              .query(createAncienMandat(ancienMandat))
              .then((ret: any) => {
                console.log('Created ancien mandat:', ret)
              })
          })
      }, 1)
    ),
    from(
      client
        .query(getAnciensMandatByDeputeSlug(slug))
        .then(
          (
            ret: values.Document<
              values.Document<Types.Canonical.AncienMandat>[]
            >
          ) => ret.data.map(e => e.data)
        )
        .then(RDAms => {
          console.log(LDAms, RDAms)
          return CompareLists(
            LDAms,
            RDAms,
            areTheSameAnciensMandats,
            'AncienMandatComplet'
          )
        })
    ).pipe(
      mergeMap((actions: DiffType<Types.Canonical.AncienMandat>[]) => {
        return from(actions).pipe(
          mergeMap((action: DiffType<Types.Canonical.AncienMandat>) => {
            if (action.Action === Action.Create) {
              console.log('Creating ancien mandat link:', action.Data)
              return client
                .query(
                  createAncienMandatDeputeRelationLink(
                    slug,
                    action.Data.AncienMandatComplet
                  )
                )
                .then((ret: any) => {
                  console.log('Created ancien mandat link:', ret)
                })
            } else if (action.Action === Action.Remove) {
              console.log('Removing ancien mandat link:', action.Data)
              return client
                .query(
                  removeAncienMandatDeputeRelationLink(
                    slug,
                    action.Data.AncienMandatComplet
                  )
                )
                .then((ret: any) => {
                  console.log('Removed ancien mandat link:', ret.data)
                })
            } else {
              // Nothing to do
              console.log('nothing to do at all.')
              return Promise.resolve()
            }
          }, 1)
        )
      }, 1)
    )
  ).toPromise()
}
