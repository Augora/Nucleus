import { from } from 'rxjs'
import { mergeMap, retry } from 'rxjs/operators'

import { MapDepute } from './Mapping'
import { AreTheSameDeputes } from './Comparison'
import { CompareLists, Action, DiffType } from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  GetDeputesFromNosDeputesFR,
  GetDeputesBySlugFromNosDeputesFR,
} from './WrapperNosDeputesFR'
import { SendNewDeputeNotification } from '../Common/SlackWrapper'
import {
  GetDeputesFromFirestore,
  CreateDeputeToFirestore,
  UpdateDeputeToFirestore,
  DeleteDeputeToFirestore,
} from './WrapperFirebase'

export async function ManageDeputes() {
  const simpleDeputesFromNosDeputesFR = await GetDeputesFromNosDeputesFR()
  const slugs = simpleDeputesFromNosDeputesFR.map((d) => d.slug)
  const deputesFromNosDeputesFR = await GetDeputesBySlugFromNosDeputesFR(slugs)
  const canonicalDeputesFromNosDeputesFR = deputesFromNosDeputesFR.map((d) =>
    MapDepute(d)
  )
  GetLogger().info('deputesFromNosDeputesFR:', canonicalDeputesFromNosDeputesFR)
  const deputesFromFaunaDB = await GetDeputesFromFirestore()
  GetLogger().info('deputesFromFaunaDB:', deputesFromFaunaDB)
  const res = CompareLists(
    canonicalDeputesFromNosDeputesFR,
    deputesFromFaunaDB,
    AreTheSameDeputes,
    'Slug',
    true
  )
  GetLogger().info('Modifications to make:', res)
  return from(res)
    .pipe(
      mergeMap((action: DiffType<Types.Canonical.Depute>) => {
        GetLogger().info('Processing', { Slug: action.NewData.Slug })
        if (action.Action === Action.Create) {
          GetLogger().info('Creating depute:', action.NewData)
          return CreateDeputeToFirestore(action.NewData)
            .then(() => {
              GetLogger().info('Created depute:', { Slug: action.NewData.Slug })
              SendNewDeputeNotification(action.NewData)
              GetLogger().info('Notification sent for depute creation:', {
                Slug: action.NewData.Slug,
              })
            })
            .catch((err) => {
              GetLogger().error('Error while creating depute:', {
                Slug: action.NewData.Slug,
                error: err,
              })
              process.exitCode = 1
            })
        } else if (action.Action === Action.Update) {
          GetLogger().info('Updating depute:', { Slug: action.NewData.Slug })
          return UpdateDeputeToFirestore(action.NewData)
            .then(() => {
              GetLogger().info('Updated depute:', { Slug: action.NewData.Slug })
            })
            .catch((err) => {
              GetLogger().error('Error while updating depute:', {
                Slug: action.NewData.Slug,
                error: err,
              })
              process.exitCode = 1
            })
        } else if (action.Action === Action.Remove) {
          GetLogger().info('Deleting depute:', { Slug: action.NewData.Slug })
          return DeleteDeputeToFirestore(action.NewData)
            .then(() => {
              GetLogger().info('Deleted depute:', { Slug: action.NewData.Slug })
            })
            .catch((err) => {
              GetLogger().error('Error while deleting depute:', {
                Slug: action.NewData.Slug,
                error: err,
              })
              process.exitCode = 1
            })
        } else if (action.Action === Action.None) {
          GetLogger().info('Nothing to do on', { Slug: action.NewData.Slug })
          return Promise.resolve()
        }
      }, 1),
      retry(2)
    )
    .toPromise()
}
