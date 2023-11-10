import { Component, Input, inject } from '@angular/core';
import { DemoType } from '../../models';
import { DraggableDirective, SelectableDirective } from 'projects/knd-drag-and-drop/src/public-api';

@Component({
  selector: 'cp-drag',
  templateUrl: './drag.component.html',
  styleUrls: ['./drag.component.scss'],
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
export class DragComponent {

  @Input({required: true }) item: DemoType
  private selectableDirective = inject(SelectableDirective, {self: true})

  selectItem() {
    this.selectableDirective.selectItem();
  }
  deSelectItem() {
    this.selectableDirective.deSelectItem();
  }
}
