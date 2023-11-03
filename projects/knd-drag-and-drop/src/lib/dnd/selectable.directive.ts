import { Directive, Input, HostListener, inject, HostBinding, OnInit, ElementRef } from '@angular/core';
import { KndDndService } from '../knd-dnd.service';
import { defaultKndDndConfig } from './dnd.models';

@Directive({
  selector: '[kndSelectable]',
  standalone: true,
})
export class SelectableDirective<Item extends object> implements OnInit {
  @Input({ required: true }) kndItem: Item
  @HostBinding(`class.${defaultKndDndConfig.selectIsSelected}`) private isSelected = false;
  
  private dndService = inject(KndDndService<Item>);
  private elRef = inject(ElementRef);

  ngOnInit() {
    this.dndService.createHasItemObservable(this.kndItem).subscribe(isSelected => this.isSelected = isSelected);
    const id = `knd-${this.dndService.selectUniqueIdentifier(this.kndItem)}`;
    this.elRef.nativeElement.classList.add(id);
  }

  selectItem() {
    this.dndService.selectItem(this.kndItem);
    
  }

  deSelectItem() {
    this.dndService.deSelectItem(this.kndItem);
  }
}