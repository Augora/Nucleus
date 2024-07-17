import cheerio from 'cheerio'
import puppeteer from 'puppeteer'

import { GetLogger } from '../Common/Logger'
import { slugify } from '../Tools/String'
import { Database } from '../../Types/database.types'
import { retryGoto } from '../Tools/Promises'

type GroupeParlementaire = Database['public']['Tables']['newSource_GroupeParlementaire']['Insert']

export async function GetGroupesParlementairesFromGouvernementFR(): Promise<GroupeParlementaire[]> {
  GetLogger().info('Retrieving groupes parlementaires from gouvernement.fr...')
  const groupesParlementaires: GroupeParlementaire[] = []

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const url = "https://www2.assemblee-nationale.fr/17/les-groupes-politiques"

  try {
    await retryGoto(page, url)
    await page.waitForSelector('.contenu.c-actif h3')
    const bodyHTML = await page.content()
    const $ = cheerio.load(bodyHTML)

    $('.contenu.c-actif h3').map((i, groupe) => {
      const nomGroupe = $(groupe).text().trim()
      groupesParlementaires.push({
        Slug: slugify(nomGroupe),
        NomComplet: nomGroupe
      })
    })

  } catch (error) {
    GetLogger().error('Failed to retrieve groupes parlementaires: ', error)
  }
  finally {
    await browser.close();
  }

  return Promise.resolve(groupesParlementaires)
}
