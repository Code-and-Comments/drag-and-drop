import { Directive, Output, EventEmitter, HostBinding, HostListener, Input } from '@angular/core';
import { idPropertyKey } from './dnd.module';
import { DropInfo } from './models';

@Directive({
  selector: '[kndDropable]'
})
export class DropableDirective {
  @Input() dropId: string | null = null;
  @HostBinding('class.fileover') fileOver = false;
  @Output() gotDropped = new EventEmitter<DropInfo>();

  @HostListener('dragover', ['$event']) onDragOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event']) public ondrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const items = JSON.parse(evt.dataTransfer.getData(idPropertyKey));
    this.gotDropped.emit({ dropId: this.dropId, dragItems: items });
  }
}