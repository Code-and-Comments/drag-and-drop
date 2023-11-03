import { AfterViewInit, Component, ContentChildren, Input, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChildren, inject } from '@angular/core';
import { SelectableDirective } from '../dnd/selectable.directive';
import { KndDndService } from '../knd-dnd.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'knd-drag-wrapper',
  templateUrl: './drag-wrapper.component.html',
  styleUrls: ['./drag-wrapper.component.scss'],
  standalone: true,
})
export class DragWrapperComponent<Item extends object> implements AfterViewInit, OnDestroy {
  @ContentChildren(SelectableDirective) selectables: QueryList<SelectableDirective<Item>>;
  private dndService = inject(KndDndService<Item>);
  private sub: Subscription

  ngAfterViewInit() {
    // update current available items in knd service
    this.dndService.selectables.next(this.selectables);
    this.sub = this.selectables.changes.subscribe(selectables => 
      this.dndService.selectables.next(selectables)
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}
