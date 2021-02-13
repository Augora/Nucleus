import dotenv from 'dotenv'
dotenv.config()

import { ManageGroupes } from './GroupeParlementaire/Manager'
import { ManageDeputes } from './Depute/Manager'
import { GetLogger } from './Common/Logger'
import firebaseClient from './Common/FirebaseClient'

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
  .finally(() => firebaseClient.delete())

import { GetDeputesFromFirestore } from './Depute/WrapperFirebase'

// GetDeputesFromFirestore()
//   .then((r) => console.log(r))
//   .catch((e) => console.log(e))
//   .then(() => firebaseClient.delete())

import axios from 'axios'
import { MapActivites } from './Mappings/Depute'

// axios
//   .get(
//     `https://www.nosdeputes.fr/cedric-roussel/graphes/lastyear/total?questions=true&format=json`
//   )
//   .then((response) => {
//     const { data } = response
//     const LDActs = MapActivites(data)
//     console.log(LDActs.sort((a, b) => a.NumeroDeSemaine - b.NumeroDeSemaine))
//   })
