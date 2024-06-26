import cheerio from 'cheerio'
import axios from 'axios'

import { GetLogger } from '../Common/Logger'
import { slugify } from '../Tools/String'
import { Database } from '../../Types/database.types'

type Ministre = Database['public']['Tables']['Ministre']['Insert']

export async function GetMinistresFromGouvernementFR(): Promise<Ministre[]> {
  GetLogger().info('Retrieving ministres from gouvernement.fr...')
  const ministres: Ministre[] = []

  const body = await axios
    .get('https://www.gouvernement.fr/composition-du-gouvernement')
    .then((r) => r.data)

  const $ = cheerio.load(body)

  $('div.fr-cards-group > .fr-col-12 > .fr-card').map((i, ministre) => {
    const nom = $(ministre)
      .find('.fr-card__body > .fr-card__content > .fr-card__title > a')
      .text()
    const fonction = $(ministre)
      .find('.fr-card__body > .fr-card__content > .fr-card__desc')
      .text()
    const ministere = slugify(
      $(ministre).parent().parent().prev().find('.fr-col > h2').text()
    )

    ministres.push({
      Slug: slugify(nom),
      Nom: nom,
      Prenom: nom.split(/(\S+)(\s+)(.+)/)[1],
      NomDeFamille: nom.split(/(\S+)(\s+)(.+)/)[3],
      Fonction: fonction,
      FonctionLong: fonction,
      Ministere: ministere,
    })
  })

  if (ministres.length === 0)
    return Promise.reject('No ministre retrieved from gouvernement.fr')

  return Promise.resolve(ministres)
}
