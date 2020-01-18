import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { CowshedData, CowshedDataAtTime, CowshedTimeRange } from '../charts/models/CowshedData.model'

import Pikaday from 'pikaday';

@Component({
  selector: 'cows-time-selector',
  templateUrl: './time-selector.component.html',
  styleUrls: ['sliders.css']
})
export class TimeSelectorComponent implements OnInit, AfterViewInit {
  selectedTime = ' / / / ';
  selectedBarn: CowshedData; 
  
  calendar: Pikaday;

  @ViewChild('minuteSlider', {static: false}) minuteSlider: ElementRef;
  @ViewChild('hoursSlider', {static: false}) hoursSlider: ElementRef;
  @ViewChild('calendar', {static: false}) datepicker: ElementRef;

  @Output()
  selectedDataEventEmitter = new EventEmitter<CowshedDataAtTime>();

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
  }

  onBarnSelection(barn: CowshedData) {
    this.selectedBarn = barn;
    
    console.log("Time selector - barn " + barn.cowshedId);
    console.log(barn);

    const s: Date = new Date(barn.dataTimeRange.timestampStart)
    const e: Date = new Date(barn.dataTimeRange.timestampEnd)
    this.setupTimeSelectors(s, e);
  }

  setupTimeSelectors(startTime: Date, endTime: Date) {
    // workaround to js weird reference issues
    this.hoursSlider.nativeElement.value = 0;
    this.hoursSlider.nativeElement.value += endTime.getHours();

    // workaround to js weird reference issues
    this.minuteSlider.nativeElement.value = 0;
    this.minuteSlider.nativeElement.value += endTime.getMinutes();

    this.calendar.setMinDate(startTime);
    this.calendar.setMaxDate(endTime);
    
    this.calendar.setDate(endTime);
    
    this.emitInitialTime();
  }

  private emitInitialTime() {
    this.onSliderChange();
    this.onSliderChangeEnd(false);
    this.onCalendarChange(true);
  }

  emitSelectedData(time: Date) {
    const selectedData: CowshedDataAtTime = new CowshedDataAtTime(this.selectedBarn, time);
    
    this.selectedDataEventEmitter.emit(selectedData);

    console.log("Sent barn " + selectedData.cowshed.cowshedId + " data and time " + selectedData.timestamp.toISOString())
  }

  updateLabel(time: Date) {
    this.selectedTime = time.toLocaleString();
  }

  getDateFromInputs(): Date {
    const date = this.calendar.getDate();

    date.setMinutes(this.minuteSlider.nativeElement.value);
    date.setHours(this.hoursSlider.nativeElement.value);

    return date;
  }

  onCalendarChange(shouldEmit: boolean = true) {
    const date = this.getDateFromInputs();
    this.updateLabel(date);

    if (shouldEmit == true) {
      this.emitSelectedData(date);
    }
  }

  onSliderChange() {
    const date = this.getDateFromInputs();

    this.updateLabel(date);
  }

  onSliderChangeEnd(shouldEmit: boolean = true) {
    const date = this.getDateFromInputs();

    if (shouldEmit == true) {
      this.emitSelectedData(date);
    }
  }

  isTimelapseRunning = false;
  timelapseTimer;

  timelapseButtonPressed() {
    if (this.isTimelapseRunning === false) {
      console.log('Starting timelapse.');
      this.isTimelapseRunning = true;

      this.timelapseTimer = setInterval(() => { this.handleTimelapseIntervalExpiry(); }, 2500);
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
