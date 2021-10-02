import { from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { GetOrganismesParlementairesFromNosDeputesFR } from './WrapperNosDeputesFR'
import { MapOrganismeParlementaire } from './Mapping'
import { CompareLists, Action, DiffType } from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  SendNewGroupeParlementaireNotification,
  SendUpdateGroupeParlementaireNotification,
} from '../Common/SlackWrapper'
import {
  GetOrganismesFromFirestore,
  CreateOrganismeParlementaireToFirestore,
  UpdateOrganismeParlementaireToFirestore,
} from './WrapperFirebase'

export async function ManageOrganismes() {
  const organismesFromNosDeputesFR = await GetOrganismesParlementairesFromNosDeputesFR()
  GetLogger().info('organismesFromNosDeputesFR:', organismesFromNosDeputesFR)
  const canonicalOrganismesFromNosDeputesFR = organismesFromNosDeputesFR.map((op) =>
    MapOrganismeParlementaire(op)
  )
  GetLogger().info(
    'canonicalOrganismesFromNosDeputesFR:',
    canonicalOrganismesFromNosDeputesFR
  )
  const organismesFromFirestore = await GetOrganismesFromFirestore()
  GetLogger().info('organismesFromFaunaDB:', organismesFromFirestore)
  const res = CompareLists(
    canonicalOrganismesFromNosDeputesFR,
    organismesFromFirestore,
    (a, b) => a.Nom === b.Nom && a.Nom === b.Nom,
    'Sigle',
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
          return CreateOrganismeParlementaireToFirestore(action.NewData).then(
            () => {
              GetLogger().info('Created Organisme:', {
                Nom: action.NewData.Nom,
              })
              // return SendNewGroupeParlementaireNotification(action.NewData)
            }
          )
        } else if (action.Action === Action.Update) {
          GetLogger().info('Updating OrganismeParlementaire:', {
            Nom: action.NewData.Nom,
          })
          return UpdateOrganismeParlementaireToFirestore(action.NewData).then(
            () => {
              GetLogger().info('Updated OrganismeParlementaire', {
                Nom: action.NewData.Nom,
              })
              // return SendNewGroupeParlementaireNotification(action.NewData)
            }
          )
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
