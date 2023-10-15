import { Directive, Output, EventEmitter, HostBinding, HostListener, Input, inject } from '@angular/core';
import { defaultKndDndConfig } from './dnd.provider';
import { KndDndService } from '../knd-dnd.service';
import { take } from 'rxjs';

type Identifier = String

export interface DropInfo<Item> {
  dropId: Identifier;
  dragItems: Item[];
}

@Directive({
  selector: '[kndDropable]',
  standalone: true
})
export class DropableDirective<Item extends object> {
  @Input({ required: true }) kndDropId: Identifier;
  @HostBinding(`class.${defaultKndDndConfig.dropIsHovering}`) private isHovering = false;
  @Output() gotDropped = new EventEmitter<DropInfo<Item>>();
  private dndService = inject(KndDndService<Item>);

  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isHovering = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isHovering = false;
  }

  @HostListener('drop', ['$event']) public ondrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isHovering = false;
    // clear dnd events -> maybe manually because we need to wait for success?
    this.dndService.selectedItems$.pipe(take(1)).subscribe(items => {
      this.gotDropped.emit({ dropId: this.kndDropId, dragItems: [...items.values()] });
      this.dndService.deSelectAll();
    });
  }
}