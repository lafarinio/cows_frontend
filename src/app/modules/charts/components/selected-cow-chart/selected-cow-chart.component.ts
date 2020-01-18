import { Component, OnInit, OnDestroy, NgZone, Input } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_material from '@amcharts/amcharts4/themes/material';
import { StrictedCowPosition } from '../../models/stricted-cow-position.model';
import { CowShedSide, PositionNames } from '../../models/position.model';
import { StrictedAreaPosition } from '../../models/srticted-area-position.model';
import { StrictedPositionService } from '../../services/stricted-position.service';

import { CowshedData, CowshedDataAtTime } from '../../models/CowshedData.model';

import { filter, first, mergeMap, tap } from 'rxjs/operators';
import { exists } from '../../../../base/operators/exists';

@Component({
  selector: 'cows-selected-cow-chart',
  templateUrl: './selected-cow-chart.component.html'
})

export class SelectedCowChartComponent implements OnInit, OnDestroy {
  private chart: am4charts.XYChart;
  private sensorImages: Array<am4core.Image>;

  private selectedCowId: number;
  private largeRangeData: any;
  
  private selectedBarn: CowshedData;
  private selectedTime: Date;

  cows: Array<number>;
  
  constructor(private zone: NgZone,
	      private strictedPositionService: StrictedPositionService) { }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.initChart();
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
	this.chart.dispose();
      }
    });

    this.cows = []
  }

  onDataSelection(selectedData: CowshedDataAtTime) {
    this.selectedBarn = selectedData.cowshed;

    this.selectedTime = selectedData.timestamp;
    this.updateChart();
  }

  private parseSelectedCow(cowId: number, data: any, maxMinutes: number) {
    let baseBarnLayout = data[0];

    let cowPositions = []
    
    // finding the cow in data
    for (let i: number = maxMinutes - 1; i >= 0; i--) {
      const sections = data[i];
      for (let j: number = 0; j < sections.length; j++) {
	if (sections[j].cows.includes(cowId))
	{
	  cowPositions.push({minusTime: i, idx: j})
	}
      }
    }

    // filling displayable data with the cow
    for (let section of baseBarnLayout) {
      section.numOfCows = 0;
    }

    for (let pos of cowPositions) {
      baseBarnLayout[pos.idx].numOfCows = pos.minusTime + 1; 
    }

    return baseBarnLayout;
  }

  onCowSelection(idx: number) {
    this.selectedCowId = this.cows[idx];

    const minutesToParse: number = 4;
    this.chart.data = this.parseSelectedCow(this.selectedCowId, this.largeRangeData, minutesToParse);
  }

  updateChart() {
    console.log("Chart - selected barn " + this.selectedBarn.cowshedId + " with time " + this.selectedTime.toISOString());
    const idCowShed = this.selectedBarn.cowshedId;

    const minutesToParse: number = 4; // change in two places

    this.largeRangeData = []

    this.selectedCowId = 5;
    this.cows = []

    this.strictedPositionService.getFirstOrThirdAlgorithmForSelectedTime(idCowShed, this.selectedTime, "thirdAlgorithm").pipe(
      filter(exists),
      first()
    ).subscribe((data) => {  
      this.largeRangeData[0] = data;

      for (var section of data) {
	this.cows = this.cows.concat(section.cows)
      }
      this.cows = [...this.cows];
      this.selectedCowId = this.cows[0]
    });
    
    for(let i: number = 1; i < minutesToParse-1; i++) {
      const timeToSearch: Date = new Date(this.selectedTime.getTime() - (i * 60000));
      this.strictedPositionService.getFirstOrThirdAlgorithmForSelectedTime(idCowShed, timeToSearch, "thirdAlgorithm").pipe(
	filter(exists),
	first()
      ).subscribe((data) => {
	this.largeRangeData[i] = data;
      });
    }

    // really hacky solution, no idea how to do it properly
    setTimeout( () => {
      const timeToSearch: Date = new Date(this.selectedTime.getTime() - ((minutesToParse - 1) * 60000));
      this.strictedPositionService.getFirstOrThirdAlgorithmForSelectedTime(idCowShed, timeToSearch, "thirdAlgorithm").pipe(
	filter(exists),
	first()
      ).subscribe((data) => {
	this.largeRangeData[minutesToParse - 1] = data;
	
	this.chart.data = this.parseSelectedCow(this.selectedCowId, this.largeRangeData, minutesToParse)
      });
      
      this.drawSensors(this.chart);
    }, 1000 );
  }

  private initChart() {
    const chart = am4core.create('chartdiv', am4charts.XYChart);
    chart.maskBullets = false;

    const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    const yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

    xAxis.dataFields.category = PositionNames.posX;
    yAxis.dataFields.category = PositionNames.posY;

    xAxis.renderer.grid.template.disabled = false;
    xAxis.renderer.minGridDistance = 40;

    yAxis.renderer.grid.template.disabled = false;
    yAxis.renderer.inversed = true;
    yAxis.renderer.minGridDistance = 30;

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = PositionNames.posX;
    series.dataFields.categoryY = PositionNames.posY;
    series.dataFields.value = PositionNames.value;
    series.sequencedInterpolation = true;
    series.defaultState.transitionDuration = 3000;

    const bgColor = new am4core.InterfaceColorSet().getFor('background');

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 1;
    columnTemplate.strokeOpacity = 0.2;
    columnTemplate.stroke = bgColor;
    columnTemplate.tooltipText = `Cow seen.`;
    columnTemplate.width = am4core.percent(100);
    columnTemplate.height = am4core.percent(100);

    series.heatRules.push({
      target: columnTemplate,
      property: 'fill',
      min: am4core.color(bgColor),
      max: chart.colors.getIndex(0)
    });

    series.tooltip.label.adapter.add("text", function(text, target) {
      if (target.dataItem) {
	const val: number = target.dataItem.values.value.value;
	
	if (val == 0) { return "" }
	
	if (val == 2) { return 'Cow seen ' + (val - 1) + ' minute ago' }

	return 'Cow seen ' + (val-1) + ' minutes ago'
      }
      return text;
    });

    columnTemplate.column.adapter.add("fill", function(fill, target) {
      if (target.dataItem) {
	const val: number = target.dataItem.values.value.value;

	if (val == 0)
	{
	  return am4core.color("white")
	}
	
	const change: number = val / 15;
	const baseColor = am4core.color(chart.colors.getIndex(0)).lighten(-0.5).brighten(-0.5);
	return baseColor.lighten(change).brighten(change);
      }
      return fill;
    });

    this.chart = chart;
    this.sensorImages = [];
  }

  private drawSensors(chart: am4charts.XYChart) {
    console.log('Drawing sensors for barn ' + this.selectedBarn.cowshedId + ' | width:' + this.selectedBarn.width + ' height:' + this.selectedBarn.height);

    for (const im of this.sensorImages) {
      im.dispose();
    }

    const sensors = this.selectedBarn.wallpoints;
    const barnHeight = this.selectedBarn.height;
    const barnWidth = this.selectedBarn.width;

    // data needs to already exist
    const contentHeight = chart.plotContainer.contentHeight;
    const contentWidth = chart.plotContainer.contentWidth;

    if (contentHeight == null) {
      console.log('Error - chart still not fully loaded! Can\'t draw sensors.');
      return;
    }


    for (const s of sensors) {
      const sensor = new am4core.Image();
      sensor.href = 'assets/img/sensor_icon.svg';
      sensor.valign = 'top';
      sensor.align = 'right';

      const coords = this.barnCoordToChartCoord(barnWidth, barnHeight, contentWidth, contentHeight, s.position_x, s.position_y);
      sensor.marginRight = coords[0] - (sensor.innerWidth / 4);
      sensor.marginTop = coords[1] - (sensor.innerHeight / 4);

      sensor.zIndex = 100;

      this.sensorImages.push(sensor);
      chart.tooltipContainer.children.push(sensor);
      sensor.appear();
    }
  }

  private barnCoordToChartCoord(bWidth: number, bHeight: number, cWidth: number, cHeight: number, bX: number, bY: number) {
    // assumes barn coords go from (0,0) in the bottom left, (maxX, maxY) in the top right

    const cX = cWidth - cWidth * (bX / bWidth);
    const cY = cHeight - cHeight * (bY / bHeight);

    return [cX, cY];
  }
}
