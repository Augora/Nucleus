import { from } from 'rxjs'
import { mergeMap, retry } from 'rxjs/operators'

import { MapActivites } from './Mapping'
import { AreTheSameActivites } from './Comparison'
import { CompareLists, Action, DiffType } from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import { GetActiviesBySlugFromNosDeputesFR } from './WrapperNosDeputesFR'
import { GetDeputesFromSupabase } from '../Depute/WrapperSupabase'
import {
  GetActivitesBySlugFromSupabase,
  CreateActiviteToSupabase,
  UpdateActiviteToSupabase,
  DeleteActiviteToSupabase,
} from './WrapperSupabase'

export async function ManageActivites() {
  const detputesFromSupabase = await GetDeputesFromSupabase()
  const slugs = detputesFromSupabase.map((d) => d.Slug)
  return from(slugs)
    .pipe(
      mergeMap(async (slug: string) => {
        const activitesFromNosDeputesFR =
          await GetActiviesBySlugFromNosDeputesFR(slug)
        const canonicalActivitesFromNosDeputesFR = MapActivites(
          slug,
          activitesFromNosDeputesFR
        )
        const activiteFromSupabase = await GetActivitesBySlugFromSupabase(slug)
        const res = CompareLists(
          canonicalActivitesFromNosDeputesFR,
          activiteFromSupabase,
          AreTheSameActivites,
          'NumeroDeSemaine'
        )
        return from(res)
          .pipe(
            mergeMap((action: DiffType<Types.Canonical.Activite>) => {
              if (action.Action === Action.Create) {
                GetLogger().info('Creating activite:', action.NewData)
                return CreateActiviteToSupabase(action.NewData)
              } else if (action.Action === Action.Update) {
                GetLogger().info('Updating activite:', {
                  from: action.PreviousData,
                  to: action.NewData,
                })
                return UpdateActiviteToSupabase(action.NewData)
              } else if (action.Action === Action.Remove) {
                GetLogger().info('Updating activite:', action.PreviousData)
                return DeleteActiviteToSupabase(action.PreviousData)
              }
            }, 20),
            retry(2)
          )
          .toPromise()
      }, 1),
      retry(2)
    )
    .toPromise()
}
