import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedCowChartComponent } from './components/selected-cow-chart/selected-cow-chart.component';
import { StrictedAreaChartComponent } from './components/stricted-area-chart/stricted-area-chart.component';
import { WorkPointsChartComponent } from './components/work-points-chart/work-points-chart.component';
import { ModulesModule } from '../modules.module';

import { StrictedPositionService } from './services/stricted-position.service';
import { CowDataService } from './services/cow-data.service';


@NgModule({
  declarations: [SelectedCowChartComponent, StrictedAreaChartComponent, WorkPointsChartComponent],
  exports: [
    StrictedAreaChartComponent
  ],
  imports: [
    CommonModule,
    ModulesModule
  ],
  providers: [StrictedPositionService, CowDataService]
})
export class ChartsModule { }
