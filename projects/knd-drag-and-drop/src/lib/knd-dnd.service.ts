import { BehaviorSubject } from 'rxjs';

type Identifier = String

export class KndDndService<Item extends object> {

  private selectedItems = new BehaviorSubject(this.createEmptyMap());
  public selectedItems$ = this.selectedItems.asObservable();

  /**
   * Select uniquie identifiably property of Item.  
   * By default the property `id` is used
  */
  protected selectId: ((item: Item) => Identifier) = (item: Item) => {
    if (!Object.hasOwn(item, 'id')) {
      console.error(`
        KndDndService needs a unique identifier to work. 
        By default property "id", but could not be found in ${item}.
        Please override 'selectId' to select a different unique object property.
      `)
    }
    return (item as any).id as string
  }

  constructor() { }

  public selectItem(item: Item) {
    this.selectedItems.next(
      this.selectedItems
      .getValue()
      .set(this.selectId(item), item)
    );
  }

  public deSelectItem(item: Item) {
    const didDelete = this.selectedItems.getValue().delete(this.selectId(item));
    if (didDelete) {
      this.selectedItems.next(this.selectedItems.getValue());
    }
    else {
      console.error(`Unable to deselect item as it was not selected ${item}.`)
    }
  }

  public deSelectAll() {
    this.selectedItems.next(this.createEmptyMap());
  }

  private createEmptyMap(): Map<Identifier, Item> {
    return new Map<Identifier, Item>()
  }
}
