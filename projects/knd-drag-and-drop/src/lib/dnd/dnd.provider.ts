export interface KndDndConfig {
    selectIsSelected: string;
    dragIsDragging: string;
}

// move this to a provider!!
export const defaultKndDndConfig: KndDndConfig = {
    selectIsSelected: 'knd-select-isSelected',
    dragIsDragging: 'knd-drag-isDragging',
}