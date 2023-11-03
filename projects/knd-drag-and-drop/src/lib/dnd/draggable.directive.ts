import { Directive, ElementRef, HostBinding, HostListener, Inject, Input, OnInit, inject } from '@angular/core';
import { defaultKndDndConfig, dragabbleZ } from './dnd.models';
import { KndDndService } from '../knd-dnd.service';
import { combineLatest } from 'rxjs';
import { KndDrawService } from '../knd-draw.service';

@Directive({
  selector: '[kndDraggable]',
  standalone: true,
})
export class DraggableDirective<Item extends object> implements OnInit {

  @Input({ required: true }) kndItem: Item;
  @HostBinding('draggable') draggable = true; // enables html dragging
  @HostBinding(`class.${defaultKndDndConfig.dragIsDragging}`) private currentElementIsDragging = false;

  private dndService = inject(KndDndService<Item>);
  private drawService = inject(KndDrawService<Item>);
  private elRef = inject(ElementRef);
  
  // TODO: move isDragging logic to dndService
  @HostListener('dragstart', ['$event']) private onDragStart(evt: DragEvent) {
    this.dndService.selectItem(this.kndItem);
    this.overrideBrowserDefaultDragUI(evt)
    this.dndService.isDragging.next(true);
  }

  @HostListener('dragend', ['$event']) private ondrop(_evt: DragEvent) {
    this.dndService.isDragging.next(false);
    this.drawService.dropAllDragElements();
  }

  /**
   * Overrides default browser dragUI. 
   * 
   * If not overriden the draggable element is displayed, if set to 0x0 div, drag does not works
  */
  private overrideBrowserDefaultDragUI(event: DragEvent) {
    const dragUI = this.createEmptyDragUI();
    const dragUIRoot = document.documentElement;
    dragUIRoot.appendChild(dragUI);
    event.dataTransfer?.setDragImage(dragUI, 0, 0);
    // remove dragUI from DOM after it got picked up by setDragImage magic
    setTimeout((_: any) => dragUIRoot.removeChild(dragUI));
  }

  /**
   * Creates 1x1 transparent div
  */
  private createEmptyDragUI(): HTMLElement {
    const dragUI = document.createElement('div');
    dragUI.style.position = 'absolute';
    dragUI.style.zIndex = '-9999';
    dragUI.style.height = '1px';
    dragUI.style.width = '1px';
    dragUI.style.backgroundColor = 'transparent';
    return dragUI;
  }

  ngOnInit() {
    combineLatest([
      this.dndService.createHasItemObservable(this.kndItem),
      this.dndService.isDragging
    ]).subscribe(([isSelected, isDragging]) => {
      this.currentElementIsDragging = isSelected && isDragging;
      if (this.currentElementIsDragging) this.drawService.animateElementForDrag(this.createAbsoluteClone());
    });
  }

  /**
   * Creates a clone absolut position at root exactly on top of the current item
   * 
   * This item will be used for the move to cusor animation
  */
  private createAbsoluteClone(): HTMLElement {
    const currentElement = this.elRef.nativeElement as HTMLElement;
    const currentElementPosition = currentElement.getBoundingClientRect();
    const clone = currentElement.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.pointerEvents = 'none'; // otherwise the div breaks drag over
    clone.style.zIndex = `${dragabbleZ}`;
    clone.style.top = `${currentElementPosition.top}px`;
    clone.style.left = `${currentElementPosition.left}px`;
    document.documentElement.prepend(clone);
    return clone
  }
}
