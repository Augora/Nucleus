import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore'
import {
  getFirestore,
  query,
  where,
  getDocsFromServer,
  doc,
  setDoc,
  deleteDoc,
  collection,
} from 'firebase/firestore'
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
  toFirestore(activite: Types.Canonical.Activite): DocumentData {
    return removeEmpty(activite)
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
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
  return getDocsFromServer(
    query(
      collection(getFirestore(firebaseClient), 'Activite').withConverter(
        activiteConverter
      ),
      where('DeputeSlug', '==', slug)
    )
  ).then((qs) => qs.docs.map((d) => d.data()))
}

export function CreateActiviteToFirestore(data: Types.Canonical.Activite) {
  return setDoc(
    doc(
      collection(getFirestore(firebaseClient), 'Activite').withConverter(
        activiteConverter
      ),
      `${data.NumeroDeSemaine}_${data.DeputeSlug}`
    ),
    data
  )
}

export function UpdateActiviteToFirestore(data: Types.Canonical.Activite) {
  return setDoc(
    doc(
      collection(getFirestore(firebaseClient), 'Activite').withConverter(
        activiteConverter
      ),
      `${data.NumeroDeSemaine}_${data.DeputeSlug}`
    ),
    data,
    { merge: true }
  )
}

export function DeleteActiviteToFirestore(data: Types.Canonical.Activite) {
  return deleteDoc(
    doc(
      collection(getFirestore(firebaseClient), 'Activite'),
      `${data.NumeroDeSemaine}_${data.DeputeSlug}`
    )
  )
}
