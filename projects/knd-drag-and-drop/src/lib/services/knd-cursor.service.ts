import { BehaviorSubject } from 'rxjs';
import { Renderer2, RendererFactory2, inject } from '@angular/core';
import { Coordinates } from '../dnd';

export class KndCursorService {

  private rendererFactory = inject(RendererFactory2);
  private renderer: Renderer2;
  private cursorPositionInternal = new BehaviorSubject<Coordinates>({ x: 0, y: 0});

  /**
   * Current cursor position, also tracked while dragging
  */
  public cursorPosition = this.cursorPositionInternal.asObservable();

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.initTrackCursor();
  }

  private initTrackCursor() {
    this.renderer.listen(window, 'mousemove', (evt: MouseEvent) => {
      this.updateCursorPosition(evt);
    });
    this.renderer.listen(window, 'dragover', (evt: DragEvent) => {
      evt.preventDefault(); // cancels dragend animation
      this.updateCursorPosition(evt);
    });
  }

  private updateCursorPosition(evt: MouseEvent | DragEvent) {
    if (this.cursorPositionInternal.value.x == evt.clientX && this.cursorPositionInternal.value.y == evt.clientY) return
    this.cursorPositionInternal.next({ x: evt.clientX, y: evt.clientY })
  }
}