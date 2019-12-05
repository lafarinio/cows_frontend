import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'cows-time-selector',
  templateUrl: './time-selector.component.html',
  styleUrls: ['sliders.css']
})
export class TimeSelectorComponent implements OnInit {
  selectedTime = ' / / / ';

  @ViewChild('minuteSlider', {static: false}) minuteSlider: ElementRef;
  @ViewChild('hoursSlider', {static: false}) hoursSlider: ElementRef;

  @Output()
  timeEventEmitter = new EventEmitter<Date>();

  constructor() { }

  ngOnInit() {
  }

  emitTime(time: Date) {
    this.timeEventEmitter.emit(time);
  }

  updateLabel(time: Date) {
    this.selectedTime = time.toLocaleString();
  }

  getDateFromInputs(): Date {
    let date = new Date(Date.UTC(2019, 10, 11, 8, 10));

    date.setMinutes(this.minuteSlider.nativeElement.value);
    date.setHours(this.hoursSlider.nativeElement.value);

    return date;
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
