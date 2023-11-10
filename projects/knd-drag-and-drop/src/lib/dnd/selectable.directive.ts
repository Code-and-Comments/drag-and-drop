import { Directive, Input, HostListener, inject, HostBinding, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { KndDndService } from '../knd-dnd.service';
import { defaultKndDndConfig } from './dnd.models';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[kndSelectable]',
  standalone: true,
})
export class SelectableDirective<Item extends object> implements OnInit, OnDestroy {
  @Input({ required: true }) kndItem: Item
  @HostBinding(`class.${defaultKndDndConfig.selectIsSelected}`) private isSelected = false;
  @HostBinding(`class.${defaultKndDndConfig.selectIsShiftHovered}`) private isShiftHovered = false;
  
  private dndService = inject(KndDndService<Item>);
  private stateSub: Subscription

  @HostListener('mouseenter') private onMouseEnter(evt: MouseEvent) {
    this.dndService.hoverItem(this.kndItem);
  }

  @HostListener('mouseleave') private onMouseLeave(evt: MouseEvent) {
    this.dndService.resetHoverItem();
  }

  ngOnInit() {
    this.stateSub = this.dndService.createItemStateObservable(this.kndItem).subscribe(state => {
      this.isSelected = state.isSelected;
      this.isShiftHovered = state.isShiftHovered;
    });
  }

  ngOnDestroy() {
    this.stateSub.unsubscribe();
  }

  selectItem() {
    this.dndService.selectItem(this.kndItem);
    
  }

  deSelectItem() {
    this.dndService.deSelectItem(this.kndItem);
  }
}