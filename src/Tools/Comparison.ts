import {
  isNull,
  isUndefined,
  isString,
  isArray,
  isObject,
  toString,
} from 'lodash'
import { GetLogger } from '../Common/Logger'

export interface DiffType<T> {
  Action: Action
  NewData: T
  PreviousData: T
  Diffs: FieldDiff[]
}

export enum Action {
  Create,
  Remove,
  Update,
  None,
}

export interface FieldDiff {
  FieldName: string
  FieldAValue: any
  FieldBValue: any
  Reason: string
  IsSame: boolean
}

const IdFromFieldName = {
  AncienMandat: 'AncienMandatComplet',
  Adresses: 'AdresseComplete',
}

export function RetrieveIdByPath<T>(item: T, pathToID: string): string {
  if (isNull(pathToID) || isUndefined(pathToID)) {
    return toString(item)
  }
  return pathToID.split('.').reduce((prevValue, currPathToApply) => {
    return prevValue[currPathToApply]
  }, item)
}

export function NormalizeArrayToObject<T>(list: T[], pathToID: string): any {
  return list.reduce((prev, curr) => {
    const ID = RetrieveIdByPath(curr, pathToID)
    return Object.assign({}, prev, { [ID]: curr })
  }, {})
}

export function CompareGenericFields<T>(
  fieldA: T,
  fieldB: T,
  fieldName: string
): FieldDiff {
  if (
    (isUndefined(fieldA) || isNull(fieldA)) &&
    (isUndefined(fieldB) || isNull(fieldB))
  ) {
    return {
      FieldAValue: fieldA,
      FieldBValue: fieldB,
      FieldName: fieldName,
      Reason: 'Both fields are Null of Undefined',
      IsSame: true,
    }
  }
  if (isUndefined(fieldA) || isNull(fieldA)) {
    return {
      FieldAValue: fieldA,
      FieldBValue: fieldB,
      FieldName: fieldName,
      Reason: 'Field A is null',
      IsSame: false,
    }
  }
  if (isUndefined(fieldB) || isNull(fieldB)) {
    return {
      FieldAValue: fieldA,
      FieldBValue: fieldB,
      FieldName: fieldName,
      Reason: 'Field B is null',
      IsSame: false,
    }
  }

  return {
    FieldAValue: fieldA,
    FieldBValue: fieldB,
    FieldName: fieldName,
    Reason: fieldA === fieldB ? 'Fields are different' : '',
    IsSame: fieldA === fieldB,
  }
}

function compareArrayOfStrings(
  itemA: string[],
  itemB: string[],
  prefix: string = ''
): FieldDiff[] {
  return itemA.map((ia, i) => {
    if (!itemB.includes(ia)) {
      return {
        FieldName: `${prefix}[${i}]`,
        FieldAValue: ia,
        FieldBValue: itemB,
        Reason: 'Item A is missing in array B',
        IsSame: false,
      }
    } else {
      return {
        FieldName: `${prefix}[${i}]`,
        FieldAValue: ia,
        FieldBValue: itemB,
        Reason: 'Item A is in array B',
        IsSame: true,
      }
    }
  })
}

export function CompareGenericObjects<T>(
  itemA: T,
  itemB: T,
  prefix: string = ''
): FieldDiff[] {
  const fields = Object.keys(itemA)
    // .concat(Object.keys(itemB)) // Not sure if we include destination fields
    .filter((v, i, a) => a.indexOf(v) === i)

  if (isUndefined(itemA) || isNull(itemA)) {
    return [
      {
        FieldName: prefix,
        FieldAValue: itemA,
        FieldBValue: itemB,
        Reason: 'Item A is null of undefined',
        IsSame: false,
      },
    ]
  }

  if (isUndefined(itemB) || isNull(itemB)) {
    return [
      {
        FieldName: prefix,
        FieldAValue: itemA,
        FieldBValue: itemB,
        Reason: 'Item B is null of undefined',
        IsSame: false,
      },
    ]
  }

  const diffs: FieldDiff[] = fields.flatMap((field) => {
    if (isArray(itemA[field])) {
      if (isString(itemA[field][0])) {
        return compareArrayOfStrings(
          itemA[field],
          itemB[field],
          processFieldName(field, prefix)
        )
      }

      return CompareLists(
        itemA[field],
        itemB[field],
        CompareGenericObjects,
        IdFromFieldName[field]
      ).flatMap((d) =>
        d.Diffs.map((ds) =>
          Object.assign({}, ds, {
            FieldName: processFieldName(
              ds.FieldName,
              processFieldName(field, prefix)
            ),
          })
        )
      )
    }

    if (isObject(itemA[field])) {
      return CompareGenericObjects(
        itemA[field],
        itemB[field],
        processFieldName(field, prefix)
      )
    }

    return CompareGenericFields(
      itemA[field],
      itemB[field],
      processFieldName(field, prefix)
    )
  })

  return diffs.filter((d) => !d.IsSame)
}

function processFieldName(fieldName: string, prefix: string) {
  if (prefix.length > 0) {
    return `${prefix}.${fieldName}`
  }
  return fieldName
}

export function CompareLists<T>(
  newList: T[],
  previousList: T[],
  areTheSameFunction: (elemA: T, elemB: T) => FieldDiff[],
  pathToID: string,
  shouldReturnNones: boolean = false
): DiffType<T>[] {
  const normalizedNewList = NormalizeArrayToObject(newList, pathToID)
  const normalizedPreviousList = NormalizeArrayToObject(previousList, pathToID)
  const addAndUpdateItems = newList
    .map((itemInNewList) => {
      const itemInPreviousList =
        normalizedPreviousList[RetrieveIdByPath(itemInNewList, pathToID)]
      if (itemInPreviousList) {
        const diff = areTheSameFunction(itemInNewList, itemInPreviousList)
        if (diff.length === 0) {
          return {
            Action: Action.None,
            NewData: itemInNewList,
            PreviousData: itemInPreviousList,
            Diffs: [],
          }
        } else {
          return {
            Action: Action.Update,
            NewData: itemInNewList,
            PreviousData: itemInPreviousList,
            Diffs: diff,
          }
        }
      } else {
        return {
          Action: Action.Create,
          NewData: itemInNewList,
          PreviousData: itemInPreviousList,
          Diffs: [],
        }
      }
    })
    .filter((i) => shouldReturnNones || i.Action !== Action.None)
  const RemoveItems = previousList
    .map((itemInPreviousList) => {
      const itemInNewList =
        normalizedNewList[RetrieveIdByPath(itemInPreviousList, pathToID)]
      if (itemInNewList) {
        const diff = areTheSameFunction(itemInNewList, itemInPreviousList)
        if (diff.length === 0) {
          return {
            Action: Action.None,
            NewData: itemInNewList,
            PreviousData: itemInPreviousList,
            Diffs: [],
          }
        } else {
          return {
            Action: Action.None,
            NewData: itemInNewList,
            PreviousData: itemInPreviousList,
            Diffs: [],
          }
        }
      } else {
        return {
          Action: Action.Remove,
          NewData: itemInPreviousList,
          PreviousData: itemInPreviousList,
          Diffs: [],
        }
      }
    })
    .filter((i) => i.Action !== Action.None)
  return addAndUpdateItems.concat(RemoveItems)
}
