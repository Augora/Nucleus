import dotenv from 'dotenv'
dotenv.config()

const optionDefinitions = [
  { name: 'groupes', alias: 'g', type: Boolean },
  { name: 'activites', alias: 'a', type: Boolean },
  { name: 'organismes', alias: 'o', type: Boolean },
  { name: 'deputes', alias: 'd', type: Boolean },
  { name: 'organismesParlementaire', alias: 'p', type: Boolean },
  { name: 'ministeres', alias: 'm', type: Boolean },
]

import commandLineArgs from 'command-line-args'
const options = commandLineArgs(optionDefinitions)

import { ManageGroupes } from './GroupeParlementaire/Manager'
import { ManageDeputes } from './Depute/Manager'
import { ManageActivites } from './Activite/Manager'
import { ManageOrganismes } from './OrganismeParlementaire/Manager'
import { GetLogger } from './Common/Logger'
import { ManageDeputeOrganismeParlementaire } from './Depute_OrganismeParlementaire/Manager'
import { ManageMinisteres } from './Ministere/Manager'
import { SendWarningNotification } from './Common/SlackWrapper'

if (options.groupes) {
  ManageGroupes()
    .then(() => {
      GetLogger().info('Imported groupes')
    })
    .catch((err) => {
      GetLogger().error(err)
      SendWarningNotification('GroupeParlementaire')
    })
}

if (options.deputes) {
  ManageDeputes()
    .then(() => {
      GetLogger().info('Imported deputes')
    })
    .catch((err) => {
      GetLogger().error(err)
      SendWarningNotification('Depute')
    })
}

if (options.activites) {
  ManageActivites()
    .then(() => {
      GetLogger().info('Imported activites')
    })
    .catch((err) => {
      GetLogger().error(err)
      SendWarningNotification('Activite')
    })
}

if (options.organismes) {
  ManageOrganismes()
    .then(() => {
      GetLogger().info('Imported organismes')
    })
    .catch((err) => {
      GetLogger().error(err)
      SendWarningNotification('OrganismeParlementaire')
    })
}

if (options.organismesParlementaire) {
  ManageDeputeOrganismeParlementaire()
    .then(() => {
      GetLogger().info('Imported depute organismes')
    })
    .catch((err) => {
      GetLogger().error(err)
      SendWarningNotification('Deputes_OrganismeParlementaire')
    })
}

if (options.ministere) {
  ManageMinisteres()
    .then(() => {
      GetLogger().info('Imported Ministeres')
    })
    .catch((err) => {
      GetLogger().error(err)
      SendWarningNotification('Ministere')
    })
}
