import { NgModule } from '@angular/core';
import { DraggableDirective } from './draggable.directive';
import { DropableDirective } from './dropable.directive';
import { SelectableDirective } from './selectable.directive';

@NgModule({
  imports: [],
  declarations: [
    DropableDirective,
    DraggableDirective,
    SelectableDirective
  ],
  exports: [
    DropableDirective,
    DraggableDirective,
    SelectableDirective
  ]
})
export class DndDirectiveModule {}
