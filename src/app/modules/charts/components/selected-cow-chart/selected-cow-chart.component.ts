import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cows-selected-cow-chart',
  templateUrl: './selected-cow-chart.component.html'
})
export class SelectedCowChartComponent implements OnInit {

  selectedDate: Date;
  constructor() { }

  ngOnInit() {
    this.selectedDate = new Date();
  }


  updateSelectedDate($event: Date) {
    this.selectedDate = $event;
  }
}
