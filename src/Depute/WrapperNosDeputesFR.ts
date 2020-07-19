import axios from 'axios'
import { from } from 'rxjs'
import { mergeMap, toArray, retry } from 'rxjs/operators'

import { GetLogger } from '../Common/Logger'

export function GetDeputesFromNosDeputesFR(): Promise<
  Types.External.NosDeputesFR.SimpleDepute[]
> {
  GetLogger().info('Retrieving deputes from nosdeputes.fr...')
  return axios
    .get<Types.External.NosDeputesFR.DeputesWrapper>(
      `https://www.nosdeputes.fr/deputes/json`
    )
    .then((res) => {
      GetLogger().info('Retrieved deputes from nosdeputes.fr.')
      return res
    })
    .then((res) => res.data.deputes.map((d) => d.depute))
}

export function GetDeputesBySlugFromNosDeputesFR(
  slugs: string[]
): Promise<Types.External.NosDeputesFR.Depute[]> {
  GetLogger().info('GetDeputesBySlugFromNosDeputesFR', slugs)
  return from(slugs)
    .pipe(
      mergeMap((val) => GetDeputeFromNosDeputesFR(val), 5),
      toArray()
    )
    .toPromise()
}

export function GetDeputeFromNosDeputesFR(
  slug: string
): Promise<Types.External.NosDeputesFR.Depute> {
  GetLogger().info('GetDeputeFromNosDeputesFR', slug)
  return from([slug])
    .pipe(
      mergeMap((_slug) => {
        return axios
          .get<Types.External.NosDeputesFR.DeputeWrapper>(
            `https://www.nosdeputes.fr/${_slug}/json`
          )
          .then((res) => {
            GetLogger().info(`Retrieved ${_slug} from nosdeputes.fr.`)
            return res
          })
          .then((res) => res.data.depute)
      }, 1),
      retry(2)
    )
    .toPromise()
}
