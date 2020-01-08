import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_material from '@amcharts/amcharts4/themes/material';
import { StrictedCowPosition } from '../../models/stricted-cow-position.model';
import { CowShedSide, PositionNames } from '../../models/position.model';
import { StrictedAreaPosition } from '../../models/srticted-area-position.model';
import { StrictedPositionService } from '../../services/stricted-position.service';
import { AbstractCleanableComponent } from '../../../../base/components/abstract-cleanable/abstract-cleanable.component';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { filter, first, mergeMap, tap } from 'rxjs/operators';



@Component({
  selector: 'cows-stricted-area-chart',
  templateUrl: './stricted-area-chart.component.html'
})

export class StrictedAreaChartComponent extends AbstractCleanableComponent implements OnInit, OnDestroy {
  private chart: am4charts.XYChart;
  private isChartBusy$ = new BehaviorSubject(true);
  private isDataBusy$ = new BehaviorSubject(true);
  data: Array<StrictedCowPosition> = [];
  private alreadyDrawn = false;

  constructor(private zone: NgZone,
              private strictedPositionService: StrictedPositionService) { super(); }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.initData();
      this.initChart();
    });
  }

  onBarnSelection(barnId: number) {
    console.log("Selected barn " + barnId);
  }


  onTimeSelection(time: Date) {
    console.log(time);
    const chartObservable$ = this.isChartBusy$.asObservable();
    const dataObservable$ = this.isDataBusy$.asObservable();

    this.addSubscription(
      chartObservable$.pipe(
        mergeMap((isChartBusy) => {
          return dataObservable$.pipe(
            filter((isDaTaBusy) => !isDaTaBusy && !isChartBusy)
          );
        })
      ).subscribe(() => {
        this.chart.data = this.strictedPositionService.parseData(this.data, time, 10, true);
        this.drawSensors(this.chart);
      })
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  private initData() {
    // addSubscription jest czescia AbstractCleaneble;
    // komponent ten pozwala na zarzadzanie subskrypcjami i sam niszczy posiadane subskrypcje
    this.addSubscription(
      this.strictedPositionService.getCows().subscribe(cowList => {
        this.data = cowList;
        this.isDataBusy$.next(false);
      })
    );
  }

  private initChart() {
    this.isChartBusy$.next(true);
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
    columnTemplate.tooltipText = `{${PositionNames.posY}}{${PositionNames.posX}} : {value.workingValue.formatNumber("#.")} cows`;
    columnTemplate.width = am4core.percent(100);
    columnTemplate.height = am4core.percent(100);

    series.heatRules.push({
      target: columnTemplate,
      property: 'fill',
      min: am4core.color(bgColor),
      max: chart.colors.getIndex(0)
    });

    this.chart = chart;
    this.isChartBusy$.next(false);
  }

  private drawSensors(chart: am4charts.XYChart) {
    if (this.alreadyDrawn) {
      return ;
    }

    this.alreadyDrawn = true;

    // data needs to already exist
    const contentHeight = chart.plotContainer.contentHeight;
    const contentWidth = chart.plotContainer.contentWidth;

    if (contentHeight == null) {
      console.log('Error - chart still not fully loaded! Can\'t draw sensors.');
    }

    const barnHeight = 100; // should come from db
    const barnWidth = 200; // should come from db

    const sensors = [ // in barn coords, should come from db
      {
        sensorX: 100,
        sensorY: 0
      },
      {
        sensorX: 200,
        sensorY: 33
      },
      {
        sensorX: 100,
        sensorY: 100
      },
      {
        sensorX: 0,
        sensorY: 66
      }
    ];

    for (const pos of sensors) {
      const sensor = new am4core.Image();
      sensor.href = 'assets/img/sensor_icon.svg';
      sensor.valign = 'top';
      sensor.align = 'right';

      const coords = this.barnCoordToChartCoord(barnWidth, barnHeight, contentWidth, contentHeight, pos.sensorX, pos.sensorY);
      sensor.marginRight = coords[0] - (sensor.innerWidth / 4);
      sensor.marginTop = coords[1] - (sensor.innerHeight / 4);

      sensor.zIndex = 100;
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

