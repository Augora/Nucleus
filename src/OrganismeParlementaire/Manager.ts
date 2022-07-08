import { from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { GetOrganismesParlementairesFromNosDeputesFR } from './WrapperNosDeputesFR'
import { MapOrganismeParlementaire } from './Mapping'
import { CompareLists, Action, DiffType } from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  GetOrganismesFromSupabase,
  CreateOrganismeToSupabase,
  UpdateOrganismeToSupabase,
} from './WrapperSupabase'
import { SendNewOrganismeParlementaireNotification } from '../Common/SlackWrapper'

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
    (a, b) =>
      a.Nom === b.Nom && a.Type === b.Type && a.EstPermanent === b.EstPermanent,
    'Slug',
    true
  )
  GetLogger().info('Comparison:', res)
  return from(res)
    .pipe(
      mergeMap((action: DiffType<Types.Canonical.OrganismeParlementaire>) => {
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
            })
            // return SendNewGroupeParlementaireNotification(action.NewData)
          })
        } else {
          GetLogger().info('Nothing to do on OrganismeParlementaire:', {
            Nom: action.NewData.Nom,
          })
          return Promise.resolve()
        }
      }, 1)
    )
    .toPromise()
}
