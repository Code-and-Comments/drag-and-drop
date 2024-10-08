import { AfterViewInit, Component, ContentChildren, Input, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChildren, inject } from '@angular/core';
import { SelectableDirective } from '../dnd-directives/selectable.directive';
import { DndService } from '../services/dnd.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'drag-wrapper',
  templateUrl: './drag-wrapper.component.html',
  styleUrls: ['./drag-wrapper.component.scss'],
  standalone: true,
})
export class DragWrapperComponent<Item extends object> implements AfterViewInit, OnDestroy {
  @ContentChildren(SelectableDirective) selectables: QueryList<SelectableDirective<Item>>;
  private dndService = inject(DndService<Item>);
  private sub: Subscription

  ngAfterViewInit() {
    // update current available items in dnd service
    this.dndService.setAvailableSelectables(this.selectables);
    
    this.sub = this.selectables.changes.subscribe(selectables =>
      this.dndService.setAvailableSelectables(selectables)
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}
