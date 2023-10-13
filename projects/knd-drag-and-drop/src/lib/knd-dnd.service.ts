import { BehaviorSubject, Observable, map } from 'rxjs';

type Identifier = String

export class KndDndService<Item extends object> {

  private selectedItems = new BehaviorSubject(this.createEmptyMap());
  /**
   * Full map of items in dnd context. The key of the map is defined via function `selectUniqueIdentifier`.  
   * By default the property `id` is used as key
  */
  public selectedItems$ = this.selectedItems.asObservable();

  private isDragging = new BehaviorSubject(false);
  /**
   * Tracks if a dragging process is currently ongoing  
   * `true` if is dragging, `false` if not
  */
  public isDragging$ = this.isDragging.asObservable();

  /**
   * Select uniquie identifiably property of Item.  
   * By default the property `id` is used
  */
  protected selectUniqueIdentifier: ((item: Item) => Identifier) = (item: Item) => {
    if (!Object.hasOwn(item, 'id')) {
      console.error(`
        KndDndService needs a unique identifier to work. 
        By default property "id", but could not be found in ${item}.
        Please override 'selectId' to select a different unique object property.
      `)
    }
    return (item as any).id as string
  }

  /**
   * Select an item, adds it to the dnd service context
   * @param item item to be added to the dnd conext
  */
  public selectItem(item: Item) {
    if (this.selectedItems.value.has(this.selectUniqueIdentifier(item))) {
      console.error(`Item ${item} is already selected`)
      return
    }
    this.selectedItems.next(
      this.selectedItems.value.set(this.selectUniqueIdentifier(item), item)
    );
  }

  /**
   * Deselect an item, removes it from the dnd context
   * @param item item to be removed from the dnd context
  */
  public deSelectItem(item: Item) {
    const didDelete = this.selectedItems.value.delete(this.selectUniqueIdentifier(item));
    if (didDelete) {
      this.selectedItems.next(this.selectedItems.value);
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
    console.log('All items have been deselected');
  }

  private createEmptyMap(): Map<Identifier, Item> {
    return new Map<Identifier, Item>()
  }
  /**
   * Creates an obserable that tracks if the given item is currently part of the dnd context.  
   * @returns Observable that is `true` if item is dnd context, `false` if not
  */
  public createHasItemObservable(item: Item): Observable<boolean> {
    return this.selectedItems$.pipe(map(items => items.has(this.selectUniqueIdentifier(item))));
  }
}
