import dotenv from 'dotenv'
dotenv.config()

import { ManageGroupes } from './GroupeParlementaire/Manager'
import { ManageDeputes } from './Depute/Manager'
import { ManageActivites } from './Activite/Manager'
import { GetLogger } from './Common/Logger'

ManageGroupes()
  .then(() => {
    console.log('Imported groupes')
  })
  .catch((err) => {
    GetLogger().error(err)
    throw err
  })

ManageDeputes()
  .then(() => {
    console.log('Imported deputes')
  })
  .catch((err) => {
    GetLogger().error(err)
    throw err
  })

ManageActivites()
  .then(() => {
    console.log('Imported activites')
  })
  .catch((err) => {
    GetLogger().error(err)
    throw err
  })
