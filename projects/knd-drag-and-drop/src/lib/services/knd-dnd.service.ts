import { BehaviorSubject, Observable, ReplaySubject, combineLatest, filter, map, shareReplay, take, tap } from 'rxjs';
import { Injectable, QueryList, Renderer2, RendererFactory2, inject } from '@angular/core';
import { KndDrawService } from './knd-draw.service';
import { KndIdentifier, KndItemState, KndMap, createEmptyKndMap, itemsInBetween } from '../dnd';
import { SelectableDirective } from '../dnd-directives/selectable.directive';
import { KNDDND_CONFIG } from '../knd-dnd-configuration';

@Injectable()
export class KndDndService<Item extends object> {

  private rendererFactory = inject(RendererFactory2);
  private renderer: Renderer2;
  private drawService = new KndDrawService();

  private _selectedItems = new BehaviorSubject(new Map<KndIdentifier, Item>());
  selectedItems = this._selectedItems.pipe(map(map => Array.from(map.values())));
  private shiftIsActive = new BehaviorSubject(false);
  private latestSelectedItem = new BehaviorSubject<Item | null>(null);
  private latestHoveredItem = new BehaviorSubject<Item | null>(null);
  private isDragging = new BehaviorSubject(false);

  private itemStates: Observable<KndMap<Item>>;
  private availableSelectables = new BehaviorSubject<Item[]>([]);
  
  private dndConfig? = inject(KNDDND_CONFIG, { optional: true});

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(window, null);
    this.initTrackKeys();
    this.initTrackItemStates();

    this.isDragging.subscribe(isDragging => {
      if (isDragging) this.drawService.showDragUI([...this._selectedItems.value.values()]);
      else this.drawService.hideDragUI();
    });

    if (this.dndConfig?.debug) this.setupDebugLogging();
  }

  private setupDebugLogging() {
    this.shiftIsActive.subscribe(shiftActice => console.log('shiftIsActive', shiftActice));
    this.latestHoveredItem.subscribe(item => this.logItem('latestHoveredItem', item));
    this.latestSelectedItem.subscribe(item => this.logItem('latestSelectedItem', item));
    this.availableSelectables.subscribe(items => this.logItemArray('availableSelectables', items));
  }

  private initTrackKeys() {
    this.renderer.listen(window, 'keydown', (evt: KeyboardEvent) => {
      if (evt.shiftKey && this.shiftIsActive.value != true) this.shiftIsActive.next(true);
      if ((evt.key === 'Escape' || evt.key === 'Esc')) this.deSelectAll();
    });

    this.renderer.listen(window, 'keyup', (evt: KeyboardEvent) => {
      if (!evt.shiftKey && this.shiftIsActive.value != false) this.shiftIsActive.next(false);
    });
  }
  
  setAvailableSelectables(queryList: QueryList<SelectableDirective<Item>>) {
    this.availableSelectables.next(queryList.toArray().map(s => s.kndItem));
  }

  /**
   * Select uniquie identifiably property of Item.  
   * By default the property `id` is used
  */
  private selectUniqueIdentifier: ((item: Item) => KndIdentifier) = (item: Item) => {
    if (this.dndConfig?.selectUniqueIdentifier) {
      const id = this.dndConfig.selectUniqueIdentifier(item);
      if (id == null) { 
        console.error(`Custom selectUniqueIdentifier returned null/undefined, please always return a value.`);
      }
      return id;
    }
    if (!Object.hasOwn(item, 'id')) {
      console.error(`
        KndDndService needs a unique identifier to work. 
        By default property "id", but could not be found in ${item}.
        Please implement and inject the 'selectUniqueIdentifier' method to select a different unique object property.
        This can be done via the KNDDND_CONFIG injection token by implementing the KndDndConfig interface
      `)
    }
    return (item as any).id as KndIdentifier;
  }

  private initTrackItemStates() {
    this.itemStates = combineLatest([this.availableSelectables, this._selectedItems, this.shiftIsActive, this.latestHoveredItem, this.latestSelectedItem, this.isDragging]).pipe(
      map(([allSelectables, selectedItems, shiftIsActive, latestHoveredItem, latestSelectedItem, isDragging]) => {
        const map = createEmptyKndMap<Item>();

        // create entries for all existing selectables
        allSelectables.forEach(item => {
          const id = this.selectUniqueIdentifier(item);
          const state: KndItemState = { isDragging: false, isShiftHovered: false, isSelected: false }
          map.set(id, { item, state })
        })

        // update selected state for all entries
        selectedItems.forEach(selItem => {
          const id = this.selectUniqueIdentifier(selItem);
          const stateItem = map.get(id); // retrieves a ref
          if (stateItem) stateItem!.state.isSelected = true;
        })

        // shift hover
        if (shiftIsActive && latestHoveredItem && latestSelectedItem) {
          const shouldShiftSelect = itemsInBetween(allSelectables, latestHoveredItem, latestSelectedItem);
          if (this.dndConfig?.debug) this.logItemArray('shouldShiftSelect', shouldShiftSelect)
          shouldShiftSelect.forEach(shouldShiftSelectItem => {
            const id = this.selectUniqueIdentifier(shouldShiftSelectItem);
            const stateItem = map.get(id); // retrieves a ref
            stateItem!.state.isShiftHovered = true;
          });
        }

        // check if item isDragging
        if (isDragging) {
          selectedItems.forEach(selectedItem => {
            const id = this.selectUniqueIdentifier(selectedItem);
            const stateItem = map.get(id);
            if (stateItem) stateItem.state.isDragging = true;
          })
        }

        return map;
      }),
      shareReplay(1),
    )
  }

  /**
   * Select an item, adds it to the dnd service context
   * @param item item to be added to the dnd conext
   * 
   * automatically detects and select shift select items
  */
  selectItem(item: Item) {
    if (this._selectedItems.value.has(this.selectUniqueIdentifier(item))) {
      if (this.dndConfig?.debug) {
        console.info(`Item ${item} is already selected`)
      }
      return
    }
    
    if (this.shiftIsActive.value && this.latestSelectedItem.value) this.shiftSelectItems();
    else this.selectItemSingle(item);

    this.latestSelectedItem.next(item);
  }

  private selectItemSingle(item: Item) {
    this._selectedItems.next(
      this._selectedItems.value.set(this.selectUniqueIdentifier(item), item)
    );
  }

  private shiftSelectItems() {
    this.itemStates.pipe(
      take(1),
      map(items => Array.from(items.values())),
      map(items => items.filter(item => item.state.isShiftHovered && !item.state.isSelected)),
      map(items => items.map(i => i.item)),
    ).subscribe(items => items.forEach(s => this.selectItemSingle(s)));
  }

  /**
   * Deselect an item, removes it from the dnd context
   * @param item to be removed from the dnd context
  */
  deSelectItem(item: Item) {
    const didDelete = this._selectedItems.value.delete(this.selectUniqueIdentifier(item));
    if (didDelete) {
      this._selectedItems.next(this._selectedItems.value);
      this.latestSelectedItem.next(null);
    }
    else {
      console.error(`Unable to deselect item as it was not selected ${item}.`)
    }
  }

  /**
   * Inform dnd service that dragging was started
  */
  startDragging() {
    if (this.isDragging.value != true) this.isDragging.next(true);
  }

  /**
   * Inform dnd service that dragging has ended
  */
  stopDragging() {
    if (this.isDragging.value != false) {
      this.isDragging.next(false);
      this.drawService.dropAllDragElements();
    } 
  }

  /**
   * Start drag animation
   * @param element HTMLElement that should be animated
  */
  initDragAnimation(element: HTMLElement) {
    this.drawService.animateElementForDrag(element);
  }

  /**
   * Remember which items is currently hovered - for shift select logic
   * @param item which is hovered
  */
  hoverItem(item: Item) {
    if (this.latestHoveredItem.value != item) this.latestHoveredItem.next(item);
  }

  /**
   * Reset hovering if item is not hovered anymore - for shift select logic
  */
  resetHoverItem() {
    if (this.latestHoveredItem.value != null) this.latestHoveredItem.next(null);
  }

  /**
   * Deselect all item, Removes all items from the dnd context
  */
  deSelectAll() {
    this._selectedItems.next(new Map<KndIdentifier, Item>());
    this.latestSelectedItem.next(null);
    if (this.dndConfig?.debug == true) {
      console.log('All items have been deselected');
    }
  }

  /**
   * Deselect all item, Removes all items from the dnd context
  */
  getAllSelectedItems(): Item[] {
    return Array.from(this._selectedItems.value.values());
  }

  /**
   * Creates an observable for the state of an item in the current context
   * @return Observable of item state `KndItemState`
  */
  createItemStateObservable(item: Item): Observable<KndItemState> {
    return this.itemStates.pipe(
      map(items => items.get(this.selectUniqueIdentifier(item))?.state as KndItemState),
      filter(i => i != null),
    );
  }

  /**
   * Helper function to log item
   * used for debug mode
  */
  private logItem(label: string, item: Item | null) {
    const logOutput = item == null ? item : this.selectUniqueIdentifier(item);
    console.log(label, logOutput);
  }
  
  /**
   * Helper function to log item array
   * used for debug mode
  */
  private logItemArray(label: string, items: Item[]) {
    console.log(label, items.map(this.selectUniqueIdentifier));
  }

}