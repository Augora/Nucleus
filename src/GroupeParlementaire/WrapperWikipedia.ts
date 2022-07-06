import axios from 'axios'

import { GetLogger } from '../Common/Logger'

export function GetGroupeParlementaireExplainText(
  groupeTitle: string
): Promise<string> {
  GetLogger().info(
    `Retrieving groupe description for ${groupeTitle} from Wikipedia...`
  )
  if (groupeTitle === null) return new Promise(null)
  return axios
    .get(
      `https://fr.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro&explaintext&redirects=1&titles=${groupeTitle}`
    )
    .then((res) => {
      GetLogger().info(
        `Retrieved groupe description for ${groupeTitle} from Wikipedia.`,
        res.data
      )
      return res
    })
    .then((res) =>
      res.data.query.pages[
        Object.keys(res.data.query.pages)[0]
      ].extract.replace('\n', '')
    )
    .catch((e) => {
      GetLogger().error(e)
      throw e
    })
}
