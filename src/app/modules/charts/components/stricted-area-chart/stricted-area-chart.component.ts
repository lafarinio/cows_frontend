import { Component, OnInit, NgZone, OnDestroy, Input } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_material from '@amcharts/amcharts4/themes/material';
import { StrictedCowPosition } from '../../models/stricted-cow-position.model';
import { CowShedSide, PositionNames } from '../../models/position.model';
import { StrictedAreaPosition } from '../../models/srticted-area-position.model';
import { StrictedPositionService } from '../../services/stricted-position.service';

import { CowshedData, CowshedDataAtTime } from '../../models/CowshedData.model';

import { AbstractCleanableComponent } from '../../../../base/components/abstract-cleanable/abstract-cleanable.component';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { filter, first, mergeMap, tap } from 'rxjs/operators';
import { exists } from '../../../../base/operators/exists';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cows-stricted-area-chart',
  templateUrl: './stricted-area-chart.component.html'
})
export class StrictedAreaChartComponent extends AbstractCleanableComponent implements OnInit, OnDestroy {
  path: string;

  private chart: am4charts.XYChart;
  private sensorImages: Array<am4core.Image>;

  private isChartBusy$ = new BehaviorSubject(true);
  private isBarnBusy$ = new BehaviorSubject(true);

  data: Array<StrictedCowPosition> = [];
  private selectedBarn: CowshedData;
  private selectedTime: Date;

  private alreadyDrawn = false;

  constructor(private zone: NgZone,
              private router: ActivatedRoute,
              private strictedPositionService: StrictedPositionService) { super(); }

  ngOnInit() {
    this.addSubscription(
      this.router.params.subscribe(
        (params) => {
          this.path = params['path'];
          if (exists(this.chart)) {
            this.updateChart2();
          }
        }
      )
    );
    this.zone.runOutsideAngular(() => {
      this.initChart();
    });
  }

  onDataSelection(selectedData: CowshedDataAtTime) {
    this.isBarnBusy$.next(true);
    this.selectedBarn = selectedData.cowshed;
    this.isBarnBusy$.next(false);

    this.selectedTime = selectedData.timestamp;
    this.updateChart();
  }

  updateChart() {
    console.log("Chart - selected barn " + this.selectedBarn.cowshedId + " with time " + this.selectedTime.toISOString());
    const chartObservable$ = this.isChartBusy$.asObservable();
    const barnObservable$ = this.isBarnBusy$.asObservable();

    this.addSubscription(
      chartObservable$.pipe(
        mergeMap((isChartBusy) => {
          return barnObservable$.pipe(
            filter((isBarnBusy) => !isBarnBusy && !isChartBusy)
          );
        }),
        first()
      ).subscribe(() => {
        this.updateChart2();
      })
    );
  }

  updateChart2() {
    const idCowShed = this.selectedBarn.cowshedId;
    this.strictedPositionService.getFirstOrThirdAlgorithmForSelectedTime(idCowShed, this.selectedTime, this.path).pipe(
      filter(exists),
      first()
    ).subscribe((data) => {
      this.chart.data = data;
      this.drawSensors(this.chart);
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
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
    series.dataFields.id = PositionNames.whatCows;
    series.sequencedInterpolation = true;
    series.defaultState.transitionDuration = 3000;

    const bgColor = new am4core.InterfaceColorSet().getFor('background');

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 1;
    columnTemplate.strokeOpacity = 0.2;
    columnTemplate.stroke = bgColor;
    columnTemplate.tooltipText = `{${PositionNames.posY}}{${PositionNames.posX}} : {value.workingValue.formatNumber("#.")} cows\n
Cows in this section: {id}`;
    columnTemplate.width = am4core.percent(100);
    columnTemplate.height = am4core.percent(100);

    series.heatRules.push({
      target: columnTemplate,
      property: 'fill',
      min: am4core.color(bgColor),
      max: chart.colors.getIndex(0)
    });

    columnTemplate.column.adapter.add("fill", function(fill, target) {
      if (target.dataItem) {
        const val: number = target.dataItem.values.value.value;

        if (val == 0) {
          return am4core.color("white")
        }


        if (val < 15) {
          const change: number = val / 50;
          return am4core.color(chart.colors.getIndex(0)).lighten(-change).brighten(-change);
        } else {
          const change: number = (Math.floor(val / 10) * 10) / 100;
          return am4core.color(chart.colors.getIndex(0)).lighten(-change).brighten(-change);
        }
      }
      return fill;
    });

    this.chart = chart;
    this.isChartBusy$.next(false);

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

