import { from, lastValueFrom } from 'rxjs'
import { mergeMap, retry } from 'rxjs/operators'

import { MapDepute } from './Mapping'
import { AreTheSameDeputes } from './Comparison'
import { CompareLists, Action, DiffType } from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  GetDeputesFromNosDeputesFR,
  GetDeputesBySlugFromNosDeputesFR,
} from './WrapperNosDeputesFR'
import {
  SendNewDeputeNotification,
  SendDeputeChangeGroupNotification,
  SendStopDeputeMandatNotification,
} from '../Common/SlackWrapper'
import {
  GetDeputesFromSupabase,
  CreateDeputeToSupabase,
  UpdateDeputeToSupabase,
  DeleteDeputeToSupabase,
} from './WrapperSupabase'
import { Database } from '../../Types/database.types'

type Depute = Database['public']['Tables']['Depute']['Insert']

export async function ManageDeputes() {
  const simpleDeputesFromNosDeputesFR = await GetDeputesFromNosDeputesFR()
  const slugs = simpleDeputesFromNosDeputesFR.map((d) => d.slug)
  const deputesFromNosDeputesFR = await GetDeputesBySlugFromNosDeputesFR(slugs)
  const canonicalDeputesFromNosDeputesFR = deputesFromNosDeputesFR.map((d) =>
    MapDepute(d)
  )
  const deputesFromSupabase = await GetDeputesFromSupabase()
  const res = CompareLists(
    canonicalDeputesFromNosDeputesFR,
    deputesFromSupabase,
    AreTheSameDeputes,
    'Slug',
    true
  )
  return lastValueFrom(
    from(res).pipe(
      mergeMap((action: DiffType<Depute>) => {
        GetLogger().info('Processing Depute:', { Slug: action.NewData.Slug })
        if (action.Action === Action.Create) {
          GetLogger().info('Creating Depute:', action.NewData)
          return CreateDeputeToSupabase(action.NewData).then(() => {
            GetLogger().info('Created Depute:', { Slug: action.NewData.Slug })
            return SendNewDeputeNotification(action.NewData).then(() => {
              GetLogger().info('Notification sent for Depute creation:', {
                Slug: action.NewData.Slug,
              })
            })
          })
        } else if (action.Action === Action.Update) {
          GetLogger().info('Updating Depute:', { Slug: action.NewData.Slug })
          return UpdateDeputeToSupabase(action.NewData).then(() => {
            GetLogger().info('Updated Depute:', { Slug: action.NewData.Slug })
            if (
              action.PreviousData.GroupeParlementaire !==
              action.NewData.GroupeParlementaire
            ) {
              return SendDeputeChangeGroupNotification(
                action.PreviousData,
                action.NewData
              ).then(() => {
                GetLogger().info(
                  'Notification sent for Depute changing group:',
                  {
                    Slug: action.NewData.Slug,
                  }
                )
              })
            }
            if (
              action.PreviousData.EstEnMandat === true &&
              action.NewData.EstEnMandat === false
            ) {
              return SendStopDeputeMandatNotification(action.NewData).then(
                () => {
                  GetLogger().info(
                    'Notification sent for Depute stopping his mandate:',
                    {
                      Slug: action.NewData.Slug,
                    }
                  )
                }
              )
            }
          })
        } else if (action.Action === Action.Remove) {
          GetLogger().info('Deleting depute:', { Slug: action.NewData.Slug })
          return DeleteDeputeToSupabase(action.NewData).then(() => {
            GetLogger().info('Deleted Depute:', { Slug: action.NewData.Slug })
          })
        } else if (action.Action === Action.None) {
          GetLogger().info('Nothing to do on Depute:', {
            Slug: action.NewData.Slug,
          })
          return Promise.resolve()
        }
      }, 1),
      retry(2)
    )
  )
}
