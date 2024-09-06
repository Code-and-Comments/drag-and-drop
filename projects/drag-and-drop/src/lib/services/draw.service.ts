import { Subscription } from 'rxjs';
import { Injectable, Optional, Renderer2, RendererFactory2, inject } from '@angular/core';
import { Coordinates, dragUIZ } from '../dnd';
import { CursorService } from './cursor.service';
import { DND_CONFIG, defaultDndCssConfig } from '../dnd-configuration';

@Injectable()
export class DrawService<Item extends object> {

  private rendererFactory = inject(RendererFactory2);
  private cursorService = new CursorService();
  private renderer: Renderer2;
  private dragUI: HTMLDivElement;
  private dragElements: HTMLElement[] = [];
  private dragElementsMoveSub: Subscription;

  private dndConfig? = inject(DND_CONFIG, { optional: true});

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.dragUI = this.createDragUI();
    this.renderer.appendChild(document.documentElement, this.dragUI);
    this.cursorService.cursorPosition.subscribe(pos => this.moveDragUI(pos));
  }

  /**
   * Create DragUI which will be shown/hidden on drag events
  */
  private createDragUI(): HTMLDivElement {
    const dragUI = document.createElement('div');
    dragUI.style.position = 'absolute';
    dragUI.style.pointerEvents = 'none'; // otherwise the div breaks drag over
    dragUI.style.transition = 'opacity .25s linear';
    dragUI.style.opacity = '0';
    dragUI.style.zIndex = `${dragUIZ}`;
    dragUI.classList.add(defaultDndCssConfig.dragUI);
    return dragUI;
  }

  public moveDragUI(coords: Coordinates) {
    this.dragUI.style.top = `${coords.y}px`;
    this.dragUI.style.left = `${coords.x}px`;
  }

  public showDragUI(items?: Item[]) {
    if (this.dndConfig?.updateDragUI) this.dndConfig.updateDragUI(this.dragUI, items);
    else this.dragUI.innerHTML = (items) ? `${items.length}` : '';
    // timeout to move delay the actual call slightly to run after the cursor tracking
    setTimeout(() => this.dragUI.style.opacity = '100%');
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
    setTimeout(() => {
      this.dragElements.forEach(de => de.style.transform = 'scale(0.5)');
      this.dragElementsMoveSub = this.cursorService.cursorPosition.subscribe(cord => {
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