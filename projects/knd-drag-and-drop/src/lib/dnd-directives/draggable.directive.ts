import { Directive, ElementRef, HostBinding, HostListener, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { KndItemState, dragabbleZ } from '../dnd';
import { KndDndService } from '../services/knd-dnd.service';
import { Observable, Subject, map, pairwise, startWith, takeUntil } from 'rxjs';
import { defaultKndDndCssConfig } from '../knd-dnd-configuration';

@Directive({
  selector: '[kndDraggable]',
  standalone: true,
})
export class DraggableDirective<Item extends object> implements OnInit, OnDestroy {
  @Input() kndItem: Item;
  @HostBinding('draggable') private draggable = true; // enables html dragging
  @HostBinding(`class.${defaultKndDndCssConfig.dragIsDragging}`) private currentElementIsDragging = false;
  private destroy$ = new Subject<void>()

  private dndService = inject(KndDndService<Item>);
  private elRef = inject(ElementRef);
  private itemState: Observable<KndItemState>
  
  @HostListener('dragstart', ['$event']) private onDragStart(evt: DragEvent) {
    this.dndService.selectItem(this.kndItem);
    this.overrideBrowserDefaultDragUiInvisible(evt);
    this.dndService.startDragging();
  }

  @HostListener('dragend', ['$event']) private ondrop(_evt: DragEvent) {
    this.dndService.stopDragging();
  }

  /**
   * Overrides default browser dragUI to a non visible one 
   * 
   * If not overriden the draggable element is displayed,  
   * If set to 0x0 div, drag does not works
  */
  private overrideBrowserDefaultDragUiInvisible(event: DragEvent) {
    const dragUI = this.createEmptyDragUI();
    const dragUIRoot = document.documentElement;
    dragUIRoot.appendChild(dragUI);
    event.dataTransfer?.setDragImage(dragUI, 0, 0);
    // remove dragUI from DOM after it got picked up by setDragImage magic
    setTimeout(() => dragUIRoot.removeChild(dragUI));
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
    this.itemState = this.dndService.createItemStateObservable(this.kndItem);
    this.itemState.pipe(
      takeUntil(this.destroy$),
      map(state => state.isDragging),
      startWith(false),
      pairwise(),
    ).subscribe(([prev, curr]) => {
      if (prev == false && curr == true) {
        this.dndService.initDragAnimation(this.createAbsoluteClone());
      }
    });
    this.itemState.pipe(
      takeUntil(this.destroy$)
    ).subscribe(itemState => this.currentElementIsDragging = itemState.isDragging);  
  }

  ngOnDestroy() {
    this.destroy$.next();
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
