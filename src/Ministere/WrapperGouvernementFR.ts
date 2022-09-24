import { from } from 'rxjs'
import { mergeMap, toArray, retry } from 'rxjs/operators'
import cheerio from 'cheerio'
import axios from 'axios'

import { GetLogger } from '../Common/Logger'
import { slugify } from '../Tools/String'

export async function GetMinisteresFromGouvernementFR(): Promise<
  Types.Canonical.Ministere[]
> {
  GetLogger().info('Retrieving ministeres from gouvernement.fr...')
  const ministeres: Types.Canonical.Ministere[] = [
    {
      Slug: slugify('Premier Ministre'),
      Nom: 'Premier Ministre',
    },
  ]

  const body = await axios
    .get('https://www.gouvernement.fr/composition-du-gouvernement')
    .then((r) => r.data)

  const $ = cheerio.load(body)

  $('.grand-ministere-titre').map((i, ministere) => {
    ministeres.push({
      Slug: slugify($(ministere).text()),
      Nom: $(ministere).text(),
    })
  })

  return Promise.resolve(ministeres)
}
