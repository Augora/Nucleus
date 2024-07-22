import { throttleAll } from 'promise-throttle-all'

import {
  CompareLists,
  Action,
  DiffType,
  CompareGenericObjects,
} from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  GetOrganismesFromSupabase,
  CreateOrganismeToSupabase,
  UpdateOrganismeToSupabase,
} from './WrapperSupabase'
import { Database } from '../../Types/database.types'
import { GetCommissionsListFromGouvernementFR } from './WrapperGouvernementFR'

type OrganismeParlementaire =
  Database['public']['Tables']['OrganismeParlementaire']['Insert']

export async function ManageOrganismes() {
  const organismesFromGouvernementFR =
    await GetCommissionsListFromGouvernementFR()

  GetLogger().info(
    'GetCommissionsListFromGouvernementFR:',
    organismesFromGouvernementFR
  )
  const organismesFromSupabase = await GetOrganismesFromSupabase()

  GetLogger().info('organismesFromSupabase:', organismesFromSupabase)
  const res = CompareLists(
    organismesFromGouvernementFR,
    organismesFromSupabase,
    CompareGenericObjects,
    'Slug'
  )
  GetLogger().info('Comparison:', res)
  return throttleAll(
    1,
    res.map((action: DiffType<OrganismeParlementaire>) => () => {
      GetLogger().info('Processing OrganismeParlementaire:', {
        Nom: action.NewData.Nom,
      })
      if (action.Action === Action.Create) {
        GetLogger().info('Creating Organisme:', { Nom: action.NewData.Nom })
        return CreateOrganismeToSupabase(action.NewData).then(() => {
          GetLogger().info('Created Organisme:', {
            Nom: action.NewData.Nom,
          })
        })
      } else if (action.Action === Action.Update) {
        GetLogger().info('Updating OrganismeParlementaire:', {
          Nom: action.NewData.Nom,
        })
        return UpdateOrganismeToSupabase(action.NewData).then(() => {
          GetLogger().info('Updated OrganismeParlementaire', {
            Nom: action.NewData.Nom,
            diffs: action.Diffs,
          })
        })
      } else {
        GetLogger().info('Nothing to do on OrganismeParlementaire:', {
          Nom: action.NewData.Nom,
        })
        return Promise.resolve()
      }
    })
  )
}
