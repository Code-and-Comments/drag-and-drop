import { Component, Input, OnInit, inject } from '@angular/core';
import { KndDndService } from 'projects/knd-drag-and-drop/src/public-api';
import { DemoType } from '../../models';
import { SelectableDirective } from 'projects/knd-drag-and-drop/src/lib/dnd/selectable.directive';
import { DraggableDirective } from 'projects/knd-drag-and-drop/src/lib/dnd/draggable.directive';

@Component({
  selector: 'cp-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
  standalone: true,
  hostDirectives: [{
    directive: SelectableDirective,
    inputs: ['kndItem'],
  },
  {
    directive: DraggableDirective,
    inputs: ['kndItem'],
  }],
})
export class DemoComponent {

  @Input({required: true }) item: DemoType

  private selectableDirective = inject(SelectableDirective, {self: true})

  selectItem() {
    this.selectableDirective.selectItem();
  }
  deSelectItem() {
    this.selectableDirective.deSelectItem();
  }
}
