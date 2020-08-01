import { from } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

import { MapDepute } from './Mapping'
import { AreTheSameDeputes } from './Comparison'
import { CompareLists, Action, DiffType } from '../Tools/Comparison'
import { GetLogger } from '../Common/Logger'
import {
  GetDeputesFromFaunaDB,
  CreateDepute,
  UpdateDepute,
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
        GetLogger().info('Processing', { Slug: action.Data.Slug })
        const currentDeputeFromAPI = deputesFromNosDeputesFR.find(
          (d) => d.slug === action.Data.Slug
        )
        // GetLogger().info('currentDeputeFromAPI:', currentDeputeFromAPI)
        if (action.Action === Action.Create) {
          GetLogger().info('Creating depute:', action.Data)
          return CreateDepute(action.Data)
            .then((ret: any) => {
              GetLogger().info('Created depute:', ret.data)
              return Promise.all([
                // manageActivites(action.Data.Slug, GetProvidedFaunaDBClient()),
                manageAdresses(
                  action.Data.Slug,
                  GetProvidedFaunaDBClient(),
                  action.Data.Adresses
                ),
                manageAnciensMandats(
                  action.Data.Slug,
                  GetProvidedFaunaDBClient(),
                  currentDeputeFromAPI.anciens_mandats.map((am) => am.mandat)
                ),
                manageAutresMandats(
                  action.Data.Slug,
                  GetProvidedFaunaDBClient(),
                  currentDeputeFromAPI.autres_mandats.map((am) => am.mandat)
                ),
              ])
            })
            .catch((err) => {
              GetLogger().error(
                `Error while creating depute ${action.Data.Slug}: ${err}`
              )
            })
        } else if (action.Action === Action.Update) {
          GetLogger().info('Updating depute:', action.Data.Slug)
          return UpdateDepute(action.Data).then((ret: any) => {
            GetLogger().info('Updated depute:', action.Data, 'to', ret.data)
            return Promise.all([
              // manageActivites(action.Data.Slug, GetProvidedFaunaDBClient()),
              manageAdresses(
                action.Data.Slug,
                GetProvidedFaunaDBClient(),
                action.Data.Adresses
              ),
              manageAnciensMandats(
                action.Data.Slug,
                GetProvidedFaunaDBClient(),
                currentDeputeFromAPI.anciens_mandats.map((am) => am.mandat)
              ),
              manageAutresMandats(
                action.Data.Slug,
                GetProvidedFaunaDBClient(),
                currentDeputeFromAPI.autres_mandats.map((am) => am.mandat)
              ),
            ])
          })
        } else if (action.Action === Action.Remove) {
          // TODO: Think about this kind of cases.
          return Promise.resolve()
        } else if (action.Action === Action.None) {
          // GetLogger().info('Nothing to do on', action.Data.Slug)
          return Promise.all([
            // manageActivites(action.Data.Slug, GetProvidedFaunaDBClient()),
            manageAdresses(
              action.Data.Slug,
              GetProvidedFaunaDBClient(),
              action.Data.Adresses
            ),
            manageAnciensMandats(
              action.Data.Slug,
              GetProvidedFaunaDBClient(),
              currentDeputeFromAPI.anciens_mandats
                .map((am) => am.mandat)
                .filter((am) => am.split(' / ')[1] !== '')
            ),
            manageAutresMandats(
              action.Data.Slug,
              GetProvidedFaunaDBClient(),
              currentDeputeFromAPI.autres_mandats.map((am) => am.mandat)
            ),
          ])
        }
      }, 1)
    )
    .toPromise()
}
