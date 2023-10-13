import { Component, OnInit, inject } from '@angular/core';
import { DemoType } from './models';
import { KndDndService } from 'projects/knd-drag-and-drop/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  items: DemoType[] = [];
  private dndService = inject(KndDndService<DemoType>);

  ngOnInit() {
    const arr = Array.from(Array(10)).map((_, i) => i);
    arr.forEach(index => this.items.push({ id: `${index}`, name: `Item ${index}`}));
    this.dndService.selectedItems$.subscribe(items => console.log(items));
  }
}