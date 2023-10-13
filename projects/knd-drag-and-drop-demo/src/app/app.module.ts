import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DemoComponent } from './hostDirectiveTest/demo-component/demo.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DemoComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
