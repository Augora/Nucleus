import axios from 'axios'
import { from } from 'rxjs'
import { mergeMap, toArray, retry } from 'rxjs/operators'

import { GetLogger } from '../Common/Logger'

export function GetDeputesInOrganisme(
  organismeSlug: string
): Promise<Types.External.NosDeputesFR.SimpleDepute[]> {
  return axios
    .get<Types.External.NosDeputesFR.DeputesWrapper>(
      `${process.env.NOSDEPUTES_BASE_URL}/organisme/${organismeSlug}/json`
    )
    .then((res) => {
      if (res.data && res.data.deputes) {
        return res.data.deputes.map((d) => d.depute)
      } else {
        return []
      }
    })
}
