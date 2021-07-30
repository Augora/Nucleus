import firebase from 'firebase'
import firebaseClient from '../Common/FirebaseClient'
import isUndefined from 'lodash/isUndefined'
import isNull from 'lodash/isNull'
import isObject from 'lodash/isObject'

function removeEmpty(obj) {
  const newObj = {}
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

const activiteConverter = {
  toFirestore(
    activite: Types.Canonical.Activite
  ): firebase.firestore.DocumentData {
    return removeEmpty(activite)
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Types.Canonical.Activite {
    const data: Types.Canonical.Activite = Object.assign(snapshot.data(options))
    Object.keys(data).forEach((k) => {
      if (isAFirebaseDictionnary(data[k])) {
        data[k] = dictionnaryToArray(data[k])
      }
    })
    return data
  },
}

export function GetActivitesBySlugFromFirestore(slug: string) {
  return firebaseClient
    .firestore()
    .collection('Activite')
    .where('DeputeSlug', '==', slug)
    .withConverter(activiteConverter)
    .get({ source: 'server' })
    .then((qs) => qs.docs.map((d) => d.data()))
}

export function CreateActiviteToFirestore(data: Types.Canonical.Activite) {
  return firebaseClient
    .firestore()
    .collection('Activite')
    .withConverter(activiteConverter)
    .doc(`${data.NumeroDeSemaine}_${data.DeputeSlug}`)
    .set(data)
}

export function UpdateDeputeToFirestore(data: Types.Canonical.Activite) {
  return firebaseClient
    .firestore()
    .collection('Activite')
    .withConverter(activiteConverter)
    .doc(`${data.NumeroDeSemaine}_${data.DeputeSlug}`)
    .set(data, {
      merge: true,
    })
}

export function DeleteDeputeToFirestore(data: Types.Canonical.Activite) {
  return firebaseClient
    .firestore()
    .collection('Activite')
    .withConverter(activiteConverter)
    .doc(`${data.NumeroDeSemaine}_${data.DeputeSlug}`)
    .delete()
}
