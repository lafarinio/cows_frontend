import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'cows-selected-cow-chart',
  templateUrl: './selected-cow-chart.component.html'
})

export class SelectedCowChartComponent implements OnInit, OnDestroy {

  selectedDate: Date;
  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onTimeSelection(time: Date) {
    console.log(time);
  }

  onBarnSelection(barnId: number) {
    console.log("Selected barn " + barnId);
  }
}
