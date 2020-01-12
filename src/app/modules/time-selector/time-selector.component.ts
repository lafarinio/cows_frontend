import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import Pikaday from 'pikaday';

@Component({
  selector: 'cows-time-selector',
  templateUrl: './time-selector.component.html',
  styleUrls: ['sliders.css']
})
export class TimeSelectorComponent implements OnInit, AfterViewInit {
  selectedTime = ' / / / ';
  calendar: Pikaday;

  @ViewChild('minuteSlider', {static: false}) minuteSlider: ElementRef;
  @ViewChild('hoursSlider', {static: false}) hoursSlider: ElementRef;
  @ViewChild('calendar', {static: false}) datepicker: ElementRef;

  @Output()
  timeEventEmitter = new EventEmitter<Date>();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const self = this;
    this.calendar = new Pikaday({
      field: this.datepicker.nativeElement,
      onSelect: function() {
	self.onCalendarChange();
      }
    });
    this.calendar.setDate(new Date(Date.UTC(2020, 0, 12))); // get this from db
    this.calendar.setMinDate(new Date(Date.UTC(2020, 0, 11)));
    this.calendar.setMaxDate(new Date(Date.UTC(2020, 0, 13)));

    this.emitInitialTime();
  }

  private emitInitialTime() {
    this.onSliderChange();
    this.onSliderChangeEnd();
    this.onCalendarChange();
  }

  emitTime(time: Date) {
    this.timeEventEmitter.emit(time);
  }

  updateLabel(time: Date) {
    this.selectedTime = time.toLocaleString();
  }

  getDateFromInputs(): Date {
    //const date = new Date(Date.UTC(2019, 10, 11, 8, 10));
    const date = this.calendar.getDate();

    date.setMinutes(this.minuteSlider.nativeElement.value);
    date.setHours(this.hoursSlider.nativeElement.value);

    return date;
  }

  onCalendarChange() {
    const date = this.getDateFromInputs();
    this.updateLabel(date);
    this.emitTime(date);
  }

  onSliderChange() {
    const date = this.getDateFromInputs();

    this.updateLabel(date);
  }

  onSliderChangeEnd() {
    const date = this.getDateFromInputs();

    this.emitTime(date);
  }

  isTimelapseRunning = false;
  timelapseTimer;

  timelapseButtonPressed() {
    if (this.isTimelapseRunning === false) {
      console.log('Starting timelapse.');
      this.isTimelapseRunning = true;

      this.timelapseTimer = setInterval(() => { this.handleTimelapseIntervalExpiry(); }, 1500);
    } else {
      this.clearTimelapse();
    }
  }

  handleTimelapseIntervalExpiry() {
    console.log('Timelapse.');
    if (this.minuteSlider.nativeElement.value >= 59) {
      this.hoursSlider.nativeElement.value++;
      this.minuteSlider.nativeElement.value = 0;
    } else {
      this.minuteSlider.nativeElement.value++;
    }
    this.onSliderChange();
    this.onSliderChangeEnd();
  }

  clearTimelapse() {
    this.isTimelapseRunning = false;
    clearInterval(this.timelapseTimer);
  }
}
