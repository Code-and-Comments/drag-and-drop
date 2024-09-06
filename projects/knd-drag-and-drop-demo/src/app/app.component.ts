import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DropInfo } from 'projects/knd-drag-and-drop/src/lib/dnd';
import { ModalComponent } from './modal/modal.component';
import { KndDndService } from 'projects/knd-drag-and-drop/src/public-api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  items: DemoType[] = [];
  private modalController = inject(ModalController);
  private dndService = inject(KndDndService<DemoType>);
  currentSelection: Observable<DemoType[]>;

  ngOnInit() {
    this.createItems();
    this.currentSelection = this.dndService.selectedItems
  }

  emptyItems() {
    this.items = [];
  }

  createItems() {
    this.items = this.createItemArray(10);
  }

  createItemArray(amount: number): DemoType[] {
    const items: DemoType[] = [];
    const arr = Array.from(Array(amount)).map((_, i) => i);
    arr.forEach(index => items.push({ id: `${Math.random()}`, name: `Item ${index}`}));
    return items
  }

  gotDropped(drop: DropInfo<DemoType>)  {
    console.log('drop', drop);
    this.items = this.items.filter(i => !drop.dragItems.includes(i));
  }

  async popModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: '',
    })
    modal.present();
  }
}

export interface DemoType {
  id: string,
  name: string
}