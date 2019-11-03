import { NgModule } from '@angular/core';
import { ToolbarModule } from './toolbar/toolbar.module';
import { TimeSelectorComponent } from './time-selector/time-selector.component';



@NgModule({
  imports: [
    ToolbarModule
  ],
  exports: [
    TimeSelectorComponent
  ],
  declarations: [TimeSelectorComponent]
})
export class ModulesModule { }
