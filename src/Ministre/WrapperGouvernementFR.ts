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
    const ministere = slugify(
      $(ministre)
        .find('.bloc-grand-ministere-entete > .grand-ministere-titre')
        .text()
    )
    ministres.push({
      Slug: slugify(nom),
      Nom: nom,
      Prenom: nom.split(/(\S+)(\s+)(.+)/)[1],
      NomDeFamille: nom.split(/(\S+)(\s+)(.+)/)[3],
      Fonction: fonction,
      FonctionLong: fonction,
      Ministere: ministere ? ministere : 'premier-ministre',
    })
  })

  $('.clearfix > .ministre').map((i, assistant) => {
    const nom = $(assistant)
      .find('.wrapper-nom-fonction > .ministre-name-h3')
      .text()
    const fonctionLong = $(assistant)
      .find('.wrapper-nom-fonction > .ministre-fonction')
      .text()
    const split = fonctionLong.split(
      /^(.*)(, chargé |, chargée )(([a-z\s']+)([A-Z].+)*)*$/
    )
    const fonction = split[1] ? split[1].trim() : null
    const charge = split[5] ? split[5].trim() : null
    const ministere = slugify(
      $(assistant)
        .parent()
        .parent()
        .parent()
        .find('.grand-ministere-titre')
        .text()
    )

    ministres.push({
      Slug: slugify(nom),
      Nom: nom,
      Prenom: nom.split(/(\S+)(\s+)(.+)/)[1],
      NomDeFamille: nom.split(/(\S+)(\s+)(.+)/)[3],
      Fonction: fonction,
      Charge: charge,
      FonctionLong: fonctionLong,
      Ministere: ministere ? ministere : 'premier-ministre',
    })
  })

  return Promise.resolve(ministres)
}
