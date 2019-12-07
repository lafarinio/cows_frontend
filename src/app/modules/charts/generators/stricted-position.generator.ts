import { CowShedSide } from '../models/position.model';
import { StrictedCowPosition } from '../models/stricted-cow-position.model';
import * as Factory from 'factory.ts';
import { AbstractTime } from '../../../base/models/abstract-time.model';
import { TimeRange } from '../../../base/models/time-range.model';

export class StrictedPositionGenerator {

  constructor(public timeRange: TimeRange,
              public sectionsAmount: number,
              public cowAmount: number) { }

  private timeFactory = Factory.Sync.makeFactory<AbstractTime>({
    time: Factory.each(i => new Date(this.timeRange.startDate.getTime() + this.timeRange.timeStep * i))
  });
  private positionFactory = Factory.Sync.makeFactory<StrictedCowPosition>({
    id: Factory.each(i => (i % this.cowAmount).toString()),
    posX: Factory.each(() => Math.floor(Math.random() * this.sectionsAmount + 1)),
    posY: Factory.each(() => Math.random() > 0.5 ? CowShedSide.A : CowShedSide.B),
    time: new Date()
  });

  generateAnotherTestData(): StrictedCowPosition[] {
    let cowsData: StrictedCowPosition[] = [];
    const timeArray: AbstractTime[] = this.timeFactory.buildList(this.timeRange.timeRangeSize);
    timeArray.forEach((value: AbstractTime) => {
      const time = value.time;
      const cowsPositions = this.positionFactory.buildList(this.cowAmount, {time});
      cowsData = [...cowsData, ...cowsPositions];
    });
    return cowsData;
  }
}
