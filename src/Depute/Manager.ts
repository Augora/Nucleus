import { throttleAll } from 'promise-throttle-all'

import {
  CompareLists,
  Action,
  DiffType,
  CompareGenericObjects,
} from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'

import {
  GetDeputesFromSupabase,
  CreateDeputeToSupabase,
  UpdateDeputeToSupabase,
} from './WrapperSupabase'

import { Database } from '../../Types/database.types'
import { GetDeputesFromGouvernementFR } from './WrapperGouvernementFR'
import { SendDeputeChangeGroupNotification, SendNewDeputeNotification, SendStopDeputeMandatNotification } from '../Common/DiscordWrapper'

type Depute = Database['public']['Tables']['Depute']['Insert']

export async function ManageDeputes() {
  const simpleDeputesFromGouvernementFR = await GetDeputesFromGouvernementFR()

  const deputesFromSupabase = await GetDeputesFromSupabase()
  GetLogger().info('Processing diffs...')
  const res = CompareLists(
    simpleDeputesFromGouvernementFR,
    deputesFromSupabase,
    CompareGenericObjects,
    'Slug'
  )
  GetLogger().info('Processed diffs:', { diffCount: res.length, diffs: res })

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
      } else if (action.Action === Action.None) {
        GetLogger().info('Nothing to do on Depute:', {
          Slug: action.NewData.Slug,
        })
        return Promise.resolve()
      }
    })
  )
}