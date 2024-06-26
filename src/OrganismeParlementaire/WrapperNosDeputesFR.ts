import axios from 'axios'

import { GetLogger } from '../Common/Logger'

export function GetOrganismesParlementairesFromNosDeputesFR(): Promise<
  Types.External.NosDeputesFR.OrganismeParlementaire[]
> {
  GetLogger().info('Retrieving organismes from nosdeputes.fr...')
  return axios
    .get<Types.External.NosDeputesFR.OrganismesParlementaires>(
      `${process.env.NOSDEPUTES_BASE_URL}/organismes/parlementaire/json`
    )
    .then((res) => {
      GetLogger().info('Retrieved organismes from nosdeputes.fr.', res.data)
      return res
    })
    .then((res) => res.data.organismes.map((d) => d.organisme))
}
