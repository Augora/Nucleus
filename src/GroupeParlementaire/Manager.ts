import { from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import {
  GetGroupesFromFaunaDB,
  CreateGroupeParlementaire,
  UpdateGroupeParlementaire,
} from './WrapperFaunaDB'
import { GetDeputesFromNosDeputesFR } from './WrapperNosDeputesFR'
import { MapGroupeParlementaire } from './Mapping'

import { CompareLists, Action, DiffType } from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  SendNewGroupeParlementaireNotification,
  SendUpdateGroupeParlementaireNotification,
} from '../Common/SlackWrapper'

export async function ManageGroupes() {
  const groupesFromNosDeputesFR = await GetDeputesFromNosDeputesFR()
  GetLogger().info('groupesFromNosDeputesFR', groupesFromNosDeputesFR)
  const canonicalGroupesFromNosDeputesFR = groupesFromNosDeputesFR.map((gp) =>
    MapGroupeParlementaire(gp)
  )
  GetLogger().info(
    'canonicalGroupesFromNosDeputesFR',
    canonicalGroupesFromNosDeputesFR
  )
  const groupesFromFaunaDB = await GetGroupesFromFaunaDB().then((ret) =>
    ret.data.map((e) => e.data)
  )
  GetLogger().info('groupesFromFaunaDB', groupesFromFaunaDB)
  const res = CompareLists(
    canonicalGroupesFromNosDeputesFR,
    groupesFromFaunaDB,
    (a, b) => a.Sigle === b.Sigle && a.Actif === b.Actif,
    'Sigle'
  )
  GetLogger().info('Comparison', res)
  return from(res)
    .pipe(
      mergeMap((action: DiffType<Types.Canonical.GroupeParlementaire>) => {
        GetLogger().info('Processing', { Sigle: action.NewData.Sigle })
        if (action.Action === Action.Create) {
          GetLogger().info('Creating Groupe', { Sigle: action.NewData.Sigle })
          return CreateGroupeParlementaire(action.NewData).then((ret) =>
            SendNewGroupeParlementaireNotification(ret.data)
          )
        } else if (action.Action === Action.Update) {
          GetLogger().info('Updating Groupe', { Sigle: action.NewData.Sigle })
          return UpdateGroupeParlementaire(action.NewData).then((ret) => {
            return Promise.all(
              ret.data.map((gp) =>
                SendUpdateGroupeParlementaireNotification(gp.data)
              )
            )
          })
        } else {
          return Promise.resolve()
        }
      }, 1)
    )
    .toPromise()
}
