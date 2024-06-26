import cheerio from 'cheerio'
import axios from 'axios'

import { GetLogger } from '../Common/Logger'
import { slugify } from '../Tools/String'
import { Database } from '../../Types/database.types'

type Ministere = Database['public']['Tables']['Ministere']['Insert']

export async function GetMinisteresFromGouvernementFR(): Promise<Ministere[]> {
  GetLogger().info('Retrieving ministeres from gouvernement.fr...')
  const ministeres: Ministere[] = [
    {
      Slug: slugify('Premier Ministre'),
      Nom: 'Premier Ministre',
    },
  ]

  const body = await axios
    .get('https://www.gouvernement.fr/composition-du-gouvernement')
    .then((r) => r.data)

  const $ = cheerio.load(body)

  $('.fr-grid-row > .fr-col > h2').map((i, ministre) => {
    const ministere = $(ministre).text()

    ministeres.push({
      Slug: slugify(ministere),
      Nom: ministere,
    })
  })

  return Promise.resolve(ministeres)
}
