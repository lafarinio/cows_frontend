import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { chartsRoutes } from './charts-routes';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(
      chartsRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
  ]
})
export class ChartsRouterModule { }
