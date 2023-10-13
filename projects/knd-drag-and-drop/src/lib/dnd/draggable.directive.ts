import { Directive, ElementRef, HostBinding, HostListener, Inject, Input, OnInit, inject } from '@angular/core';
import { idPropertyKey } from './dnd.module';
import { kndDndSettings } from './dnd.provider';

@Directive({
  selector: '[kndDraggable]'
})
export class DraggableDirective implements OnInit {
  @Input({ required: true }) dragItem: any;
  @HostBinding('draggable') draggable = true;

  private padding = 10;
  private elRef = inject(ElementRef);
  private dndSettings = kndDndSettings;

  @HostListener('dragstart', ['$event']) onDragStart(evt: DragEvent) {
    const selected = Array.from(document.getElementsByClassName(this.dndSettings.selectClass)) as HTMLElement[];

    // disable drag start on an element that is not selected
    // don't do that for no selected -> allow fast single drag
    if (!selected.includes(this.elRef.nativeElement) && selected.length !== 0) {
      evt.preventDefault();
      evt.stopPropagation();
      return;
    }

    const dragUI = this.createDragUI(selected);
    const dragUIRoot = document.documentElement;
    dragUIRoot.appendChild(dragUI);
    // HTML UI, x and y offset for cursor holding the UI
    evt.dataTransfer?.setDragImage(dragUI, 0, 0);
    // remove dragUI from DOM after it got picked up by setDragImage magic
    setTimeout((_: any) => dragUIRoot.removeChild(dragUI), 5);

    const ids = this.collectDragIds(selected);
    evt.dataTransfer?.setData(idPropertyKey, JSON.stringify(ids));
  }

  @HostListener('dragend', ['$event']) ondrop(_evt: DragEvent) {
    // console.log(evt.dataTransfer);
  }

  ngOnInit() {
    this.elRef.nativeElement.dataset.dragId = this.dragItem;
  }

  collectDragIds(selected: HTMLElement[]): string[] {
    const ids: string[] = [];

    if (selected.length === 0) {
      ids.push(this.dragItem);
    }

    selected.forEach(el => {
      const id = el.dataset.dragId;
      if (id != null) {
        ids.push(id);
      } else {
        throw new Error('Selected object did not set drag id');
      };
    });

    return ids;
  }

  createDragUI(selected: HTMLElement[]): HTMLElement {
    const dragUI = document.createElement('div');
    // spawn drag UI outside of view -> otherwise it will pop uo shortly on the UI
    dragUI.style.position = 'absolute';
    dragUI.style.zIndex = '-9999';

    let dragStack = selected.slice(0, 4);
    // check if drag start element is part of the dragStack already -> remove and add in front
    if (dragStack.includes(this.elRef.nativeElement)) {
      dragStack = dragStack.filter(el => el !== this.elRef.nativeElement);
    } else {
      // if not cut the dragstack to 3 anyway before adding the current on top
      dragStack = dragStack.slice(0, 3);
    }
    dragStack.push(this.elRef.nativeElement);

    dragStack.forEach((el, i) => {
      const elCP = this.updateStyleForDrag(el);
      // stack the images with an increasing padding on top of each other
      const padding = `${this.padding * i}px`;
      elCP.style.top = padding;
      elCP.style.left = padding;

      // don't show white spacer for back most image
      if (i !== 0) {
        elCP.style.boxShadow = '-5px -5px 0px -2px rgba(255,255,255,1)';
      }
      dragUI.appendChild(elCP);
    });
    dragUI.appendChild(this.createCountBubble(dragStack.length, selected.length));
    return dragUI;
  }

  private createCountBubble(dragStackCount: number, selectedCount: number): HTMLElement {
    const elementCountBubble = document.createElement('div');
    elementCountBubble.classList.add('kandela-draggable-bubble');
    // create bubble size
    const sideLength = 24;
    elementCountBubble.style.height = `${sideLength}px`;
    elementCountBubble.style.width = `${sideLength}px`;

    // calculate bubble position according to drag stack, starting point left is the first stack element width
    // others are explicitly created with the same size in updateStyleForDrag()!
    const elWidth = this.elRef.nativeElement.getBoundingClientRect().width;
    const inset = this.padding * (dragStackCount - 1);
    const left = elWidth + inset - sideLength/2;
    const top = inset - sideLength/2;

    elementCountBubble.style.left = `${left}px`;
    elementCountBubble.style.top = `${top}px`;

    // explicitly handle fast single drag and set count to one
    if (selectedCount === 0) {
      elementCountBubble.innerText = '1';
    } else {
      elementCountBubble.innerText = `${selectedCount}`;
    }
    return elementCountBubble;
  }

  private updateStyleForDrag(element: HTMLElement): HTMLElement {
    const dragStartElementRect = this.elRef.nativeElement.getBoundingClientRect();
    const elCP = element.cloneNode(true) as HTMLElement;
    // explicitly set all images to the exact same size for better looking UI
    elCP.style.width = `${dragStartElementRect.width}px`;
    elCP.style.height = `${dragStartElementRect.height}px`;
    elCP.style.position = 'absolute';
    elCP.classList.remove(this.dndSettings.selectClass);
    elCP.classList.add(this.dndSettings.dragClass);
    return elCP;
  }
}
