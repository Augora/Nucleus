import { throttleAll } from 'promise-throttle-all'

import { GetOrganismesParlementairesFromNosDeputesFR } from './WrapperNosDeputesFR'
import { MapOrganismeParlementaire } from './Mapping'
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

type OrganismeParlementaire =
  Database['public']['Tables']['OrganismeParlementaire']['Insert']

export async function ManageOrganismes() {
  const organismesFromNosDeputesFR =
    await GetOrganismesParlementairesFromNosDeputesFR()
  GetLogger().info('organismesFromNosDeputesFR:', organismesFromNosDeputesFR)
  const canonicalOrganismesFromNosDeputesFR = organismesFromNosDeputesFR.map(
    (op) => MapOrganismeParlementaire(op)
  )
  GetLogger().info(
    'canonicalOrganismesFromNosDeputesFR:',
    canonicalOrganismesFromNosDeputesFR
  )
  const organismesFromSupabase = await GetOrganismesFromSupabase()
  GetLogger().info('organismesFromSupabase:', organismesFromSupabase)
  const res = CompareLists(
    canonicalOrganismesFromNosDeputesFR,
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
          // return SendNewOrganismeParlementaireNotification(action.NewData)
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
          // return SendNewGroupeParlementaireNotification(action.NewData)
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
