import { InjectionToken } from '@angular/core';
import { DndIdentifier } from './dnd';

export const DND_CONFIG = new InjectionToken<DndConfig>('dnd.config');

export interface DndCssConfig {
    selectIsSelected: string;
    selectIsHovered: string;
    selectIsShiftHovered: string;
    dragIsDragging: string;
    dropIsHovering: string;
    dragUI: string
}

export const defaultDndCssConfig: DndCssConfig = {
    selectIsSelected: 'dnd-select-isSelected',
    selectIsHovered: 'dnd-select-isHovered',
    selectIsShiftHovered: 'dnd-select-isShiftHovered',
    dragIsDragging: 'dnd-drag-isDragging',
    dropIsHovering: 'dnd-drop-isHovering',
    dragUI: 'dnd-dragUI',
}

export interface DndConfig {
    updateDragUI?<Item>(dragUI: HTMLDivElement, items?: Item[]): void
    selectUniqueIdentifier?<Item>(item: Item): DndIdentifier
    debug: boolean;
}