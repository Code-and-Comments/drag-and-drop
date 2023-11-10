import { Component, Input } from '@angular/core';
import { DropableDirective } from 'projects/knd-drag-and-drop/src/public-api';

@Component({
  selector: 'cp-drop',
  templateUrl: './drop.component.html',
  styleUrls: ['./drop.component.scss'],
  standalone: true,
  hostDirectives: [{
    directive: DropableDirective,
    inputs: ['kndDropId'],
    outputs: ['gotDropped']
  }],
})
export class DropComponent {

  @Input({ required: true }) kndDropId: string;
}
