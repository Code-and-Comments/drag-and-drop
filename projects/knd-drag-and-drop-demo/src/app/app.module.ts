import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DemoType } from './models';
import { DropComponent } from './hostDirectiveTest/drop-component/drop.component';
import { DragComponent } from './hostDirectiveTest/drag-component/drag.component';
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