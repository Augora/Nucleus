import { from, lastValueFrom } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { GetDeputesInOrganisme } from './WrapperNosDeputesFR'
import { MapDeputeOrganismeParlementaire } from './Mapping'
import { CompareLists, Action, DiffType } from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  CreateDeputeOrganismeParlementaireToSupabase,
  GetOrganismesFromSupabase,
  GetDeputeOrganismeParlementaireFromSupabase,
  UpdateDeputeOrganismeParlementaireToSupabase,
  DeleteDeputeOrganismeParlementaireToSupabase,
} from './WrapperSupabase'
import { Database } from '../../Types/database.types'

type Depute_OrganismeParlementaire =
  Database['public']['Tables']['Depute_OrganismeParlementaire']['Insert']

export async function ManageDeputeOrganismeParlementaire() {
  const organismesFromSupabase = await GetOrganismesFromSupabase()
  const deputesInOrganisme = await Promise.all(
    organismesFromSupabase.map((o) =>
      GetDeputesInOrganisme(o.Slug).then((ds) => ({
        organismeSlug: o.Slug,
        deputes: ds,
      }))
    )
  )
  const deputeOrganismeParlementaireFromSupabase =
    await GetDeputeOrganismeParlementaireFromSupabase()

  const deputeOrganismesCanonical: Depute_OrganismeParlementaire[] =
    deputesInOrganisme
      .flatMap((org) =>
        org.deputes.map((d) => {
          return MapDeputeOrganismeParlementaire(
            org.organismeSlug,
            d.slug,
            d.function
          )
        })
      )
      .filter((d) => d.DeputeSlug !== undefined)

  const res = CompareLists(
    deputeOrganismesCanonical,
    deputeOrganismeParlementaireFromSupabase,
    (a, b) =>
      a.Id === b.Id &&
      a.DeputeSlug === b.DeputeSlug &&
      a.OrganismeSlug === b.OrganismeSlug &&
      a.Fonction === b.Fonction,
    'Id',
    true
  )

  return lastValueFrom(
    from(res).pipe(
      mergeMap((action: DiffType<Depute_OrganismeParlementaire>) => {
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
          GetLogger().info(
            'Updating DeputeOrganismeParlementaire:',
            action.NewData
          )
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
      }, 1)
    )
  )
}
