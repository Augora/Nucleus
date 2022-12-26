import { throttleAll } from 'promise-throttle-all'

import { GetDeputesFromNosDeputesFR } from './WrapperNosDeputesFR'
import { MapGroupeParlementaire } from './Mapping'
import {
  CompareLists,
  Action,
  DiffType,
  CompareGenericObjects,
} from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  SendNewGroupeParlementaireNotification,
  SendUpdateGroupeParlementaireNotification,
} from '../Common/SlackWrapper'
import {
  GetGroupesFromSupabase,
  CreateGroupeParlementaireToSupabase,
  UpdateGroupeParlementaireToSupabase,
} from './WrapperSupabase'
import { GetGroupeParlementaireExplainText } from './WrapperWikipedia'
import { Database } from '../../Types/database.types'
import { async } from 'rxjs'

type GroupeParlementaire =
  Database['public']['Tables']['GroupeParlementaire']['Row']

function delayedResolve<T>(ms, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function ManageGroupes() {
  const groupesFromSupabase: GroupeParlementaire[] =
    await GetGroupesFromSupabase()
  GetLogger().info('groupesFromSupabase:', groupesFromSupabase)
  const groupesFromNosDeputesFR = await GetDeputesFromNosDeputesFR()
  GetLogger().info('groupesFromNosDeputesFR:', groupesFromNosDeputesFR)
  const canonicalGroupesFromNosDeputesFR = groupesFromNosDeputesFR.map((gp) =>
    MapGroupeParlementaire(
      gp,
      groupesFromSupabase.find((g) => g.Sigle === gp.acronyme)
    )
  )
  GetLogger().info(
    'canonicalGroupesFromNosDeputesFR:',
    canonicalGroupesFromNosDeputesFR
  )

  const groupeDescriptions = await throttleAll(
    1,
    groupesFromSupabase.map((gp: GroupeParlementaire) => async () => {
      if (gp.IDWikipedia === null) {
        return { title: gp.Sigle, desc: '' }
      }

      return {
        title: gp.Sigle,
        desc: await GetGroupeParlementaireExplainText(
          encodeURI(gp.IDWikipedia)
        ),
      }
    })
  )

  GetLogger().info('groupeDescriptions:', groupeDescriptions)
  const canonicalGroupesFromNosDeputesFRWithDesc =
    canonicalGroupesFromNosDeputesFR.map((gp, i) =>
      Object.assign({}, gp, {
        DescriptionWikipedia: groupeDescriptions.find(
          (gpd) => gpd.title === gp.Sigle
        ).desc,
      })
    )
  GetLogger().info(
    'canonicalGroupesFromNosDeputesFRWithDesc:',
    canonicalGroupesFromNosDeputesFRWithDesc
  )
  const res = CompareLists(
    canonicalGroupesFromNosDeputesFRWithDesc,
    groupesFromSupabase,
    CompareGenericObjects,
    'Sigle'
  )
  GetLogger().info('Comparison:', res)
  return throttleAll(
    1,
    res.map((action: DiffType<GroupeParlementaire>) => () => {
      GetLogger().info('Processing GroupeParlementaire:', {
        Sigle: action.NewData.Sigle,
      })
      if (action.Action === Action.Create) {
        GetLogger().info('Creating Groupe:', { Sigle: action.NewData.Sigle })
        return CreateGroupeParlementaireToSupabase(action.NewData).then(
          (data) => {
            GetLogger().info('Created Groupe:', {
              Sigle: action.NewData.Sigle,
            })
            return SendNewGroupeParlementaireNotification(action.NewData)
          }
        )
      } else if (action.Action === Action.Update) {
        GetLogger().info('Updating GroupeParlementaire:', {
          Sigle: action.NewData.Sigle,
          diffs: action.Diffs,
        })
        return UpdateGroupeParlementaireToSupabase(action.NewData).then(() => {
          GetLogger().info('Updated GroupeParlementaire', {
            Sigle: action.NewData.Sigle,
          })
          return SendNewGroupeParlementaireNotification(action.NewData)
        })
      } else {
        GetLogger().info('Nothing to do on GroupeParlementaire:', {
          Sigle: action.NewData.Sigle,
        })
        return Promise.resolve()
      }
    })
  )
}
