import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { KndDndService } from 'projects/knd-drag-and-drop/src/public-api';
import { DemoType } from './models';
import { DropComponent } from './hostDirectiveTest/drop-component/drop.component';
import { DragComponent } from './hostDirectiveTest/drag-component/drag.component';
import { CommonModule } from '@angular/common';
import { KndDrawService } from 'projects/knd-drag-and-drop/src/lib/knd-draw.service';
import { DragWrapperComponent } from 'projects/knd-drag-and-drop/src/lib/drag-wrapper/drag-wrapper.component';

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
    KndDndService<DemoType>,
    KndDrawService<DemoType>,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }