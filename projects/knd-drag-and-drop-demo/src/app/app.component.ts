import { Component, OnInit, inject } from '@angular/core';
import { DemoType } from './models';
import { KndDndService } from 'projects/knd-drag-and-drop/src/public-api';
import { DropInfo } from 'projects/knd-drag-and-drop/src/lib/dnd/dnd.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  items: DemoType[] = [];
  private dndService = inject(KndDndService<DemoType>);

  ngOnInit() {
    this.createItems();
    this.dndService.selectedItems$.subscribe(items => console.log('currentDndContext', items));
  }

  createItems() {
    const arr = Array.from(Array(10)).map((_, i) => i);
    arr.forEach(index => this.items.push({ id: `${index}`, name: `Item ${index}`}));
  }

  gotDropped(drop: DropInfo<DemoType>)  {
    console.log('drop', drop);
  }
}