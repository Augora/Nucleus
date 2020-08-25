import { ManageDeputes } from './Depute/Manager'
import { GetLogger } from './Common/Logger'

import './Types/External/NosDeputesFR/Deputes'
import './Types/External/NosDeputesFR/Depute'
import './Types/Canonical/Activite'
import './Types/Canonical/Depute'
import './Types/Canonical/Adresse'
import './Types/Canonical/AncienMandat'
import './Types/Canonical/AutreMandat'

ManageDeputes()
  .then(() => {
    console.log('The end.')
  })
  .catch((err) => {
    GetLogger().error(err)
    throw err
  })
