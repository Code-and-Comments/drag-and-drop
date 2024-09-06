import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, DemoType } from './app.component';
import { DropComponent } from './drop-component/drop.component';
import { DragComponent } from './drag-component/drag.component';
import { CommonModule } from '@angular/common';
import { DragWrapperComponent, DropableDirective, DND_CONFIG, DndConfig, DndService } from 'projects/drag-and-drop/src/public-api';
import { AppRoutingModule } from './app-routing.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { ModalComponent } from './modal/modal.component';
import { DndIdentifier } from 'projects/drag-and-drop/src/lib/dnd';

class DnDConfig implements DndConfig {
  debug = true;
  updateDragUI(dragUI: HTMLDivElement, items?: any[] | undefined): void {
    dragUI.innerHTML = `${(items ?? []).length}`
  }
  // selectUniqueIdentifier<Item>(item: Item): string {
  //   return (item as any).notExistant;
  // }
}

@NgModule({
  imports: [
    BrowserModule,
    DragComponent,
    DropComponent,
    CommonModule,
    DragWrapperComponent,
    DropableDirective,
    AppRoutingModule,
    IonicModule.forRoot({ mode: 'ios' }),
    ModalComponent
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: DND_CONFIG, useValue: new DnDConfig() },
    DndService<DemoType>,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
