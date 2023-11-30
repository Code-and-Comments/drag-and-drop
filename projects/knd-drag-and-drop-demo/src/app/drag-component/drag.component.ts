import { Component, Input, inject } from '@angular/core';
import { DraggableDirective, SelectableDirective } from 'projects/knd-drag-and-drop/src/public-api';
import { DemoType } from '../app.component';

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

  @Input() item: DemoType;
  private selectableDirective = inject(SelectableDirective, {self: true});

  selectItem() {
    this.selectableDirective.selectItem();
  }
  deSelectItem() {
    this.selectableDirective.deSelectItem();
  }
}
