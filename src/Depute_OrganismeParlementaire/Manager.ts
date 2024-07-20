import { throttleAll } from 'promise-throttle-all'

import { GetDeputesInOrganismeByDeputySlug } from './WrapperGouvernementFR'
import { MapDeputeOrganismeParlementaire } from './Mapping'
import {
  CompareLists,
  Action,
  DiffType,
  CompareGenericObjects,
} from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  CreateDeputeOrganismeParlementaireToSupabase,
  GetDeputeOrganismeParlementaireFromSupabase,
  UpdateDeputeOrganismeParlementaireToSupabase,
  DeleteDeputeOrganismeParlementaireToSupabase,
} from './WrapperSupabase'
import { Database } from '../../Types/database.types'
import { GetDeputesFromSupabase } from '../Depute/WrapperSupabase'
import { GetOrganismesFromSupabaseBySlug } from '../OrganismeParlementaire/WrapperSupabase'
import { SendMissingOrganismeParlementaireNotification } from '../Common/DiscordWrapper'

type Depute_OrganismeParlementaire =
  Database['public']['Tables']['Depute_OrganismeParlementaire']['Insert']

export async function ManageDeputeOrganismeParlementaire() {
  const organismesFromSupabase = await GetOrganismesFromSupabaseBySlug()
  const deputesFromSupabase = await GetDeputesFromSupabase()
  let deputesInOrganisme = []
  let missingOrganismes = []
  for (let i = 0; i < deputesFromSupabase.length; i++) {
    const d = deputesFromSupabase[i]
    const result = await GetDeputesInOrganismeByDeputySlug(d.Slug, d.URLGouvernement, organismesFromSupabase, i + 1, deputesFromSupabase.length, missingOrganismes)
    deputesInOrganisme = deputesInOrganisme.concat(result)
  }
  const deputeOrganismeParlementaireFromSupabase =
    await GetDeputeOrganismeParlementaireFromSupabase()

  const res = CompareLists(
    deputesInOrganisme,
    deputeOrganismeParlementaireFromSupabase,
    CompareGenericObjects,
    'Id'
  )
  GetLogger().info('deputeOrganismeParlementaireFromSupabase:', {
    deputeOrganismeParlementaireFromSupabase,
  })

  GetLogger().info('Processed diffs:', { diffCount: res.length, diffs: res })

  if (missingOrganismes.length != 0) {
    GetLogger().warn('List of all missing organismes.')
    console.log(missingOrganismes)
    SendMissingOrganismeParlementaireNotification()
    GetLogger().info('Notification sent for missing organismes')
  }

  return throttleAll(
    1,
    res.map((action: DiffType<Depute_OrganismeParlementaire>) => () => {
      GetLogger().info('Processing DeputeOrganismeParlementaire:', {
        Id: action.NewData.Id,
        Action: action.Action,
      })
      if (action.Action === Action.Create) {
        GetLogger().info(
          'Creating DeputeOrganismeParlementaire:',
          action.NewData
        )
        return CreateDeputeOrganismeParlementaireToSupabase(
          action.NewData
        ).then(() => {
          GetLogger().info('Created DeputeOrganismeParlementaire:', {
            Id: action.NewData.Id,
          })
        })
      } else if (action.Action === Action.Update) {
        GetLogger().info('Updating DeputeOrganismeParlementaire:', {
          Id: action.NewData.Id,
          diffs: action.Diffs,
        })
        return UpdateDeputeOrganismeParlementaireToSupabase(
          action.NewData
        ).then(() => {
          GetLogger().info('Updated DeputeOrganismeParlementaire:', {
            Id: action.NewData.Id,
          })
        })
      } else if (action.Action === Action.Remove) {
        GetLogger().info(
          'Removing DeputeOrganismeParlementaire:',
          action.NewData
        )
        return DeleteDeputeOrganismeParlementaireToSupabase(
          action.NewData
        ).then(() => {
          GetLogger().info('Removed DeputeOrganismeParlementaire:', {
            Id: action.NewData.Id,
          })
        })
      } else if (action.Action === Action.None) {
        GetLogger().info('Nothing to do on: ', action.NewData)
        return Promise.resolve()
      } else {
        return Promise.resolve()
      }
    })
  )
}
