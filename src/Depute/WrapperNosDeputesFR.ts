import axios from 'axios'
import { from, lastValueFrom } from 'rxjs'
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
  return lastValueFrom(
    from(slugs).pipe(
      mergeMap((val) => GetDeputeFromNosDeputesFR(val), 1),
      toArray()
    )
  )
}

function delayedResolve<T>(ms, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export function GetDeputeFromNosDeputesFR(
  slug: string
): Promise<Types.External.NosDeputesFR.Depute> {
  GetLogger().info('GetDeputeFromNosDeputesFR:', { Slug: slug })
  let retryCount = 0
  return lastValueFrom(
    from([slug]).pipe(
      mergeMap((_slug) => {
        return axios
          .get<Types.External.NosDeputesFR.DeputeWrapper>(
            `https://www.nosdeputes.fr/${_slug}/json`
          )
          .then((res) => {
            GetLogger().info('Retrieved from nosdeputes.fr:', { Slug: slug })
            return delayedResolve(1000, res)
          })
          .then((res) => res.data.depute)
          .catch((e) => {
            GetLogger().error(
              `An error occured while retriving depute from nosdeputes.fr:`,
              { Slug: slug, retryCount }
            )
            retryCount = retryCount + 1
            throw e
          })
      }, 1),
      retry(2)
    )
  )
}
