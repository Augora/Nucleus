import { from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { GetDeputesFromNosDeputesFR } from './WrapperNosDeputesFR'
import { MapGroupeParlementaire } from './Mapping'
import { CompareLists, Action, DiffType } from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  SendNewGroupeParlementaireNotification,
  SendUpdateGroupeParlementaireNotification,
} from '../Common/SlackWrapper'
import {
  GetGroupesFromFirestore,
  CreateGroupeParlementaireToFirestore,
  UpdateGroupeParlementaireToFirestore,
} from './WrapperFirebase'

export async function ManageGroupes() {
  const groupesFromNosDeputesFR = await GetDeputesFromNosDeputesFR()
  GetLogger().info('groupesFromNosDeputesFR:', groupesFromNosDeputesFR)
  const canonicalGroupesFromNosDeputesFR = groupesFromNosDeputesFR.map((gp) =>
    MapGroupeParlementaire(gp)
  )
  GetLogger().info(
    'canonicalGroupesFromNosDeputesFR:',
    canonicalGroupesFromNosDeputesFR
  )
  const groupesFromFirestore = await GetGroupesFromFirestore()
  GetLogger().info('groupesFromFaunaDB:', groupesFromFirestore)
  const res = CompareLists(
    canonicalGroupesFromNosDeputesFR,
    groupesFromFirestore,
    (a, b) => a.Sigle === b.Sigle && a.Actif === b.Actif,
    'Sigle',
    true
  )
  GetLogger().info('Comparison:', res)
  return from(res)
    .pipe(
      mergeMap((action: DiffType<Types.Canonical.GroupeParlementaire>) => {
        GetLogger().info('Processing GroupeParlementaire:', {
          Sigle: action.NewData.Sigle,
        })
        if (action.Action === Action.Create) {
          GetLogger().info('Creating Groupe:', { Sigle: action.NewData.Sigle })
          return CreateGroupeParlementaireToFirestore(action.NewData).then(
            () => {
              GetLogger().info('Created Groupe:', {
                Sigle: action.NewData.Sigle,
              })
              // return SendNewGroupeParlementaireNotification(action.NewData)
            }
          )
        } else if (action.Action === Action.Update) {
          GetLogger().info('Updating GroupeParlementaire:', {
            Sigle: action.NewData.Sigle,
          })
          return UpdateGroupeParlementaireToFirestore(action.NewData).then(
            () => {
              GetLogger().info('Updated GroupeParlementaire', {
                Sigle: action.NewData.Sigle,
              })
              // return SendNewGroupeParlementaireNotification(action.NewData)
            }
          )
        } else {
          GetLogger().info('Nothing to do on GroupeParlementaire:', {
            Sigle: action.NewData.Sigle,
          })
          return Promise.resolve()
        }
      }, 1)
    )
    .toPromise()
}
