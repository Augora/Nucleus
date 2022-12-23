import { throttleAll } from 'promise-throttle-all'

import {
  CompareLists,
  Action,
  DiffType,
  CompareGenericObjects,
} from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  SendNewDeputeNotification,
  SendDeputeChangeGroupNotification,
  SendStopDeputeMandatNotification,
} from '../Common/SlackWrapper'

import { MapDepute } from './Mapping'
import {
  GetDeputesFromNosDeputesFR,
  GetDeputesBySlugFromNosDeputesFR,
} from './WrapperNosDeputesFR'
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
  GetLogger().info('Processing diffs...')
  const res = CompareLists(
    canonicalDeputesFromNosDeputesFR,
    deputesFromSupabase,
    CompareGenericObjects,
    'Slug',
    true
  )
  GetLogger().info('Processed diffs:', { diffCount: res.length })

  return throttleAll(
    1,
    res.map((action: DiffType<Depute>) => () => {
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
        GetLogger().info('Updating Depute:', {
          Slug: action.NewData.Slug,
          diffs: action.Diffs,
        })
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
              GetLogger().info('Notification sent for Depute changing group:', {
                Slug: action.NewData.Slug,
              })
            })
          }
          if (
            action.PreviousData.EstEnMandat === true &&
            action.NewData.EstEnMandat === false
          ) {
            return SendStopDeputeMandatNotification(action.NewData).then(() => {
              GetLogger().info(
                'Notification sent for Depute stopping his mandate:',
                {
                  Slug: action.NewData.Slug,
                }
              )
            })
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
    })
  )
}
