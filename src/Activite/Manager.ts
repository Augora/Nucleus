import { from, lastValueFrom } from 'rxjs'
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
import { Database } from '../../Types/database.types'

type Depute = Database['public']['Tables']['Depute']['Insert']
type Activite = Database['public']['Tables']['Activite']['Insert']

export async function ManageActivites() {
  const detputesFromSupabase = await GetDeputesFromSupabase()
  return lastValueFrom(
    from(detputesFromSupabase).pipe(
      mergeMap(async (depute: Depute) => {
        const activitesFromNosDeputesFR =
          await GetActiviesBySlugFromNosDeputesFR(depute.Slug)
        const canonicalActivitesFromNosDeputesFR = MapActivites(
          depute,
          activitesFromNosDeputesFR
        )
        const activiteFromSupabase = await GetActivitesBySlugFromSupabase(
          depute.Slug
        )
        const res = CompareLists(
          canonicalActivitesFromNosDeputesFR,
          activiteFromSupabase,
          AreTheSameActivites,
          'NumeroDeSemaine'
        )
        return lastValueFrom(
          from(res).pipe(
            mergeMap((action: DiffType<Activite>) => {
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
        )
      }, 1),
      retry(2)
    )
  )
}
