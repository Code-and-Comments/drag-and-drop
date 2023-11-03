import { BehaviorSubject, Observable, ReplaySubject, Subject, combineLatest, map, take } from 'rxjs';
import { Injectable, QueryList, Renderer2, RendererFactory2, inject } from '@angular/core';
import { KndDrawService } from './knd-draw.service';
import { KndIdentifier } from './dnd/dnd.models';
import { SelectableDirective } from './dnd/selectable.directive';

@Injectable()
export class KndDndService<Item extends object> {
  private rendererFactory = inject(RendererFactory2);
  private renderer: Renderer2;
  private drawService =  inject(KndDrawService);
  private selectedItems = new BehaviorSubject(this.createEmptyMap());
  private shiftIsActive = new BehaviorSubject(false);
  private latestSelectedItem: Item | null;

  public selectables = new ReplaySubject<QueryList<SelectableDirective<Item>>>(1);

  /**
   * Full map of items in dnd context. The key of the map is defined via function `selectUniqueIdentifier`.  
   * By default the property `id` is used as key
  */
  public selectedItems$ = this.selectedItems.asObservable();
  /**
   * Tracks if shiftSelect should be active currently
  */
  public shiftSelectActive: Observable<boolean>;
  /**
   * Tracks if a dragging process is currently ongoing  
   * `true` if is dragging, `false` if not
   * 
   * TODO: set via renderer instead from draggable?
  */
  public isDragging = new BehaviorSubject(false);

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.trackKeys();

    // control dragUI
    this.isDragging.subscribe(isDragging => {
      if (isDragging) this.drawService.showDragUI([...this.selectedItems.value.values()]);
      else this.drawService.hideDragUI();
    });
  }

  private trackKeys() {
    this.renderer.listen(window, 'keydown', (evt: KeyboardEvent) => {
      if (evt.shiftKey) this.shiftIsActive.next(true);
      if ((evt.key === 'Escape' || evt.key === 'Esc')) this.deSelectAll();
    });

    this.renderer.listen(window, 'keyup', (evt: KeyboardEvent) => {
      if (!evt.shiftKey) this.shiftIsActive.next(false);
    });
    
    this.shiftSelectActive = combineLatest([this.shiftIsActive, this.selectedItems]).pipe(
      map(([shiftIsActive, items]) => items.values.length > 0 && shiftIsActive)
    );
  }

  /**
   * Select uniquie identifiably property of Item.  
   * By default the property `id` is used
  */
  public selectUniqueIdentifier: ((item: Item) => KndIdentifier) = (item: Item) => {
    if (!Object.hasOwn(item, 'id')) {
      console.error(`
        KndDndService needs a unique identifier to work. 
        By default property "id", but could not be found in ${item}.
        Please override 'selectId' to select a different unique object property.
      `)
    }
    return (item as any).id as KndIdentifier
  }

  /**
   * Select an item, adds it to the dnd service context
   * @param item item to be added to the dnd conext
  */
  public selectItem(item: Item) {
    if (this.selectedItems.value.has(this.selectUniqueIdentifier(item))) {
      console.info(`Item ${item} is already selected`)
      return
    }
    
    if (this.shiftIsActive.value && this.latestSelectedItem) this.selectItemShift(item, this.latestSelectedItem);
    else this.selectItemSingle(item);

    this.latestSelectedItem = item;
  }

  private selectItemSingle(item: Item) {
    this.selectedItems.next(
      this.selectedItems.value.set(this.selectUniqueIdentifier(item), item)
    );
  }

  private selectItemShift(item: Item, latestSelectedItem: Item) {
    this.selectables.pipe(take(1)).subscribe(selectables => {
      const arr = selectables.toArray().map(s => s.kndItem);
      const currentIndex = arr.indexOf(item);
      const latestSelectedIndex = arr.indexOf(latestSelectedItem);
      
      const start = currentIndex > latestSelectedIndex ? latestSelectedIndex : currentIndex;
      const end = currentIndex > latestSelectedIndex ?  currentIndex : latestSelectedIndex;
      
      for (let i = start; i <= end; i++) {
        // latestSelectedIndex already selected -> skip
        if (i == latestSelectedIndex) continue;
        this.selectItemSingle(arr[i]);
      }
    });
  }

  // private setClass

  /**
   * Deselect an item, removes it from the dnd context
   * @param item item to be removed from the dnd context
  */
  public deSelectItem(item: Item) {
    const didDelete = this.selectedItems.value.delete(this.selectUniqueIdentifier(item));
    if (didDelete) {
      this.selectedItems.next(this.selectedItems.value);
      this.latestSelectedItem = null;
    }
    else {
      console.error(`Unable to deselect item as it was not selected ${item}.`)
    }
  }

  /**
   * Deselect all item, Removes all items from the dnd context
  */
  public deSelectAll() {
    this.selectedItems.next(this.createEmptyMap());
    this.latestSelectedItem = null;
    console.log('All items have been deselected');
  }

  private createEmptyMap(): Map<KndIdentifier, Item> {
    return new Map<KndIdentifier, Item>()
  }

  /**
   * Creates an obserable that tracks if the given item is currently part of the dnd context.  
   * @returns Observable that is `true` if item is dnd context, `false` if not
  */
  public createHasItemObservable(item: Item): Observable<boolean> {
    return this.selectedItems$.pipe(map(items => items.has(this.selectUniqueIdentifier(item))));
  }
}