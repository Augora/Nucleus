import cheerio from 'cheerio'
import axios from 'axios'

import { GetLogger } from '../Common/Logger'
import { slugify } from '../Tools/String'
import { Database } from '../../Types/database.types'
import { retryOperation } from '../Tools/Promises'

type Ministere = Database['public']['Tables']['Ministere']['Insert']

export async function GetMinisteresFromGouvernementFR(): Promise<Ministere[]> {
  GetLogger().info('Retrieving ministeres from gouvernement.fr...')
  const ministeres: Ministere[] = [
    {
      Slug: slugify('Premier Ministre'),
      Nom: 'Premier Ministre',
    },
  ]

  const config = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
  }
  const body = await retryOperation(() => axios
    .get('https://www.gouvernement.fr/composition-du-gouvernement', config)
    .then((r) => r.data), 1000, 5)

  const $ = cheerio.load(body.toString())

  $('.fr-grid-row > .fr-col > h2').map((i, ministre) => {
    const ministere = $(ministre).text()

    ministeres.push({
      Slug: slugify(ministere),
      Nom: ministere,
    })
  })

  return Promise.resolve(ministeres)
}
