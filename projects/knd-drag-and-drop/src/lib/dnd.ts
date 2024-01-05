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
* Find all items between two items in the array, including first and second item
* @param first
* @param second
* @return items between first and second item
*/
export function itemsInBetween<T>(items: T[], first: T, second: T): T[] {
 // this.selectables.pipe(take(1)).subscribe(selectables => {
   // const kndItemArray = selectables.toArray().map(s => s.kndItem);
   const currentIndex = items.indexOf(first);
   const latestSelectedIndex = items.indexOf(second);
   const start = currentIndex > latestSelectedIndex ? latestSelectedIndex : currentIndex;
   const end = currentIndex > latestSelectedIndex ?  currentIndex : latestSelectedIndex;
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
