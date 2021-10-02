import firebase from 'firebase'
import firebaseClient from '../Common/FirebaseClient'
import isUndefined from 'lodash/isUndefined'
import isNull from 'lodash/isNull'
import isObject from 'lodash/isObject'

function removeEmpty(obj) {
  let newObj = {}
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key])
    else if (obj[key] !== undefined) newObj[key] = obj[key]
  })
  return newObj
}

function dictionnaryToArray(dict) {
  return Object.keys(dict).map((k) => dict[k])
}

function isAFirebaseDictionnary(dict) {
  return (
    isObject(dict) &&
    !isNull(dict) &&
    !isUndefined(dict) &&
    !isNull(dict['0']) &&
    !isUndefined(dict['0'])
  )
}

const organismeConverter = {
  toFirestore(
    groupe: Types.Canonical.OrganismeParlementaire
  ): firebase.firestore.DocumentData {
    return removeEmpty(groupe)
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Types.Canonical.OrganismeParlementaire {
    const data: Types.Canonical.OrganismeParlementaire = Object.assign(
      snapshot.data(options)
    )
    Object.keys(data).forEach((k) => {
      if (isAFirebaseDictionnary(data[k])) {
        data[k] = dictionnaryToArray(data[k])
      }
    })
    return data
  },
}

export function GetOrganismesFromFirestore() {
  return firebaseClient
    .firestore()
    .collection('OrganismeParlementaire')
    .withConverter(organismeConverter)
    .get({ source: 'server' })
    .then((qs) => qs.docs.map((d) => d.data()))
}

export function CreateOrganismeParlementaireToFirestore(
  data: Types.Canonical.OrganismeParlementaire
) {
  return firebaseClient
    .firestore()
    .collection('OrganismeParlementaire')
    .withConverter(organismeConverter)
    .doc(data.Nom)
    .set(data)
}

export function UpdateOrganismeParlementaireToFirestore(
  data: Types.Canonical.OrganismeParlementaire
) {
  return firebaseClient
    .firestore()
    .collection('OrganismeParlementaire')
    .withConverter(organismeConverter)
    .doc(data.Nom)
    .set(data, {
      mergeFields: ['Actif'],
    })
}

// export function DoesGroupeParlementaireExistsBySigle(sigle: string) {
//   return GetProvidedFaunaDBClient().query<values.Document<boolean>>(
//     Exists(Match(Index('unique_GroupeParlementaire_Sigle'), sigle))
//   )
// }

// export function GetGroupeParlementaireByRef(ref) {
//   return GetProvidedFaunaDBClient().query<
//     values.Document<Types.Canonical.GroupeParlementaire>
//   >(Get(ref))
// }
