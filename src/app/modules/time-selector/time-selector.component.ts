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

  isMinuteTimelapseRunning = false;
  timelapseTimer;

  timelapseButtonPressed(what: string) {
    if (what === 'minutes') {
      if (this.isMinuteTimelapseRunning === false) {
        console.log('Starting minute timelapse.');
        this.isMinuteTimelapseRunning = true;

        this.timelapseTimer = setInterval(() => { this.handleMinuteIntervalExpiry(); }, 1500);
      } else {
        this.clearTimelapse();
      }
    }
  }

  handleMinuteIntervalExpiry() {
    console.log('Timelapse.');
    this.minuteSlider.nativeElement.value++;
    this.onSliderChange();
    this.onSliderChangeEnd();

    if (this.minuteSlider.nativeElement.value >= 59) {
      this.clearTimelapse();
    }
  }

  clearTimelapse() {
    this.isMinuteTimelapseRunning = false;
    clearInterval(this.timelapseTimer);
  }
}
