import { deserialize, deserializeAs } from 'cerialize';


export class TimeRange {
  @deserializeAs(Date)
  startDate: Date;

  @deserializeAs(Date)
  endDate: Date;

  @deserialize
  timeStep: TimeSteps;

  get timeRangeSize(): number {
    return Math.floor((this.endDate.getTime() - this.startDate.getTime()) * 1.0 / this.timeStep);
  }
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

export enum TimeSteps {
  ONE_MINUTE = MINUTE,
  FIVE_MINUTES = 5 * MINUTE,
  THIRTY_MINUTES = 30 * MINUTE,
  ONE_HOUR = HOUR,
  THREE_HOURS = 3 * HOUR,
  SIX_HOURS = 6 * HOUR,
  DAY = 24 * HOUR
}
