export type KndIdentifier = string

export interface KndDndConfig {
    selectIsSelected: string;
    selectIsHovered: string;
    selectIsShiftHovered: string;
    dragIsDragging: string;
    dropIsHovering: string;
    dragUI: string
}

// move this to a provider!!
export const defaultKndDndConfig: KndDndConfig = {
    selectIsSelected: 'knd-select-isSelected',
    selectIsHovered: 'knd-select-isHovered',
    selectIsShiftHovered: 'knd-select-isShiftHovered',
    dragIsDragging: 'knd-drag-isDragging',
    dropIsHovering: 'knd-drop-isHovering',
    dragUI: 'knd-dragUI',
}

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

export function createEmptyMap<T>(): Map<KndIdentifier, T> {
  return new Map<KndIdentifier, T>()
}

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