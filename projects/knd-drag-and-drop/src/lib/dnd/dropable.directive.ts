import { Directive, Output, EventEmitter, HostBinding, HostListener, Input, inject } from '@angular/core';
import { DropInfo, KndIdentifier, defaultKndDndConfig } from './dnd.models';
import { KndDndService } from '../knd-dnd.service';
import { take } from 'rxjs';

@Directive({
  selector: '[kndDropable]',
  standalone: true
})
export class DropableDirective<Item extends object> {
  @Input({ required: true }) kndDropId: KndIdentifier;
  @HostBinding(`class.${defaultKndDndConfig.dropIsHovering}`) private isHovering = false;
  @Output() gotDropped = new EventEmitter<DropInfo<Item>>();
  private dndService = inject(KndDndService<Item>);

  @HostListener('dragover', ['$event']) private onDragOver(evt: any) {
    evt.preventDefault();
    // dont stop propagation knd-dnd-service needs to read drag-mouse-move
    // evt.stopPropagation();
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
    this.gotDropped.emit({ dropId: this.kndDropId, dragItems: items });

    // clear dnd events -> maybe manually because we need to wait for success?
    this.dndService.deSelectAll();
  }
}