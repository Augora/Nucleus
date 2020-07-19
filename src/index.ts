import { ManageDeputes } from './Depute/Manager'
import './Types/External/NosDeputesFR/Deputes'
import './Types/External/NosDeputesFR/Depute'
import './Types/Canonical/Activite'
import './Types/Canonical/Depute'
import './Types/Canonical/Adresse'
import './Types/Canonical/AncienMandat'
import './Types/Canonical/AutreMandat'

import GlobalMetrics from './Common/GlobalMetrics'

ManageDeputes()
  .then(() => {
    console.log(GlobalMetrics)
    console.log('The end.')
  })
  .catch((err) => {
    console.error(err)
    throw err
  })
