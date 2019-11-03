import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedCowChartComponent } from './selected-cow-chart/selected-cow-chart.component';
import { StrictedAreaChartComponent } from './stricted-area-chart/stricted-area-chart.component';
import { WorkPointsChartComponent } from './work-points-chart/work-points-chart.component';
import { ModulesModule } from '../modules.module';



@NgModule({
  declarations: [SelectedCowChartComponent, StrictedAreaChartComponent, WorkPointsChartComponent],
  exports: [
    StrictedAreaChartComponent
  ],
  imports: [
    CommonModule,
    ModulesModule
  ]
})
export class ChartsModule { }
