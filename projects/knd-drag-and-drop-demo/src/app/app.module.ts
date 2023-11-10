import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, DemoType } from './app.component';
import { DropComponent } from './drop-component/drop.component';
import { DragComponent } from './drag-component/drag.component';
import { CommonModule } from '@angular/common';
import { DragWrapperComponent, KndDndService } from 'projects/knd-drag-and-drop/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DragComponent,
    DropComponent,
    CommonModule,
    DragWrapperComponent,
  ],
  providers: [
    KndDndService<DemoType>
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }