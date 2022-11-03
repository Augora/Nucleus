import axios from 'axios'
import { throttleAll } from 'promise-throttle-all'

import { GetLogger } from '../Common/Logger'

export function GetDeputesFromNosDeputesFR(): Promise<
  Types.External.NosDeputesFR.SimpleDepute[]
> {
  GetLogger().info('Retrieving deputes from nosdeputes.fr...')
  return axios
    .get<Types.External.NosDeputesFR.DeputesWrapper>(
      `${process.env.NOSDEPUTES_BASE_URL}/deputes/json`
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
  return throttleAll(
    1,
    slugs.map((val) => () => GetDeputeFromNosDeputesFR(val))
  )
}

export function GetDeputeFromNosDeputesFR(slug: string) {
  GetLogger().info('GetDeputeFromNosDeputesFR:', { Slug: slug })
  return axios
    .get<Types.External.NosDeputesFR.DeputeWrapper>(
      `${process.env.NOSDEPUTES_BASE_URL}/${slug}/json`
    )
    .then((res) => {
      GetLogger().info('Retrieved from nosdeputes.fr:', { Slug: slug })
      return res
    })
    .then((res) => res.data.depute)
}
