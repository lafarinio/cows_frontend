import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_material from '@amcharts/amcharts4/themes/material';
import {PositionNames} from "../../../base/models/position.model";
import {StrictedAreaPosition} from "../../../base/models/srticted-area-position.model";
import {WorkpointAreaPosition} from "../models/workpoint-area-position.model";

@Component({
  selector: 'cows-work-points-chart',
  templateUrl: './work-points-chart.component.html'
})
export class WorkPointsChartComponent implements OnInit, OnDestroy {
  private chart: am4charts.XYChart;

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      const chart = am4core.create('chartdiv', am4charts.XYChart);
      chart.colors.step = 3;

      // Create axes
      const xAxis = chart.xAxes.push(new am4charts.ValueAxis());
      xAxis.renderer.minGridDistance = 50;
      xAxis.min = 0;
      xAxis.max = 30;

      const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.renderer.minGridDistance = 50;
      yAxis.min = 0;
      yAxis.max = 20;

      const bgColor = new am4core.InterfaceColorSet().getFor('background');

      // Create series #1
      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = PositionNames.posY;
      series.dataFields.valueX = PositionNames.posX;
      series.dataFields.value = PositionNames.value;
      series.strokeOpacity = 0;
      series.name = 'Series 1';

      const bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.strokeOpacity = 0.2;
      bullet.stroke = am4core.color('#ffffff');
      bullet.nonScalingStroke = true;
      bullet.tooltipText = `"x:{${PositionNames.posX} y:{${PositionNames.posY}}"`;

      bullet.circle.radius = 60;

      series.heatRules.push({
          target: bullet.circle,
          property: 'fill',
          minValue: 0,
          maxValue: 20,
          min: am4core.color(bgColor),
          max: chart.colors.getIndex(0)
      });

      const data: Array<WorkpointAreaPosition> = [
          {
              posY: 10,
              posX: 0,
              value: 59,
          },
          {
              posY: 0,
              posX: 10,
              value: 50,
          },
          {
              posY: 0,
              posX: 20,
              value: 40,
          },
          {
              posY: 10,
              posX: 30,
              value: 65,
          },
          {
              posY: 20,
              posX: 20,
              value: 92,
          },
          {
              posY: 20,
              posX: 10,
              value: 30,
          }
      ];

      chart.data = data;


      const sensors = [
          {
              sensorX: 450,
              sensorY: 0
          },
          {
              sensorX: 0,
              sensorY: 200
          },
          {
              sensorX: 250,
              sensorY: 0
          }
      ];

      for (const pos of sensors) {
        const sensor = new am4core.Image();
        sensor.href = 'assets/img/sensor_icon.svg';

        sensor.valign = 'top';
        sensor.align = 'right';

        sensor.marginTop = pos.sensorY;
        sensor.marginRight = pos.sensorX;

        sensor.zIndex = 100;

        chart.tooltipContainer.children.push(sensor);
        sensor.appear();
      }

      this.chart = chart;
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}


