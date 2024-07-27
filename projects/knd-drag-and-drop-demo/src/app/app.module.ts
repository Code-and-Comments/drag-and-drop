import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, DemoType } from './app.component';
import { DropComponent } from './drop-component/drop.component';
import { DragComponent } from './drag-component/drag.component';
import { CommonModule } from '@angular/common';
import { DragWrapperComponent, DropableDirective, KNDDND_CONFIG, KndDndConfig, KndDndService } from 'projects/knd-drag-and-drop/src/public-api';
import { AppRoutingModule } from './app-routing.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { ModalComponent } from './modal/modal.component';
import { KndIdentifier } from 'projects/knd-drag-and-drop/src/lib/dnd';

class DnDConfig implements KndDndConfig {
  debug = false;
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
    { provide: KNDDND_CONFIG, useValue: new DnDConfig() },
    KndDndService<DemoType>,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
