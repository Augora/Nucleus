import { throttleAll } from 'promise-throttle-all'

import { MapActivites } from './Mapping'
import {
  CompareLists,
  Action,
  DiffType,
  CompareGenericObjects,
} from '../Tools/Comparison'
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
  return throttleAll(
    1,
    detputesFromSupabase.map((depute: Depute) => async () => {
      const activitesFromNosDeputesFR = await GetActiviesBySlugFromNosDeputesFR(
        depute.Slug
      )
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
        CompareGenericObjects,
        'NumeroDeSemaine'
      )
      return throttleAll(
        1,
        res.map((action: DiffType<Activite>) => async () => {
          if (action.Action === Action.Create) {
            GetLogger().info('Creating activite:', action.NewData)
            return CreateActiviteToSupabase(action.NewData)
          } else if (action.Action === Action.Update) {
            GetLogger().info('Updating activite:', {
              Id: action.NewData.Id,
              diffs: action.Diffs,
            })
            return UpdateActiviteToSupabase(action.NewData)
          } else if (action.Action === Action.Remove) {
            GetLogger().info('Updating activite:', action.PreviousData)
            return DeleteActiviteToSupabase(action.PreviousData)
          }
        })
      )
    })
  )
}
