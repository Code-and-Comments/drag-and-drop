import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { KndDndService } from 'projects/knd-drag-and-drop/src/public-api';
import { DemoType } from './models';
import { DropComponent } from './hostDirectiveTest/drop-component/drop.component';
import { DragComponent } from './hostDirectiveTest/drag-component/drag.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DragComponent,
    DropComponent
  ],
  providers: [
    KndDndService<DemoType>,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }