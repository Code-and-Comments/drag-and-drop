export type KndIdentifier = string

export interface KndDndConfig {
    selectIsSelected: string;
    dragIsDragging: string;
    dropIsHovering: string;
    dragUI: string
}

// move this to a provider!!
export const defaultKndDndConfig: KndDndConfig = {
    selectIsSelected: 'knd-select-isSelected',
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
