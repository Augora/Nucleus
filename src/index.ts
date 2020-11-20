import dotenv from 'dotenv'
dotenv.config()

import { ManageGroupes } from './GroupeParlementaire/Manager'
import { ManageDeputes } from './Depute/Manager'
import { GetLogger } from './Common/Logger'

ManageGroupes()
  .then(() => {
    console.log('Imported groupes')
  })
  .then(() =>
    ManageDeputes()
      .then(() => {
        console.log('Imported deputes')
      })
      .catch((err) => {
        GetLogger().error(err)
        throw err
      })
  )
  .catch((err) => {
    GetLogger().error(err)
    throw err
  })
