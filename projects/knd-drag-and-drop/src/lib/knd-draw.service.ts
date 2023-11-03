import { BehaviorSubject, Subscription } from 'rxjs';
import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';
import { Coordinates, dragUIZ } from './dnd/dnd.models';

@Injectable()
export class KndDrawService<Item extends object> {

  private rendererFactory = inject(RendererFactory2);
  private renderer: Renderer2;
  private dragUI: HTMLElement;
  private cursorPosition = new BehaviorSubject<Coordinates>({ x: 0, y: 0});
  private dragElements: HTMLElement[] = [];
  private dragElementsMoveSub: Subscription;

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.trackDragginCursor()
    this.dragUI = this.createDragUI();
    this.renderer.appendChild(document.documentElement, this.dragUI);
    this.cursorPosition.subscribe(pos => this.moveDragUI(pos));
  }

  private trackDragginCursor() {
    this.renderer.listen(window, 'mousemove', (evt: MouseEvent) => {
      this.updateCursorPosition(evt);
    });
    this.renderer.listen(window, 'dragover', (evt: DragEvent) => {
      evt.preventDefault(); // cancels dragend animation
      this.updateCursorPosition(evt);
    });
  }

  private updateCursorPosition(evt: MouseEvent | DragEvent) {
    if (this.cursorPosition.value.x == evt.clientX && this.cursorPosition.value.y == evt.clientY) return
    this.cursorPosition.next({ x: evt.clientX, y: evt.clientY })
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
    dragUI.style.zIndex = `${dragUIZ}`;
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

  public dropAllDragElements() {
    this.dragElements.forEach(el => document.documentElement.removeChild(el));
    this.dragElements = [];
    this.dragElementsMoveSub.unsubscribe();
  }

  public animateElementForDrag(element: HTMLElement) {
    this.dragElements.push(element);
    element.style.transition = 'all .1s linear';
    // slightly to not override the inital position, but just right after
    setTimeout((_: any) => {
      this.dragElements.forEach(de => de.style.transform = 'scale(0.5)');
      this.dragElementsMoveSub = this.cursorPosition.subscribe(cord => {
        this.dragElements.forEach(de => {
          de.style.top = `${cord.y}px`;
          de.style.left = `${cord.x}px`;
        });
      });
    });
    // The time below fits well with a .1s transition
    setTimeout(() => {
      this.dragElements.forEach(de => de.style.display = 'none');
    }, 300);
  }
}