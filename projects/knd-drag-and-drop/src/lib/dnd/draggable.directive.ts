import { Directive, ElementRef, HostBinding, HostListener, Inject, Input, OnInit, inject } from '@angular/core';
import { defaultKndDndConfig } from './dnd.provider';
import { KndDndService } from '../knd-dnd.service';
import { combineLatest } from 'rxjs';

@Directive({
  selector: '[kndDraggable]',
  standalone: true,
})
export class DraggableDirective<Item extends object> implements OnInit {

  @Input({ required: true }) kndItem: Item;
  // enables html dragging
  @HostBinding('draggable') draggable = true;
  @HostBinding(`class.${defaultKndDndConfig.dragIsDragging}`) private isDragging = false;

  private dndService = inject(KndDndService<Item>);
  
  @HostListener('dragstart', ['$event']) onDragStart(evt: DragEvent) {
    this.dndService.selectItem(this.kndItem);
    
    const dragUI = this.createDragUI();
    const dragUIRoot = document.documentElement;
    dragUIRoot.appendChild(dragUI);
    // HTML UI, x and y offset for cursor holding the UI
    evt.dataTransfer?.setDragImage(dragUI, 0, 0);
    // remove dragUI from DOM after it got picked up by setDragImage magic
    setTimeout((_: any) => dragUIRoot.removeChild(dragUI), 5);
    this.dndService.isDragging.next(true);

  }

  @HostListener('dragend', ['$event']) ondrop(_evt: DragEvent) {
    console.log('d-end')
    this.dndService.isDragging.next(false);
  }

  // has to be 1px 1px to have some UI
  createDragUI(): HTMLElement {
    const dragUI = document.createElement('div');
    // spawn drag UI outside of view -> otherwise it will pop up shortly on the UI
    // can we improve this now? retry since refactord to dnd V2
    dragUI.style.position = 'absolute';
    dragUI.style.zIndex = '-9999';

    dragUI.style.height = '10px';
    dragUI.style.width = '10px';
    dragUI.style.backgroundColor = 'green'; // 'transparent';
    return dragUI;
  }

  ngOnInit() {
    combineLatest([
      this.dndService.createHasItemObservable(this.kndItem),
      this.dndService.isDragging
    ]).subscribe(([isSelected, isDragging]) => this.isDragging = isSelected && isDragging)
  }
}
