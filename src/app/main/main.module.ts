import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { BaseModule } from '../base/base.module';
import { ModulesModule } from '../modules/modules.module';
import { ToolbarModule } from '../modules/toolbar/toolbar.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    BrowserModule,
    BaseModule,
    ModulesModule,
    NgbModule,
    ToolbarModule
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class MainModule { }
