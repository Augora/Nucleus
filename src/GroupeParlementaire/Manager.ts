import { throttleAll } from 'promise-throttle-all'

import { GetGroupesParlementairesFromGouvernementFR } from './WrapperGouvernementFR'
import {
  SendNewGroupeParlementaireNotification,
  SendUpdateGroupeParlementaireNotification,
} from '../Common/DiscordWrapper'
import {
  CompareLists,
  Action,
  DiffType,
  CompareGenericObjects,
} from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  GetGroupesFromSupabase,
  CreateGroupeParlementaireToSupabase,
  UpdateGroupeParlementaireToSupabase,
  SetGroupeParlementaireInactifToSupabase,
} from './WrapperSupabase'
import { GetGroupeParlementaireExplainText } from './WrapperWikipedia'
import { Database } from '../../Types/database.types'

type GroupeParlementaire =
  Database['public']['Tables']['GroupeParlementaire']['Row']

export async function ManageGroupes() {
  const groupesFromGouvernementFR = await GetGroupesParlementairesFromGouvernementFR()
  GetLogger().info('groupesFromGouvernementFR:', groupesFromGouvernementFR)

  const groupesFromSupabase = await GetGroupesFromSupabase()
  GetLogger().info('groupesFromSupabase:', groupesFromSupabase)

  const groupeDescriptions = await throttleAll(
    1,
    groupesFromSupabase.map((gp: GroupeParlementaire) => async () => {
      if (gp.IDWikipedia === null) {
        return { title: gp.Slug, desc: '' }
      }

      return {
        title: gp.Slug,
        desc: await GetGroupeParlementaireExplainText(gp.IDWikipedia),
      }
    })
  )

  GetLogger().info('groupeDescriptions:', groupeDescriptions)
  const canonicalgroupesFromGouvernementFRWithDesc =
    groupesFromGouvernementFR.map((gp) =>
      Object.assign({}, gp, {
        DescriptionWikipedia: groupeDescriptions.find(
          (gpd) => gpd.title === gp.Slug
        )?.desc,
      })
    )
  GetLogger().info(
    'canonicalgroupesFromGouvernementFRWithDesc:',
    canonicalgroupesFromGouvernementFRWithDesc
  )
  const res = CompareLists(
    canonicalgroupesFromGouvernementFRWithDesc,
    groupesFromSupabase,
    CompareGenericObjects,
    'Slug'
  )
  GetLogger().info('Comparison:', res)
  return throttleAll(
    1,
    res.map((action: DiffType<GroupeParlementaire>) => () => {
      GetLogger().info('Processing GroupeParlementaire:', {
        Slug: action.NewData.Slug,
      })
      if (action.Action === Action.Create) {
        GetLogger().info('Creating Groupe:', { Slug: action.NewData.Slug })
        return CreateGroupeParlementaireToSupabase(action.NewData).then(
          () => {
            GetLogger().info('Created Groupe:', {
              Slug: action.NewData.Slug,
            })
            return SendNewGroupeParlementaireNotification(action.NewData)
          }
        )
      } else if (action.Action === Action.Update) {
        GetLogger().info('Updating GroupeParlementaire:', {
          Slug: action.NewData.Slug,
          diffs: action.Diffs,
        })
        return UpdateGroupeParlementaireToSupabase(action.NewData).then(() => {
          GetLogger().info('Updated GroupeParlementaire', {
            Slug: action.NewData.Slug,
          })
          return SendUpdateGroupeParlementaireNotification(action.NewData)
        })
      } else if (action.Action === Action.Remove) {
        GetLogger().info('Updating GroupeParlementaire:', { Slug: action.PreviousData.Slug })
        return SetGroupeParlementaireInactifToSupabase(action.PreviousData).then(() => {
          GetLogger().info('Setting GroupeParlementaire to inactif:', { Slug: action.PreviousData.Slug })
        })
      } else {
        GetLogger().info('Nothing to do on GroupeParlementaire:', {
          Slug: action.NewData.Slug,
        })
        return Promise.resolve()
      }
    })
  )
}
