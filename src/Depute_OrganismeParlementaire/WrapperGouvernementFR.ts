import cheerio from 'cheerio'
import puppeteer from 'puppeteer'

import { Database } from '../../Types/database.types'
import { retryGoto } from '../Tools/Promises'
import { GetLogger } from '../Common/Logger'
import { slugify } from '../Tools/String'

type Depute_OrganismeParlementaire =
  Database['public']['Tables']['Depute_OrganismeParlementaire']['Insert']

export async function GetDeputesInOrganismeByDeputySlug(
  deputeSlug: string, deputeURL: string, organismes: string[], deputy: number, total: number, missingOrganismes: string[]
): Promise<Depute_OrganismeParlementaire[]> {
  GetLogger().info(`${deputy.toString().padStart(3, '0')}/${total} - Retrieving commissions for ${deputeSlug} from gouvernement.fr...`)
  const deputeOrganismesParlementaires: Depute_OrganismeParlementaire[] = []

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  try {
    await retryGoto(page, deputeURL, "#deputes-fiche")
    const bodyHTML = await page.content()
    const $ = cheerio.load(bodyHTML)
    $('h4:contains("Commissions")').next('ul.fonctions-liste-attributs').find('span.dt').map((index, element) => {
      const commissionName = $(element).next('li').find('a').text().trim()
      const commissionSlug = slugify(commissionName)
      const organismeSlug = organismes.find(o => o.startsWith(commissionSlug))
      const fonction = $(element).text().trim()
      let doublon = false
      if (organismeSlug) {
        deputeOrganismesParlementaires.map((ds) => {
          if (ds.Id === `${deputeSlug}_${organismeSlug}`) {
            doublon = true
            if (fonction != "Membre") {
              const indexExistingData = deputeOrganismesParlementaires.findIndex((ds) => ds.Id === `${deputeSlug}_${organismeSlug}`)
              deputeOrganismesParlementaires[indexExistingData] = { ...deputeOrganismesParlementaires[indexExistingData], Fonction: fonction }
            }
          }
        })

        if (!doublon) {
          deputeOrganismesParlementaires.push({
            Id: `${deputeSlug}_${organismeSlug}`,
            DeputeSlug: deputeSlug,
            OrganismeSlug: commissionSlug,
            Fonction: fonction
          })
        }
      }
      else {
        GetLogger().warn(`${deputeSlug} - ${commissionSlug} doesn't match with existing datas`)
        missingOrganismes.push(commissionSlug)
      }
    })
  } catch (error) {
    GetLogger().error('Failed to retrieve groupes parlementaires: ', error)
  }
  finally {
    await browser.close()
  }
  return Promise.resolve(deputeOrganismesParlementaires)
}

