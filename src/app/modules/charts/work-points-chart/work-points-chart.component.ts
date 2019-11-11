import { Component, OnInit, NgZone } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_material from "@amcharts/amcharts4/themes/material";

@Component({
  selector: 'cows-work-points-chart',
  templateUrl: './work-points-chart.component.html'
})
export class WorkPointsChartComponent {
  private chart: am4charts.XYChart;

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      let chart = am4core.create('chartdiv', am4charts.XYChart);
      chart.colors.step = 3;

      // Create axes
      let xAxis = chart.xAxes.push(new am4charts.ValueAxis());
      xAxis.renderer.minGridDistance = 50;
      xAxis.min = 0;
      xAxis.max = 30;

      let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.renderer.minGridDistance = 50;
      yAxis.min = 0;
      yAxis.max = 20;

      const bgColor = new am4core.InterfaceColorSet().getFor('background');

      // Create series #1
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = 'y';
      series.dataFields.valueX = 'x';
      series.dataFields.value = 'value';
      series.strokeOpacity = 0;
      series.name = 'Series 1';

      let bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.strokeOpacity = 0.2;
      bullet.stroke = am4core.color('#ffffff');
      bullet.nonScalingStroke = true;
      bullet.tooltipText = '":{valueX} y:{valueY}"';

      bullet.circle.radius = 60;

      series.heatRules.push({
          target: bullet.circle,
          property: 'fill',
          minValue: 0,
          maxValue: 20,
          min: am4core.color(bgColor),
          max: chart.colors.getIndex(0)
      });

      chart.data = [
          {
              y: 10,
              x: 0,
              value: 59,
          },
          {
              y: 0,
              x: 10,
              value: 50,
          },
          {
              y: 0,
              x: 20,
              value: 40,
          },
          {
              y: 10,
              x: 30,
              value: 65,
          },
          {
              y: 20,
              x: 20,
              value: 92,
          },
          {
              y: 20,
              x: 10,
              value: 30,
          }
      ];


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
      ]

      for (let pos of sensors) {
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


