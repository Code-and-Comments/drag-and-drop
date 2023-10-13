import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DemoComponent } from './hostDirectiveTest/demo-component/demo.component';
import { KndDndService } from 'projects/knd-drag-and-drop/src/public-api';
import { DemoType } from './models';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DemoComponent,
  ],
  providers: [
    KndDndService<DemoType>,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }