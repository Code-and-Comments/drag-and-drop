import { Directive, Output, EventEmitter, HostBinding, HostListener, Input, inject } from '@angular/core';
import { DropInfo, DndIdentifier } from '../dnd';
import { DndService } from '../services/dnd.service';
import { defaultDndCssConfig } from '../dnd-configuration';

@Directive({
  selector: '[dndDropable]',
  standalone: true
})
export class DropableDirective<Item extends object> {
  @Input({ required: true }) dropId: DndIdentifier;
  @HostBinding(`class.${defaultDndCssConfig.dropIsHovering}`) private isHovering = false;
  @Output() gotDropped = new EventEmitter<DropInfo<Item>>();
  private dndService = inject(DndService<Item>);

  @HostListener('dragover', ['$event']) private onDragOver(evt: any) {
    evt.preventDefault();
    // dont stop propagation dnd-service needs to read drag-mouse-move
    // evt.stopPropagation(); DONT!!!!!
    this.isHovering = true;
  }

  @HostListener('dragleave', ['$event']) private onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isHovering = false;
  }

  @HostListener('drop', ['$event']) private ondrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isHovering = false;
    
    const items = this.dndService.getAllSelectedItems();
    // use setTimeout to move gotDroppped after draggable drag end,
    // otherwise dragend might not run if the draggable gets removed from the DOM in the drop event
    setTimeout(() => this.gotDropped.emit({ dropId: this.dropId, dragItems: items }), 10);

    // clear dnd events -> maybe manually because we need to wait for success?
    this.dndService.deSelectAll();
  }
}