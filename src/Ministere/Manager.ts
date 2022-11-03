import { from, lastValueFrom } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { GetMinisteresFromGouvernementFR } from './WrapperGouvernementFR'
import { CompareLists, Action, DiffType } from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  GetMinisteresFromSupabase,
  CreateMinistereToSupabase,
  UpdateMinistereToSupabase,
} from './WrapperSupabase'
import { Database } from '../../Types/database.types'

type Ministere = Database['public']['Tables']['Ministere']['Insert']

export async function ManageMinisteres() {
  const ministeresFromGouvernementFR = await GetMinisteresFromGouvernementFR()
  GetLogger().info(
    'ministeresFromGouvernementFR:',
    ministeresFromGouvernementFR
  )

  const ministeresFromSupabase = await GetMinisteresFromSupabase()
  GetLogger().info('ministeresFromSupabase:', ministeresFromSupabase)
  const res = CompareLists(
    ministeresFromGouvernementFR,
    ministeresFromSupabase,
    (a, b) => a.Nom === b.Nom && a.Slug === b.Slug,
    'Slug',
    true
  )
  GetLogger().info('Comparison:', res)
  return lastValueFrom(
    from(res).pipe(
      mergeMap((action: DiffType<Ministere>) => {
        GetLogger().info('Processing Ministere:', {
          Nom: action.NewData.Nom,
        })
        if (action.Action === Action.Create) {
          GetLogger().info('Creating Ministere:', { Nom: action.NewData.Nom })
          return CreateMinistereToSupabase(action.NewData).then(() => {
            GetLogger().info('Created Ministere:', {
              Nom: action.NewData.Nom,
            })
          })
        } else if (action.Action === Action.Update) {
          GetLogger().info('Updating Ministere:', {
            Nom: action.NewData.Nom,
          })
          return UpdateMinistereToSupabase(action.NewData).then(() => {
            GetLogger().info('Updated Ministere', {
              Nom: action.NewData.Nom,
            })
          })
        } else {
          GetLogger().info('Nothing to do on Ministere:', {
            Nom: action.NewData.Nom,
          })
          return Promise.resolve()
        }
      }, 1)
    )
  )
}
