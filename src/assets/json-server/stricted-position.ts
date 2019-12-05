import { StrictedPositionGenerator } from '../../app/modules/charts/generators/stricted-position.generator';
import { TimeRange, TimeSteps } from '../../app/base/models/time-range.model';
import { Deserialize } from 'cerialize';
// @ts-ignore
import * as fs from 'fs';

const timeRange: TimeRange = Deserialize({
  startDate: new Date(2019, 11, 12),
  endDate: new Date(2019, 11, 13),
  timeStep: TimeSteps.ONE_MINUTE
}, TimeRange);
const sections = 2;
const cowAmount = 50;
const generator = new StrictedPositionGenerator(timeRange, sections, cowAmount);

const data = generator.generateAnotherTestData();
const cows = {
  cows: data
};

fs.writeFile('stricted-position.json', JSON.stringify(cows), (error) => console.log(error));
