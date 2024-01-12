import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, DemoType } from './app.component';
import { DropComponent } from './drop-component/drop.component';
import { DragComponent } from './drag-component/drag.component';
import { CommonModule } from '@angular/common';
import { DragWrapperComponent, DropableDirective, KNDDND_CONFIG, KndDndDrawConfig, KndDndService } from 'projects/knd-drag-and-drop/src/public-api';
import { AppRoutingModule } from './app-routing.module';

class DrawConfig implements KndDndDrawConfig {
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
  ],
  providers: [
    { provide: KNDDND_CONFIG, useValue: new DrawConfig() },
    KndDndService<DemoType>,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
