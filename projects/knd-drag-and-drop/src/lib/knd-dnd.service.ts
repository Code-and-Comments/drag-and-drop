import { BehaviorSubject, Observable, ReplaySubject, Subject, combineLatest, filter, map, take } from 'rxjs';
import { Injectable, QueryList, Renderer2, RendererFactory2, inject } from '@angular/core';
import { KndDrawService } from './knd-draw.service';
import { KndIdentifier, createEmptyMap, itemsInBetween } from './dnd/dnd.models';
import { SelectableDirective } from './dnd/selectable.directive';

@Injectable()
export class KndDndService<Item extends object> {
  private rendererFactory = inject(RendererFactory2);
  private renderer: Renderer2;
  private drawService =  inject(KndDrawService);
  private selectedItems = new BehaviorSubject(createEmptyMap<Item>());
  private shiftIsActive = new BehaviorSubject(false);
  private latestSelectedItem = new BehaviorSubject<Item | null>(null);
  private latestHoveredItem = new BehaviorSubject<Item | null>(null);
  private hoveredItems = new BehaviorSubject(createEmptyMap<Item>());

  public allAvailableSelectables = new ReplaySubject<QueryList<SelectableDirective<Item>>>(1);

  /**
   * Full map of items in dnd context. The key of the map is defined via function `selectUniqueIdentifier`.  
   * By default the property `id` is used as key
  */
  public selectedItems$ = this.selectedItems.asObservable();
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

    this.shiftIsActive.subscribe(s => console.log('shift', s));

    combineLatest([this.shiftIsActive, this.latestHoveredItem, this.latestSelectedItem])
    .subscribe(([shiftIsActive, latestHoveredItem, latestSelectedItem]) => {
      
      if (shiftIsActive && latestHoveredItem && latestSelectedItem) {
        console.log('hover');
        this.shiftHoverItems(latestHoveredItem, latestSelectedItem)
      }
      else {
        console.log('reset hover');
        this.hoveredItems.next(createEmptyMap<Item>());
      }
    });
  }
 
  /**
   * Select uniquie identifiably property of Item.  
   * By default the property `id` is used
  */
  protected selectUniqueIdentifier: ((item: Item) => KndIdentifier) = (item: Item) => {
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
    
    const latestSelectedItem = this.latestSelectedItem.value
    if (this.shiftIsActive.value && latestSelectedItem) this.shiftSelectItems(item, latestSelectedItem);
    else this.selectItemSingle(item);

    this.latestSelectedItem.next(item);
  }

  private selectItemSingle(item: Item) {
    this.selectedItems.next(
      this.selectedItems.value.set(this.selectUniqueIdentifier(item), item)
    );
  }

  private shiftHoverItems(latestSelectedItem: Item, hoveredItem: Item) {
    this.allAvailableSelectables.pipe(
      take(1),
      map(selectables => selectables.toArray().map(s => s.kndItem)),
      map(kndItemArray => itemsInBetween(kndItemArray, hoveredItem, latestSelectedItem))
    ).subscribe(hovers => {
      hovers.forEach(h => 
        this.hoveredItems.next(
          this.hoveredItems.value.set(this.selectUniqueIdentifier(h), h)
        )
      );
    });
  }

  private shiftSelectItems(currentItem: Item, latestSelectedItem: Item) {
    this.allAvailableSelectables.pipe(
      take(1),
      map(selectables => selectables.toArray().map(s => s.kndItem)),
      map(kndItemArray => itemsInBetween(kndItemArray, latestSelectedItem, currentItem))
    ).subscribe(selectables => {
      selectables.forEach(s => this.selectItemSingle(s));
    });
  }

  /**
   * Deselect an item, removes it from the dnd context
   * @param item item to be removed from the dnd context
  */
  public deSelectItem(item: Item) {
    const didDelete = this.selectedItems.value.delete(this.selectUniqueIdentifier(item));
    if (didDelete) {
      this.selectedItems.next(this.selectedItems.value);
      this.latestSelectedItem.next(null);
    }
    else {
      console.error(`Unable to deselect item as it was not selected ${item}.`)
    }
  }

  public hoverItem(item: Item) {
    if (this.latestHoveredItem.value != item) this.latestHoveredItem.next(item);
  }

  public resetHoverItem() {
    if (this.latestHoveredItem.value != null) this.latestHoveredItem.next(null);
  }

  /**
   * Deselect all item, Removes all items from the dnd context
  */
  public deSelectAll() {
    this.selectedItems.next(createEmptyMap<Item>());
    this.latestSelectedItem.next(null);
    console.log('All items have been deselected');
  }

  /**
   * Creates an obserable that tracks if the given item is currently part of the dnd context.
   * @return Observable that is `true` if item is dnd context, `false` if not
  */
  public createIsSelectedObservable(item: Item): Observable<boolean> {
    return this.selectedItems$.pipe(map(items => items.has(this.selectUniqueIdentifier(item))));
  }

  /**
   * Creates an obserable that tracks if the given item is currently part of the dnd context.
   * @return Observable that is `true` if item is dnd context, `false` if not
  */
  public createIsHoveringObservable(item: Item): Observable<boolean> {
    return this.hoveredItems.pipe(map(items => items.has(this.selectUniqueIdentifier(item))));
  }
}