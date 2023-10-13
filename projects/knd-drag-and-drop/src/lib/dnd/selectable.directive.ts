import { Directive, Input, HostListener, inject, HostBinding, OnInit } from '@angular/core';
import { KndDndService } from '../knd-dnd.service';
import { defaultKndDndConfig } from './dnd.provider';

@Directive({
  selector: '[kndSelectable]',
  standalone: true,
})
export class SelectableDirective<Item extends object> implements OnInit {
  @Input({ required: true }) kndItem: Item
  
  private dndService = inject(KndDndService<Item>);
  @HostBinding(`class.${defaultKndDndConfig.selectIsHovered}`) private isHovered = false;
  @HostBinding(`class.${defaultKndDndConfig.selectIsSelected}`) private isSelected = false;

  @HostListener('mouseenter', ['$event']) private onMouseEnter(evt: any) {
    this.isHovered = true;
  }

  @HostListener('mouseleave', ['$event']) private onMouseLeave(evt: any) {
    this.isHovered = false;
  }

  ngOnInit() {
    this.dndService.createHasItemObservable(this.kndItem)
      .subscribe(isSelected => this.isSelected = isSelected);
  }

  selectItem() {
    this.dndService.selectItem(this.kndItem);
  }

  deSelectItem() {
    this.dndService.deSelectItem(this.kndItem);
  }
}