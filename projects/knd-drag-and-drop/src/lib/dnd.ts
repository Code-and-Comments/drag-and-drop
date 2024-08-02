export type KndIdentifier = string

export interface DropInfo<Item> {
  dropId: KndIdentifier;
  dragItems: Item[];
}

export interface Coordinates {
  x: number;
  y: number;
}

export const dragabbleZ = 9999;
export const dragUIZ = dragabbleZ + 1;

/**
* Find all items between two items in the array, including borders
* @param items all items
* @param item1 border item 1
* @param item2 border item 2
* @return items between borders, including the border items
*/
export function itemsInBetween<T>(items: T[], item1: T, item2: T): T[] {
   const item1Index = items.indexOf(item1);
   const item2Index = items.indexOf(item2);
   const start = item1Index > item2Index ? item2Index : item1Index;
   const end = item1Index > item2Index ?  item1Index : item2Index;
   // +1 because slice does not include end index
   return items.slice(start, end + 1);
}

export interface KndItemState {
  isDragging: boolean
  isShiftHovered: boolean
  isSelected: boolean
}

export type KndMap<T> = Map<KndIdentifier, ({ item: T, state: KndItemState })>
export function createEmptyKndMap<T>(): KndMap<T> {
  return new Map<KndIdentifier, ({ item: T, state: KndItemState })>();
}
