import {uniq} from 'lodash';

export interface IDiff<T> {
  add: T[];
  update: T[];
  remove: T[];
}

export function diffArrays<T extends { id: string }, K extends keyof T>(oldArr: T[], newArr: T[], compareProperties?: K[]): IDiff<T> {
  const oldsArrVal: T[] = oldArr ?? [];
  const newArrVal: T[] = newArr ?? [];
  const newArrMap: Map<string, T> = new Map<string, T>(newArrVal.map(element => [element.id, element]));
  const remove: T[] = [];
  let update: T[] = [];
  for (const element of oldsArrVal) {
    const id = element.id;
    if (newArrMap.has(id)) {
      const newElement = newArrMap.get(id);
      if (newElement && compareProperties?.length) {
        for (const propertyToCompare of compareProperties) {
          if (element[propertyToCompare] !== newElement[propertyToCompare]) {
            update.push(newElement);
          }
        }
      } else if (element !== newElement && newElement) {
        update.push(newElement);
      }
      newArrMap.delete(id);
    } else {
      remove.push(element);
    }
  }

  update = uniq(update);
  return {add: Array.from(newArrMap.values()), update, remove};
}
