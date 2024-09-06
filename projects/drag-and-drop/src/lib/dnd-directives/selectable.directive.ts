import { Directive, Input, HostListener, inject, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { DndService } from '../services/dnd.service';
import { Subject, takeUntil } from 'rxjs';
import { defaultDndCssConfig } from '../dnd-configuration';

@Directive({
  selector: '[dndSelectable]',
  standalone: true,
})
export class SelectableDirective<Item extends object> implements OnInit, OnDestroy {
  @Input({ required: true }) dndItem: Item;
  @HostBinding(`class.${defaultDndCssConfig.selectIsSelected}`) private _isSelected = false;
  @HostBinding(`class.${defaultDndCssConfig.selectIsShiftHovered}`) private _isShiftHovered = false;
  
  private dndService = inject(DndService<Item>);
  private destroy$ = new Subject<void>();

  @HostListener('mouseenter') private onMouseEnter(evt: MouseEvent) {
    this.dndService.hoverItem(this.dndItem);
  }

  @HostListener('mouseleave') private onMouseLeave(evt: MouseEvent) {
    this.dndService.resetHoverItem();
  }

  ngOnInit() {
    this.dndService.createItemStateObservable(this.dndItem).pipe(
      takeUntil(this.destroy$)
    ).subscribe(state => {
      this._isSelected = state.isSelected;
      this._isShiftHovered = state.isShiftHovered;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  selectItem() {
    this.dndService.selectItem(this.dndItem);
  }

  deSelectItem() {
    this.dndService.deSelectItem(this.dndItem);
  }

  get isSelected(): boolean {
    return this._isSelected
  }

  get isShiftHovered(): boolean {
    return this._isShiftHovered
  }
}