import { Routes } from '@angular/router';
import { SelectedCowChartComponent } from '../components/selected-cow-chart/selected-cow-chart.component';
import { WorkPointsChartComponent } from '../components/work-points-chart/work-points-chart.component';
import { StrictedAreaChartComponent } from '../components/stricted-area-chart/stricted-area-chart.component';

export const chartsRoutes: Routes = [
  {
    path: 'selected-cow-chart',
    component: SelectedCowChartComponent,
  },
  {
    path: 'stricted-area-chart/:path',
    component: StrictedAreaChartComponent,
  },
  {
    path: 'workpoints-area',
    component: WorkPointsChartComponent,
  },
  {
    path: 'home',
    redirectTo: '/stricted-area-chart'
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  // { path: '**',
  //   component: NotFoundComponent }
];


