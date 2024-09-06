export type DndIdentifier = string

export interface DropInfo<Item> {
  dropId: DndIdentifier;
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
export function itemsInBetween<T>(items: T[], item1: T, item2: T, identify: ((item: T) => string)): T[] {
  const identItems = items.map(identify);
  const item1Index = identItems.indexOf(identify(item1));
  const item2Index = identItems.indexOf(identify(item2));
  const start = item1Index > item2Index ? item2Index : item1Index;
  const end = item1Index > item2Index ?  item1Index : item2Index;
  // +1 because slice does not include end index
  const result = items.slice(start, end + 1);
  return result
}

export interface DndItemState {
  isDragging: boolean
  isShiftHovered: boolean
  isSelected: boolean
}

export type DndMap<T> = Map<DndIdentifier, ({ item: T, state: DndItemState })>
export function createEmptyDndMap<T>(): DndMap<T> {
  return new Map<DndIdentifier, ({ item: T, state: DndItemState })>();
}
