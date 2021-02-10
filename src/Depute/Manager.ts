import { from } from 'rxjs'
import { mergeMap, retry } from 'rxjs/operators'

import { MapDepute } from './Mapping'
import { AreTheSameDeputes } from './Comparison'
import { CompareLists, Action, DiffType } from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  GetDeputesFromFaunaDB,
  CreateDepute,
  UpdateDepute,
  DeleteDepute,
} from './WrapperFaunaDB'
import {
  GetDeputesFromNosDeputesFR,
  GetDeputesBySlugFromNosDeputesFR,
} from './WrapperNosDeputesFR'
import { manageActivites } from '../Tools/Activites'
import { manageAdresses } from '../Tools/Adresse'
import { manageAnciensMandats } from '../Tools/AnciensMandat'
import { manageAutresMandats } from '../Tools/AutresMandat'
import { GetProvidedFaunaDBClient } from '../Common/FaunaDBClient'
import { SendNewDeputeNotification } from '../Common/SlackWrapper'

export async function ManageDeputes() {
  const simpleDeputesFromNosDeputesFR = await GetDeputesFromNosDeputesFR()
  const slugs = simpleDeputesFromNosDeputesFR.map((d) => d.slug)
  const deputesFromNosDeputesFR = await GetDeputesBySlugFromNosDeputesFR(slugs)
  const canonicalDeputesFromNosDeputesFR = deputesFromNosDeputesFR.map((d) =>
    MapDepute(d)
  )
  GetLogger().info('deputesFromNosDeputesFR:', canonicalDeputesFromNosDeputesFR)
  const deputesFromFaunaDB = await GetDeputesFromFaunaDB().then((ret) =>
    ret.data.map((e) => e.data)
  )
  GetLogger().info('deputesFromFaunaDB:', deputesFromFaunaDB)
  const res = CompareLists(
    canonicalDeputesFromNosDeputesFR,
    deputesFromFaunaDB,
    AreTheSameDeputes,
    'Slug',
    true
  )
  // GetLogger().info('Modifications to make:', res)
  return from(res)
    .pipe(
      mergeMap((action: DiffType<Types.Canonical.Depute>) => {
        GetLogger().info('Processing', { Slug: action.NewData.Slug })
        const currentDeputeFromAPI = deputesFromNosDeputesFR.find(
          (d) => d.slug === action.NewData.Slug
        )
        // GetLogger().info('currentDeputeFromAPI:', currentDeputeFromAPI)
        if (action.Action === Action.Create) {
          GetLogger().info('Creating depute:', action.NewData)
          return CreateDepute(action.NewData)
            .then((ret: any) => {
              GetLogger().info('Created depute:', { Slug: action.NewData.Slug })
              return Promise.all([
                SendNewDeputeNotification(action.NewData),
                manageActivites(
                  action.NewData.Slug,
                  GetProvidedFaunaDBClient()
                ),
                manageAdresses(
                  action.NewData.Slug,
                  GetProvidedFaunaDBClient(),
                  action.NewData.Adresses
                ),
                manageAnciensMandats(
                  action.NewData.Slug,
                  GetProvidedFaunaDBClient(),
                  currentDeputeFromAPI.anciens_mandats.map((am) => am.mandat)
                ),
                manageAutresMandats(
                  action.NewData.Slug,
                  GetProvidedFaunaDBClient(),
                  currentDeputeFromAPI.autres_mandats.map((am) => am.mandat)
                ),
              ])
            })
            .catch((err) => {
              process.exitCode = 1
              GetLogger().error(
                `Error while doing creating depute ${action.NewData.Slug}`,
                err
              )
            })
        } else if (action.Action === Action.Update) {
          GetLogger().info('Updating depute:', { Slug: action.NewData.Slug })
          return UpdateDepute(action.NewData)
            .then((ret: any) => {
              GetLogger().info('Updated depute:', {
                from: action.NewData,
                to: ret.data,
              })
              return Promise.all([
                manageActivites(
                  action.NewData.Slug,
                  GetProvidedFaunaDBClient()
                ),
                manageAdresses(
                  action.NewData.Slug,
                  GetProvidedFaunaDBClient(),
                  action.NewData.Adresses
                ),
                manageAnciensMandats(
                  action.NewData.Slug,
                  GetProvidedFaunaDBClient(),
                  currentDeputeFromAPI.anciens_mandats.map((am) => am.mandat)
                ),
                manageAutresMandats(
                  action.NewData.Slug,
                  GetProvidedFaunaDBClient(),
                  currentDeputeFromAPI.autres_mandats.map((am) => am.mandat)
                ),
              ])
            })
            .catch((err) => {
              process.exitCode = 1
              GetLogger().error(
                `Error while doing updating depute ${action.NewData.Slug}`,
                err
              )
            })
        } else if (action.Action === Action.Remove) {
          GetLogger().info('Removing depute:', { Slug: action.NewData.Slug })
          return DeleteDepute(action.NewData.Slug).catch((err) => {
            process.exitCode = 1
            GetLogger().error(
              `Error while doing removing depute ${action.NewData.Slug}`,
              err
            )
          })
        } else if (action.Action === Action.None) {
          GetLogger().info('Nothing to do on', { Slug: action.NewData.Slug })
          return Promise.all([
            manageActivites(action.NewData.Slug, GetProvidedFaunaDBClient()),
            manageAdresses(
              action.NewData.Slug,
              GetProvidedFaunaDBClient(),
              action.NewData.Adresses
            ),
            manageAnciensMandats(
              action.NewData.Slug,
              GetProvidedFaunaDBClient(),
              currentDeputeFromAPI.anciens_mandats
                .map((am) => am.mandat)
                .filter((am) => am.split(' / ')[1] !== '')
            ),
            manageAutresMandats(
              action.NewData.Slug,
              GetProvidedFaunaDBClient(),
              currentDeputeFromAPI.autres_mandats.map((am) => am.mandat)
            ),
          ]).catch((err) => {
            process.exitCode = 1
            GetLogger().error(
              `Error while doing nothing on depute ${action.NewData.Slug}`,
              err
            )
          })
        }
      }, 1),
      retry(2)
    )
    .toPromise()
}
