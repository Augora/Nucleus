import { from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import {
  GetGroupesFromFaunaDB,
  CreateGroupeParlementaire,
} from './WrapperFaunaDB'
import { GetDeputesFromNosDeputesFR } from './WrapperNosDeputesFR'
import { MapGroupeParlementaire } from './Mapping'

import { CompareLists, Action, DiffType } from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import { SendNewGroupeParlementaireNotification } from '../Common/SlackWrapper'

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
    (a, b) => a.Sigle === b.Sigle,
    'Sigle'
  )
  GetLogger().info('Comparison', res)
  return from(res)
    .pipe(
      mergeMap((action: DiffType<Types.Canonical.GroupeParlementaire>) => {
        GetLogger().info('Processing', { Sigle: action.Data.Sigle })
        if (action.Action === Action.Create) {
          GetLogger().info('Creating Groupe', { Sigle: action.Data.Sigle })
          return CreateGroupeParlementaire(action.Data).then((ret) =>
            SendNewGroupeParlementaireNotification(ret.data)
          )
        } else {
          return Promise.resolve()
        }
      }, 1)
    )
    .toPromise()
}
