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
    const groupList = $('.contenu.c-actif h3')

    if (groupList) {
      groupList.map((i, groupe) => {
        const nomGroupe = $(groupe).text().trim()
        const IDAssembleeNationale = $(groupe).closest('.contenu.c-actif').find('a[title="Voir toute la page"]').first().attr('href').split('/').pop()
        if (IDAssembleeNationale) {
          groupesParlementaires.push({
            Slug: slugify(nomGroupe),
            NomComplet: nomGroupe,
            IDAssembleeNationale: IDAssembleeNationale
          })
        } else {
          throw new Error(
            `L'ID de l'Assemblée Nationale pour le groupe ${nomGroupe} n'est pas disponible. Merci de relancer le déploiement ou de corriger le problème.`,
          )
        }

      })
    } else {
      throw new Error(
        `Aucun groupe n'a été trouvé. Merci de relancer le déploiement.`,
      )
    }

  } catch (error) {
    GetLogger().error('Failed to retrieve groupes parlementaires: ', error)
  }
  finally {
    await browser.close();
  }

  return Promise.resolve(groupesParlementaires)
}
