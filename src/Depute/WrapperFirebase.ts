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

const deputeConverter = {
  toFirestore(depute: Types.Canonical.Depute): firebase.firestore.DocumentData {
    return removeEmpty(depute)
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Types.Canonical.Depute {
    const data: Types.Canonical.Depute = Object.assign(snapshot.data(options))
    Object.keys(data).forEach((k) => {
      if (isAFirebaseDictionnary(data[k])) {
        data[k] = dictionnaryToArray(data[k])
      }
    })
    return data
  },
}

export function GetDeputesFromFirestore() {
  return firebaseClient
    .firestore()
    .collection('Depute')
    .withConverter(deputeConverter)
    .get({ source: 'server' })
    .then((qs) => qs.docs.map((d) => d.data()))
}

export function CreateDeputeToFirestore(data: Types.Canonical.Depute) {
  return firebaseClient
    .firestore()
    .collection('Depute')
    .withConverter(deputeConverter)
    .doc(data.Slug)
    .set(data)
}

export function UpdateDeputeToFirestore(data: Types.Canonical.Depute) {
  return firebaseClient
    .firestore()
    .collection('Depute')
    .withConverter(deputeConverter)
    .doc(data.Slug)
    .set(data, {
      merge: true,
    })
}

export function DeleteDeputeToFirestore(data: Types.Canonical.Depute) {
  return firebaseClient
    .firestore()
    .collection('Depute')
    .withConverter(deputeConverter)
    .doc(data.Slug)
    .delete()
}
