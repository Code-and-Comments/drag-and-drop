import { Component, OnInit } from '@angular/core';
import { DropInfo } from 'projects/knd-drag-and-drop/src/lib/dnd';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  items: DemoType[] = [];

  ngOnInit() {
    this.createItems();
  }

  createItems() {
    const arr = Array.from(Array(10)).map((_, i) => i);
    arr.forEach(index => this.items.push({ id: `${index}`, name: `Item ${index}`}));

    // setTimeout(() => {
    //   const arr2 = Array.from(Array(10)).map((_, i) => i+10);
    //   arr2.forEach(index => this.items.push({ id: `${index}`, name: `Item ${index}`}));
    // }, 2000);
  }

  gotDropped(drop: DropInfo<DemoType>)  {
    console.log('drop', drop);
  }
}

export interface DemoType {
  id: string,
  name: string
}