export interface KndDndSettings {
    selectShiftClass: string;
    selectLastClass: string;
    selectHandlerPrefix: string;
    selectModeClass: string;
    selectClass: string;
    hoverClass: string;
    dragClass: string;
    selectExceptClass: string;
}

export const kndDndSettings: KndDndSettings = {
    selectShiftClass: 'knd-select-shift',
    selectLastClass: 'knd-select-last',
    selectModeClass: 'knd-select-mode',
    selectHandlerPrefix: 'knd-select-handle',
    selectClass: 'knd-dnd-selected',
    hoverClass: 'knd-dnd-hovered',
    dragClass: 'knd-dnd-drag',
    selectExceptClass: 'knd-dnd-excpet',
}