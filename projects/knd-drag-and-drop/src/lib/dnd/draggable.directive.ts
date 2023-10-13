import { Directive, ElementRef, HostBinding, HostListener, Inject, Input, OnInit, inject } from '@angular/core';
import { defaultKndDndConfig } from './dnd.provider';
import { KndDndService } from '../knd-dnd.service';

@Directive({
  selector: '[kndDraggable]',
  standalone: true,
})
export class DraggableDirective<Item extends object> {
  @Input({ required: true }) kndItem: Item;
  // enables html dragging
  @HostBinding('draggable') draggable = true;

  private dndSettings = defaultKndDndConfig;
  private dndService = inject(KndDndService<Item>);
  
  @HostListener('dragstart', ['$event']) onDragStart(evt: DragEvent) {
    const dragUI = this.createDragUI();
    const dragUIRoot = document.documentElement;
    dragUIRoot.appendChild(dragUI);
    // HTML UI, x and y offset for cursor holding the UI
    evt.dataTransfer?.setDragImage(dragUI, 0, 0);
    // remove dragUI from DOM after it got picked up by setDragImage magic
    setTimeout((_: any) => dragUIRoot.removeChild(dragUI), 5);

    // evt.dataTransfer?.setData('', JSON.stringify(ids));
  }

  @HostListener('dragend', ['$event']) ondrop(_evt: DragEvent) {
    console.log('dragend');
  }

  createDragUI(): HTMLElement {
    const dragUI = document.createElement('div');
    // spawn drag UI outside of view -> otherwise it will pop up shortly on the UI
    // can we improve this now? retry since refactord to dnd V2
    dragUI.style.position = 'absolute';
    dragUI.style.zIndex = '-9999';

    dragUI.style.height = '20px';
    dragUI.style.width = '100px';
    dragUI.style.backgroundColor = 'green';
    return dragUI;
  }
}
