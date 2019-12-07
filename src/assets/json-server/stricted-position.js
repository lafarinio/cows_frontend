"use strict";
exports.__esModule = true;
var stricted_position_generator_1 = require("../../app/modules/charts/generators/stricted-position.generator");
var time_range_model_1 = require("../../app/base/models/time-range.model");
var cerialize_1 = require("cerialize");
// @ts-ignore
var fs = require("fs");
var timeRange = cerialize_1.Deserialize({
    startDate: new Date(2019, 11, 12),
    endDate: new Date(2019, 11, 13),
    timeStep: time_range_model_1.TimeSteps.ONE_MINUTE
}, time_range_model_1.TimeRange);
var sections = 10;
var cowAmount = 25;
var generator = new stricted_position_generator_1.StrictedPositionGenerator(timeRange, sections, cowAmount);
var data = generator.generateAnotherTestData();
var cows = {
    cows: data
};
fs.writeFile('stricted-position.json', JSON.stringify(cows), function (error) { return console.log(error); });
