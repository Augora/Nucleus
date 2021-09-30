import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore'
import {
  getFirestore,
  query,
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

const groupeConverter = {
  toFirestore(groupe: Types.Canonical.GroupeParlementaire): DocumentData {
    return removeEmpty(groupe)
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Types.Canonical.GroupeParlementaire {
    const data: Types.Canonical.GroupeParlementaire = Object.assign(
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

export function GetGroupesFromFirestore() {
  return getDocsFromServer(
    query(
      collection(
        getFirestore(firebaseClient),
        'GroupeParlementaire'
      ).withConverter(groupeConverter)
    )
  ).then((qs) => qs.docs.map((d) => d.data()))
}

export function CreateGroupeParlementaireToFirestore(
  data: Types.Canonical.GroupeParlementaire
) {
  return setDoc(
    doc(
      collection(getFirestore(firebaseClient), 'Depute').withConverter(
        groupeConverter
      ),
      data.Sigle
    ),
    data
  )
}

export function UpdateGroupeParlementaireToFirestore(
  data: Types.Canonical.GroupeParlementaire
) {
  return setDoc(
    doc(
      collection(getFirestore(firebaseClient), 'Depute').withConverter(
        groupeConverter
      ),
      data.Sigle
    ),
    data,
    { mergeFields: ['Actif'] }
  )
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
