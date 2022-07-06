import { from, lastValueFrom } from 'rxjs'
import { delay, mergeMap, toArray, retry } from 'rxjs/operators'

import { GetDeputesFromNosDeputesFR } from './WrapperNosDeputesFR'
import { MapGroupeParlementaire } from './Mapping'
import { CompareLists, Action, DiffType } from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  SendNewGroupeParlementaireNotification,
  SendUpdateGroupeParlementaireNotification,
} from '../Common/SlackWrapper'
import {
  GetGroupesFromSupabase,
  CreateGroupeParlementaireToSupabase,
  UpdateGroupeParlementaireToSupabase,
} from './WrapperSupabase'
import { GetGroupeParlementaireExplainText } from './WrapperWikipedia'

function delayedResolve<T>(ms, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

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
  const groupesFromSupabase: Types.Canonical.GroupeParlementaire[] =
    await GetGroupesFromSupabase()
  GetLogger().info('groupesFromSupabase:', groupesFromSupabase)
  const groupeDescriptions = await lastValueFrom(
    from(groupesFromSupabase).pipe(
      mergeMap(async (gp) => {
        if (gp.IDWikipedia === null) {
          return Promise.resolve({ title: gp.Sigle, desc: '' })
        }

        return delayedResolve(1000, {
          title: gp.Sigle,
          desc: await GetGroupeParlementaireExplainText(
            encodeURI(gp.IDWikipedia)
          ),
        })
      }, 1),
      toArray()
    )
  )
  GetLogger().info('groupeDescriptions:', groupeDescriptions)
  const canonicalGroupesFromNosDeputesFRWithDesc =
    canonicalGroupesFromNosDeputesFR.map((gp, i) =>
      Object.assign({}, gp, {
        DescriptionWikipedia: groupeDescriptions.find(
          (gpd) => gpd.title === gp.Sigle
        ).desc,
      })
    )
  GetLogger().info(
    'canonicalGroupesFromNosDeputesFRWithDesc:',
    canonicalGroupesFromNosDeputesFRWithDesc
  )
  const res = CompareLists(
    canonicalGroupesFromNosDeputesFRWithDesc,
    groupesFromSupabase,
    (a, b) =>
      a.Sigle === b.Sigle &&
      a.Actif === b.Actif &&
      a.DescriptionWikipedia === b.DescriptionWikipedia,
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
          return CreateGroupeParlementaireToSupabase(action.NewData).then(
            (data) => {
              GetLogger().info('Created Groupe:', {
                Sigle: action.NewData.Sigle,
              })
              return SendNewGroupeParlementaireNotification(action.NewData)
            }
          )
        } else if (action.Action === Action.Update) {
          GetLogger().info('Updating GroupeParlementaire:', {
            Sigle: action.NewData.Sigle,
          })
          return UpdateGroupeParlementaireToSupabase(action.NewData).then(
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
