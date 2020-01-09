import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { ToolbarModule } from './toolbar/toolbar.module';
import { TimeSelectorComponent } from './time-selector/time-selector.component';
import { BarnSelectorComponent } from './barn-selector/barn-selector.component';

@NgModule({
  imports: [
    ToolbarModule,
    BrowserModule
  ],
  exports: [
    TimeSelectorComponent,
    BarnSelectorComponent
  ],
  declarations: [TimeSelectorComponent, BarnSelectorComponent]
})
export class ModulesModule { }
