export interface KndDndConfig {
    selectIsHovered: string;
    selectIsSelected: string;
}

// move this to a provider!!
export const defaultKndDndConfig: KndDndConfig = {
    selectIsHovered: 'knd-select-isHovered',   
    selectIsSelected: 'knd-select-isSelected',
}