import { NgModule } from '@angular/core';
import { ToolbarModule } from './toolbar/toolbar.module';
import { TimeSelectorComponent } from './time-selector/time-selector.component';
import { ChartsModule } from './charts/charts.module';



@NgModule({
  imports: [
    ToolbarModule,
    ChartsModule
  ],
  exports: [
    TimeSelectorComponent
  ],
  declarations: [TimeSelectorComponent]
})
export class ModulesModule { }
