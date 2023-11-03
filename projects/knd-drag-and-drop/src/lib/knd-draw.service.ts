import { BehaviorSubject, Subscription } from 'rxjs';
import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';
import { Coordinates, defaultKndDndConfig, dragUIZ } from './dnd/dnd.models';

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
    this.trackCursor()
    this.dragUI = this.createDragUI();
    this.renderer.appendChild(document.documentElement, this.dragUI);
  }

  private trackCursor() {
    this.renderer.listen(window, 'mousemove', (evt: MouseEvent) => {
      this.updateCursorPosition(evt);
    });
    this.renderer.listen(window, 'dragover', (evt: DragEvent) => {
      evt.preventDefault(); // cancels dragend animation
      this.updateCursorPosition(evt);
    });
    this.cursorPosition.subscribe(pos => this.moveDragUI(pos));
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
    dragUI.style.pointerEvents = 'none'; // otherwise the div breaks drag over
    dragUI.style.transition = 'opacity .25s linear';
    dragUI.style.opacity = '0';
    dragUI.style.zIndex = `${dragUIZ}`;
    dragUI.classList.add(defaultKndDndConfig.dragUI);
    return dragUI;
  }

  private moveDragUI(coords: Coordinates) {
    this.dragUI.style.top = `${coords.y}px`;
    this.dragUI.style.left = `${coords.x}px`;
  }

  public showDragUI(items?: Item[]) {
    this.dragUI.innerHTML = (items) ? `${items.length}` : '';
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