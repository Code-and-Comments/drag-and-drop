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
  @HostBinding(`class.${defaultKndDndConfig.selectIsHovered}`) private isHovered = false;
  @HostBinding(`class.${defaultKndDndConfig.selectIsShiftHovered}`) private isShiftHovered = false;
  
  private dndService = inject(KndDndService<Item>);
  private hoverSub: Subscription
  private selectSub: Subscription

  @HostListener('mouseenter') private onMouseEnter(evt: MouseEvent) {
    this.isHovered = true;
    this.dndService.hoverItem(this.kndItem);
  }

  @HostListener('mouseleave') private onMouseLeave(evt: MouseEvent) {
    this.isHovered = false
    this.dndService.resetHoverItem();
  }

  ngOnInit() {
    this.selectSub = this.dndService.createIsSelectedObservable(this.kndItem).subscribe(isSelected => this.isSelected = isSelected);
    this.hoverSub = this.dndService.createIsHoveringObservable(this.kndItem).subscribe(isShiftHovered => this.isShiftHovered = isShiftHovered);
  }
  ngOnDestroy() {
    this.selectSub.unsubscribe();
    this.hoverSub.unsubscribe();
  }

  selectItem() {
    this.dndService.selectItem(this.kndItem);
    
  }

  deSelectItem() {
    this.dndService.deSelectItem(this.kndItem);
  }
}