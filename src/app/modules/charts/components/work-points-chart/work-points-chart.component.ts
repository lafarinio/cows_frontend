import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_material from '@amcharts/amcharts4/themes/material';
import { PositionNames } from '../../models/position.model';
import { WorkpointAreaPosition } from '../../models/workpoint-area-position.model';
import { UrlService } from '../../../../base/services/url.service';
import { CowshedData, CowshedDataAtTime } from '../../models/CowshedData.model';
import { WorkpointAreaService } from '../../services/workpoint-area.service';
import { WallpointLocation } from '../../models/WallpointLocation.model';



const barnWidth = 300;
const barnHeight = 170;


@Component({
  selector: 'cows-work-points-chart',
  templateUrl: './work-points-chart.component.html'
})
export class WorkPointsChartComponent implements OnInit, OnDestroy {
  private chart: am4charts.XYChart;
  private data: Array<WallpointLocation>;
  private sensors: any;
  private selectedBarn: CowshedData;
  private selectedTime: Date;

  private contentHeight = 428.67;
  private contentWidth = 742;
  constructor(private zone: NgZone,
              private workpointsService: WorkpointAreaService) {
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.initializeChart();

      this.initializeData();

      this.initializeSensors();
      this.drawSensors();

    });
  }

  onDataSelection($event: CowshedDataAtTime) {
    this.selectedBarn = $event.cowshed;
    this.selectedTime = $event.timestamp;
    console.log($event);
  }

  private initializeChart() {
// Create chart instance
    this.chart = am4core.create('chartdiv', am4charts.XYChart);
    this.chart.colors.step = 3;

    // Create axes
    const xAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
    xAxis.renderer.minGridDistance = 50;
    xAxis.min = 0;
    xAxis.max = barnWidth;

    const yAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.renderer.minGridDistance = 50;
    yAxis.min = 0;
    yAxis.max = barnHeight;

    const bgColor = new am4core.InterfaceColorSet().getFor('background');

    // Create series #1
    const series = this.chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = PositionNames.posY;
    series.dataFields.valueX = PositionNames.posX;
    series.dataFields.value = PositionNames.valueInWP;
    series.strokeOpacity = 0;
    series.name = 'Series 1';

    const bullet = series.bullets.push(new am4core.Rectangle());
    bullet.tooltipText = `X{${PositionNames.posY}} Y{${PositionNames.posX}} : {value.workingValue.formatNumber("#.")} cows`;

    bullet.width = 10;
    bullet.height = 10;

    series.heatRules.push({
      target: bullet,
      property: 'fill',
      minValue: 0,
      maxValue: 20,
      min: am4core.color(bgColor),
      max: this.chart.colors.getIndex(0)
    });

    bullet.adapter.add('pixelHeight', (pixelHeight, target) => {
      const dataItem: any = target.dataItem;

      // tslint:disable-next-line:max-line-length
      const scalers = this.barnToChartScalers(barnWidth, barnHeight, dataItem.dataContext.wallpointWidth, dataItem.dataContext.wallpointHeight);
      const scaledHeight = scalers[1] * this.contentHeight;

      return scaledHeight;
    });

    bullet.adapter.add('pixelWidth', (pixelWidth, target) => {
      const dataItem: any = target.dataItem;

      // tslint:disable-next-line:max-line-length
      const scalers = this.barnToChartScalers(barnWidth, barnHeight, dataItem.dataContext.wallpointWidth, dataItem.dataContext.wallpointHeight);
      const scaledWidth = scalers[0] * this.contentWidth;

      return scaledWidth;
    });
  }

  private updateAxes() {    // Create axes
    const xAxis = this.chart.xAxes.push(new am4charts.ValueAxis());
    xAxis.renderer.minGridDistance = 50;
    xAxis.min = 0;
    xAxis.max = barnWidth;

    const yAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.renderer.minGridDistance = 50;
    yAxis.min = 0;
    yAxis.max = barnHeight;
  }

  private drawSensors() {
    for (const pos of this.sensors) {
      const sensor = new am4core.Image();
      sensor.href = 'assets/img/sensor_icon.svg';
      sensor.valign = 'top';
      sensor.align = 'right';

      const coords = this.barnCoordToChartCoord(barnWidth, barnHeight, this.contentWidth, this.contentHeight, pos.sensorX, pos.sensorY);
      sensor.marginRight = coords[0] - (sensor.innerWidth / 4);
      sensor.marginTop = coords[1] - (sensor.innerHeight / 4);

      sensor.zIndex = 100;
      this.chart.tooltipContainer.children.push(sensor);
      sensor.appear();
    }
  }

  private initializeData() {
    this.workpointsService.getSecondAlgorithmForSelectedTime(1, new Date('2020-01-22T15:40:00.000Z'))
      .subscribe((data: WallpointLocation[]) => {
        this.data = data;
        this.chart.data = this.data;
      });

    // this.data = [
    //   {
    //     // from lower left corner
    //     posX: 0,
    //     posY: 10,
    //     wallpointWidth: 20,
    //     wallpointHeight: 10,
    //     cowsCount: 1,
    //   },
    //   {
    //     posX: 0,
    //     posY: 20,
    //     wallpointWidth: 10,
    //     wallpointHeight: 10,
    //     cowsCount: 2,
    //   },
    //   {
    //     posX: 10,
    //     posY: 20,
    //     wallpointWidth: 10,
    //     wallpointHeight: 10,
    //     cowsCount: 3,
    //   },
    //   {
    //     posX: 20,
    //     posY: 20,
    //     wallpointWidth: 10,
    //     wallpointHeight: 10,
    //     cowsCount: 4,
    //   },
    //   {
    //     posX: 20,
    //     posY: 10,
    //     wallpointWidth: 10,
    //     wallpointHeight: 10,
    //     cowsCount: 5,
    //   }
    // ];
    // this.chart.data = this.data;
  }

  private initializeSensors() {
    this.sensors = [
      {
        sensorX: 0,
        sensorY: 10
      },
      {
        sensorX: 0,
        sensorY: 20
      },
      {
        sensorX: 10,
        sensorY: 20
      },
      {
        sensorX: 20,
        sensorY: 20
      },
      {
        sensorX: 30,
        sensorY: 20
      }
    ];
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  private barnToChartScalers(bWidth: number, bHeight: number, bX: number, bY: number) {
    const sX = bX / bWidth;
    const sY = bY / bHeight;

    return [sX, sY];
  }

  private barnCoordToChartCoord(bWidth: number, bHeight: number, cWidth: number, cHeight: number, bX: number, bY: number) {
    // assumes barn coords go from (0,0) in the bottom left, (maxX, maxY) in the top right

    let sX: number;
    let sY: number;
    [sX, sY] = this.barnToChartScalers(bWidth, bHeight, bX, bY);

    const cX = cWidth - cWidth * sX;
    const cY = cHeight - cHeight * sY;

    return [cX, cY];
  }
}


