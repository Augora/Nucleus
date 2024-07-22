import axios from 'axios'
import trim from 'lodash/trim'

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
      `https://fr.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro&explaintext&redirects=1&titles=${encodeURI(
        groupeTitle
      )}`
    )
    .then((res) => {
      GetLogger().info(
        `Retrieved groupe description for ${groupeTitle} from Wikipedia.`,
        res.data
      )
      return res
    })
    .then(
      (res) =>
        res.data.query.pages[Object.keys(res.data.query.pages)[0]].extract.split('\n').slice(0, 2).join('\n')
    )
    .then((res) => trim(res))
    .catch((e) => {
      GetLogger().error(e)
      throw e
    })
}
