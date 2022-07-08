import axios from 'axios'
import { from } from 'rxjs'
import { mergeMap, toArray, retry } from 'rxjs/operators'

import { GetLogger } from '../Common/Logger'

export function GetDeputesFromNosDeputesFR(): Promise<
  Types.External.NosDeputesFR.Organisme[]
> {
  GetLogger().info('Retrieving groupes from nosdeputes.fr...')
  return axios
    .get<Types.External.NosDeputesFR.Organismes>(
      `${process.env.NOSDEPUTES_BASE_URL}/organismes/groupe/json`
    )
    .then((res) => {
      GetLogger().info('Retrieved groupes from nosdeputes.fr.', res.data)
      return res
    })
    .then((res) => res.data.organismes.map((d) => d.organisme))
}
