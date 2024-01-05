import { InjectionToken } from '@angular/core';

// export const KNDDND_CONFIG_CSS = new InjectionToken<KndDndCssConfig>('knddnd.config.css');
export const KNDDND_CONFIG_DND = new InjectionToken<KndDndCssConfig>('knddnd.config.dnd');

export interface KndDndCssConfig {
    selectIsSelected: string;
    selectIsHovered: string;
    selectIsShiftHovered: string;
    dragIsDragging: string;
    dropIsHovering: string;
    dragUI: string
}

// move this to a provider!!
export const defaultKndDndCssConfig: KndDndCssConfig = {
    selectIsSelected: 'knd-select-isSelected',
    selectIsHovered: 'knd-select-isHovered',
    selectIsShiftHovered: 'knd-select-isShiftHovered',
    dragIsDragging: 'knd-drag-isDragging',
    dropIsHovering: 'knd-drop-isHovering',
    dragUI: 'knd-dragUI',
}
