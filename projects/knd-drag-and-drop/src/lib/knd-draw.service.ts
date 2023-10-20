import { BehaviorSubject } from 'rxjs';
import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';
import { Coordinates } from './dnd/dnd.models';

@Injectable()
export class KndDrawService<Item extends object> {

  private rendererFactory =  inject(RendererFactory2);
  private renderer: Renderer2;
  private dragUI: HTMLElement;
  private cursorPosition = new BehaviorSubject<Coordinates>({ x: 0, y: 0});

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.trackDragginCursor()
    this.dragUI = this.createDragUI();
    this.renderer.appendChild(document.documentElement, this.dragUI);
    this.cursorPosition.subscribe(pos => this.moveDragUI(pos));
  }

  private trackDragginCursor() {
    this.renderer.listen(window, 'dragover', (evt: DragEvent) => {
      evt.preventDefault(); // cancels dragend animation
      if (this.cursorPosition.value.x == evt.clientX && this.cursorPosition.value.y == evt.clientY) return
      this.cursorPosition.next({ x: evt.clientX, y: evt.clientY })
    });
  }
  /**
   * Create DragUI which will be shown/hidden on drag events
  */
  private createDragUI(): HTMLElement {
    const dragUI = document.createElement('div');
    dragUI.style.position = 'absolute';
    dragUI.style.height = '40px';
    dragUI.style.width = '200px';
    dragUI.style.backgroundColor = 'white';
    dragUI.style.borderRadius = '8px';
    dragUI.style.boxShadow = '10px 10px 29px -2px rgba(0,0,0,0.75)';
    dragUI.style.border = '1px solid gray';
    dragUI.style.pointerEvents = 'none'; // otherwise the div breaks drag over
    dragUI.style.transition = 'opacity .25s linear';
    dragUI.style.fontSize = '30px';
    dragUI.style.opacity = '0';
    dragUI.style.textAlign = 'center';
    return dragUI;
  }

  private moveDragUI(coords: Coordinates) {
    this.dragUI.style.top = `${coords.y}px`;
    this.dragUI.style.left = `${coords.x}px`;
  }

  public showDragUI(items?: Item[]) {
    if (items) this.dragUI.innerHTML = `${items.length}`;
    else this.dragUI.innerHTML = '';
    // timeout to move delay the actual call slightly to run after the cursor tracking
    setTimeout((_: any) => this.dragUI.style.opacity = '100%');
  }
  
  public hideDragUI() {
    this.dragUI.style.opacity = '0';
  }
}