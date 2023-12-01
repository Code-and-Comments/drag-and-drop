import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent, DemoType } from './app.component';
import { DropComponent } from './drop-component/drop.component';
import { DragComponent } from './drag-component/drag.component';
import { CommonModule } from '@angular/common';
import { DragWrapperComponent, DropableDirective, KndDndService } from 'projects/knd-drag-and-drop/src/public-api';
import { AppRoutingModule } from './app-routing.module';

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
    KndDndService<DemoType>,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }