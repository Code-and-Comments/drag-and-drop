import { InjectionToken } from '@angular/core';
import { KndIdentifier } from './dnd';

export const KNDDND_CONFIG = new InjectionToken<KndDndConfig>('knddnd.config');

export interface KndDndCssConfig {
    selectIsSelected: string;
    selectIsHovered: string;
    selectIsShiftHovered: string;
    dragIsDragging: string;
    dropIsHovering: string;
    dragUI: string
}

export const defaultKndDndCssConfig: KndDndCssConfig = {
    selectIsSelected: 'knd-select-isSelected',
    selectIsHovered: 'knd-select-isHovered',
    selectIsShiftHovered: 'knd-select-isShiftHovered',
    dragIsDragging: 'knd-drag-isDragging',
    dropIsHovering: 'knd-drop-isHovering',
    dragUI: 'knd-dragUI',
}

export interface KndDndConfig {
    updateDragUI?<Item>(dragUI: HTMLDivElement, items?: Item[]): void
    selectUniqueIdentifier?<Item>(item: Item): KndIdentifier
    debug: boolean;
}