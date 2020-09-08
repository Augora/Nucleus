import { ManageGroupes } from './GroupeParlementaire/Manager'
import { ManageDeputes } from './Depute/Manager'
import { GetLogger } from './Common/Logger'

import './Types/External/NosDeputesFR/Deputes'
import './Types/External/NosDeputesFR/Depute'
import './Types/External/NosDeputesFR/Groupes'
import './Types/Canonical/Activite'
import './Types/Canonical/Depute'
import './Types/Canonical/Adresse'
import './Types/Canonical/AncienMandat'
import './Types/Canonical/AutreMandat'
import './Types/Canonical/Groupe'

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
