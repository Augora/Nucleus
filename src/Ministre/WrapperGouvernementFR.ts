import { from } from 'rxjs'
import { mergeMap, toArray, retry } from 'rxjs/operators'
import cheerio from 'cheerio'
import axios from 'axios'

import { GetLogger } from '../Common/Logger'
import { slugify } from '../Tools/String'

export async function GetMinistresFromGouvernementFR(): Promise<
  Types.Canonical.Ministre[]
> {
  GetLogger().info('Retrieving ministres from gouvernement.fr...')
  const ministres: Types.Canonical.Ministre[] = []

  const body = await axios
    .get('https://www.gouvernement.fr/composition-du-gouvernement')
    .then((r) => r.data)

  const $ = cheerio.load(body)

  $('div[id*="minister_"]').map((i, ministre) => {
    const nom = $(ministre)
      .find(
        '.ministre-grand-ministere > .wrapper-nom-fonction > .ministre-name-h3'
      )
      .text()
    const fonction = $(ministre)
      .find(
        '.ministre-grand-ministere > .wrapper-nom-fonction > .ministre-fonction'
      )
      .text()
    ministres.push({
      Slug: slugify(nom),
      Nom: nom,
      Fonction: fonction,
      FonctionLong: fonction,
    })
  })

  $('.clearfix > .ministre').map((i, assistant) => {
    const nom = $(assistant)
      .find('.wrapper-nom-fonction > .ministre-name-h3')
      .text()
    const fonctionLong = $(assistant)
      .find('.wrapper-nom-fonction > .ministre-fonction')
      .text()
    const split = fonctionLong.split(/, chargé |, chargée /)
    const fonction = split[0].trim()
    const charge = split[1] ? split[1].trim() : null
    ministres.push({
      Slug: slugify(nom),
      Nom: nom,
      Fonction: fonction,
      Charge: charge,
      FonctionLong: fonctionLong,
    })
  })

  return Promise.resolve(ministres)
}
