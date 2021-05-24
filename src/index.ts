import dotenv from 'dotenv'
dotenv.config()

import { ManageGroupes } from './GroupeParlementaire/Manager'
import { ManageDeputes } from './Depute/Manager'
import { ManageActivites } from './Activite/Manager'
import { GetLogger } from './Common/Logger'
import firebaseClient from './Common/FirebaseClient'

// ManageGroupes()
//   .then(() => {
//     console.log('Imported groupes')
//   })
//   .catch((err) => {
//     GetLogger().error(err)
//     throw err
//   })

ManageDeputes()
  .then(() => {
    console.log('Imported deputes')
  })
  .catch((err) => {
    GetLogger().error(err)
    throw err
  })

// ManageActivites()
//   .then(() => {
//     console.log('Imported activites')
//   })
//   .catch((err) => {
//     GetLogger().error(err)
//     throw err
//   })

import { GetDeputesFromFirestore } from './Depute/WrapperFirebase'

// GetDeputesFromFirestore()
//   .then((r) => console.log(r))
//   .catch((e) => console.log(e))
//   .then(() => firebaseClient.delete())
