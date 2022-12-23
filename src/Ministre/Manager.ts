import { from, lastValueFrom } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { GetMinistresFromGouvernementFR } from './WrapperGouvernementFR'
import {
  CompareLists,
  Action,
  DiffType,
  CompareGenericObjects,
} from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  GetMinistresFromSupabase,
  CreateMinistreToSupabase,
  UpdateMinistreToSupabase,
} from './WrapperSupabase'
import { Database } from '../../Types/database.types'

type Ministre = Database['public']['Tables']['Ministre']['Insert']

export async function ManageMinistres() {
  const ministresFromGouvernementFR = await GetMinistresFromGouvernementFR()
  GetLogger().info('ministresFromGouvernementFR:', ministresFromGouvernementFR)

  const ministresFromSupabase = await GetMinistresFromSupabase()
  GetLogger().info('ministresFromSupabase:', ministresFromSupabase)
  const res = CompareLists(
    ministresFromGouvernementFR,
    ministresFromSupabase,
    CompareGenericObjects,
    'Slug',
    true
  )
  GetLogger().info('Comparison:', res)
  return lastValueFrom(
    from(res).pipe(
      mergeMap((action: DiffType<Ministre>) => {
        GetLogger().info('Processing Ministre:', {
          Nom: action.NewData.Nom,
        })
        if (action.Action === Action.Create) {
          GetLogger().info('Creating Ministre:', { Nom: action.NewData.Nom })
          return CreateMinistreToSupabase(action.NewData).then(() => {
            GetLogger().info('Created Ministre:', {
              Nom: action.NewData.Nom,
            })
          })
        } else if (action.Action === Action.Update) {
          GetLogger().info('Updating Ministre:', {
            Nom: action.NewData.Nom,
            diffs: action.Diffs,
          })
          return UpdateMinistreToSupabase(action.NewData).then(() => {
            GetLogger().info('Updated Ministre', {
              Nom: action.NewData.Nom,
            })
          })
        } else {
          GetLogger().info('Nothing to do on Ministre:', {
            Nom: action.NewData.Nom,
          })
          return Promise.resolve()
        }
      }, 1)
    )
  )
}
