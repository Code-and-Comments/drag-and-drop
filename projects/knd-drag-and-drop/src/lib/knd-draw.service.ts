import { BehaviorSubject } from 'rxjs';
import { EnvironmentInjector, Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';


@Injectable()
export class KndDrawService {

  private rendererFactory =  inject(RendererFactory2);
  private renderer: Renderer2;
  public cursorPosition = new BehaviorSubject<Coordinates>({ x: 0, y: 0});
  private dragUI: HTMLElement;

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    this.renderer.listen(window, 'dragover', (evt: DragEvent) => {
      if (this.cursorPosition.value.x == evt.clientX && this.cursorPosition.value.y == evt.clientY) return
      this.cursorPosition.next({ x: evt.clientX, y: evt.clientY })
      evt.preventDefault();
    });

    this.renderer.listen(window, 'mouseup', (evt: MouseEvent) => {
      console.log('hihi')
    });

    this.cursorPosition.subscribe(pos => console.log(pos));
    this.dragUI = this.createDragUI();
    this.cursorPosition.subscribe(pos => this.moveDragUI(pos));
  }

  private createDragUI(): HTMLElement {
    const dragUI = document.createElement('div');
    dragUI.style.position = 'absolute';
    dragUI.style.height = '100px';
    dragUI.style.width = '100px';
    dragUI.style.backgroundColor = 'blue';
    dragUI.style.pointerEvents = 'none'; // otherwise the div breaks drag over
    dragUI.style.transition = 'opacity .25s linear';
    dragUI.style.fontSize = '30px';
    // dragUI.style.opacity
    return dragUI;
  }

  private moveDragUI(coords: Coordinates) {
    this.dragUI.style.top = `${coords.y}px`;
    this.dragUI.style.left = `${coords.x}px`;
  }

  public drawDragUI(itemCount: number) {
    this.moveDragUI(this.cursorPosition.value);
    this.dragUI.innerHTML = `${itemCount}`;
    this.renderer.appendChild(document.documentElement, this.dragUI);
  }

  public removeDragUI() {
    this.renderer.removeChild(document.documentElement, this.dragUI);
  }
}

interface Coordinates {
  x: number;
  y: number;
}