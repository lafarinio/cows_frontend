import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cows-time-selector',
  templateUrl: './time-selector.component.html'
})
export class TimeSelectorComponent implements OnInit {

  @Output()
  timeEventEmitter = new EventEmitter<Date>();

  constructor() { }

  ngOnInit() {
    // this.timeEventEmitter = new EventEmitter<Date>();
  }

  emitTime(time: Date) {
    this.timeEventEmitter.emit(time);
  }

  testTimeGenerator(): Date {
    return new Date();
  }

}
