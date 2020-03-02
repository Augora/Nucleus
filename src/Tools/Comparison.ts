export interface DiffType<T> {
  Action: Action;
  Data: T;
}

export enum Action {
  Create,
  Remove,
  Update,
  None
}

export function RetrieveIdByPath<T>(item: T, pathToID: string): string {
  return pathToID.split(".").reduce((prevValue, currPathToApply) => {
    return prevValue[currPathToApply];
  }, item);
}

export function NormalizeArrayToObject<T>(list: T[], pathToID: string): any {
  return list.reduce((prev, curr) => {
    const ID = RetrieveIdByPath(curr, pathToID);
    return Object.assign({}, prev, { [ID]: curr });
  }, {});
}

export function CompareLists<T>(
  newList: T[],
  previousList: T[],
  areTheSameFunction: (elemA: T, elemB: T) => Boolean,
  pathToID: string,
  shouldReturnNones: Boolean = false
): DiffType<T>[] {
  const normalizedNewList = NormalizeArrayToObject(newList, pathToID);
  const normalizedPreviousList = NormalizeArrayToObject(previousList, pathToID);
  const addAndUpdateItems = newList
    .map(itemInNewList => {
      const itemInPreviousList =
        normalizedPreviousList[RetrieveIdByPath(itemInNewList, pathToID)];
      if (itemInPreviousList) {
        if (areTheSameFunction(itemInNewList, itemInPreviousList)) {
          return {
            Action: Action.None,
            Data: itemInNewList
          };
        } else {
          return {
            Action: Action.Update,
            Data: itemInNewList
          };
        }
      } else {
        return {
          Action: Action.Create,
          Data: itemInNewList
        };
      }
    })
    .filter(i => shouldReturnNones || i.Action !== Action.None);
  const RemoveItems = previousList
    .map(itemInPreviousList => {
      const itemInNewList =
        normalizedNewList[RetrieveIdByPath(itemInPreviousList, pathToID)];
      if (itemInNewList) {
        if (areTheSameFunction(itemInNewList, itemInPreviousList)) {
          return {
            Action: Action.None,
            Data: itemInPreviousList
          };
        } else {
          return {
            Action: Action.None,
            Data: itemInPreviousList
          };
        }
      } else {
        return {
          Action: Action.Remove,
          Data: itemInPreviousList
        };
      }
    })
    .filter(i => i.Action !== Action.None);
  return addAndUpdateItems.concat(RemoveItems);
}
