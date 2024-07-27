import { Component, Input, inject } from '@angular/core';
import { DraggableDirective, SelectableDirective } from 'projects/knd-drag-and-drop/src/public-api';
import { DemoType } from '../app.component';

@Component({
  selector: 'cp-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
})
export class ModalComponent { }
