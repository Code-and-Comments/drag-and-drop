import { Directive, Input, HostListener, inject, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { KndDndService } from '../services/knd-dnd.service';
import { defaultKndDndConfig } from '../dnd';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[kndSelectable]',
  standalone: true,
})
export class SelectableDirective<Item extends object> implements OnInit, OnDestroy {
  @Input() kndItem: Item
  @HostBinding(`class.${defaultKndDndConfig.selectIsSelected}`) private isSelected = false;
  @HostBinding(`class.${defaultKndDndConfig.selectIsShiftHovered}`) private isShiftHovered = false;
  
  private dndService = inject(KndDndService<Item>);
  private destroy$ = new Subject<void>()

  @HostListener('mouseenter') private onMouseEnter(evt: MouseEvent) {
    this.dndService.hoverItem(this.kndItem);
  }

  @HostListener('mouseleave') private onMouseLeave(evt: MouseEvent) {
    this.dndService.resetHoverItem();
  }

  ngOnInit() {
    this.dndService.createItemStateObservable(this.kndItem).pipe(
      takeUntil(this.destroy$)
    ).subscribe(state => {
      this.isSelected = state.isSelected;
      this.isShiftHovered = state.isShiftHovered;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  selectItem() {
    this.dndService.selectItem(this.kndItem);
  }

  deSelectItem() {
    this.dndService.deSelectItem(this.kndItem);
  }
}