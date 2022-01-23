import dotenv from 'dotenv'
dotenv.config()

const optionDefinitions = [
  { name: 'groupes', alias: 'g', type: Boolean },
  { name: 'activites', alias: 'a', type: Boolean },
  { name: 'deputes', alias: 'd', type: Boolean },
]

import commandLineArgs from 'command-line-args'
const options = commandLineArgs(optionDefinitions)

import { ManageGroupes } from './GroupeParlementaire/Manager'
import { ManageDeputes } from './Depute/Manager'
import { ManageActivites } from './Activite/Manager'
import { GetLogger } from './Common/Logger'

if (options.groupes) {
  ManageGroupes()
    .then(() => {
      GetLogger().info('Imported groupes')
    })
    .catch((err) => {
      GetLogger().error(err)
      throw err
    })
}

if (options.deputes) {
  ManageDeputes()
    .then(() => {
      GetLogger().info('Imported deputes')
    })
    .catch((err) => {
      GetLogger().error(err)
      throw err
    })
}

if (options.activites) {
  ManageActivites()
    .then(() => {
      GetLogger().info('Imported activites')
    })
    .catch((err) => {
      GetLogger().error(err)
      throw err
    })
}
