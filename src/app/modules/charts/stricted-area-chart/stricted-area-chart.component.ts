import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_material from '@amcharts/amcharts4/themes/material';
import {CowPosition, CowShedSide} from '../../../base/models/cow-position.model';

const data: Array<CowPosition> = [];

function generateTestData() {
  // time - year, month, day, hour, minute
  const time = new Date(Date.UTC(2019, 10, 11, 0, 0));
  const endTime = new Date(Date.UTC(2019, 10, 11, 23, 59));
  for (time; time <= endTime; time.setTime(time.getTime() + (1 * 60 * 1000)/*in ms*/)) {
      for (let cowIter = 0; cowIter < 8; cowIter++) {
          const whichColumn = Math.floor((Math.random() * 10) + 1);
          const whichSide = cowIter % 2 === 0 ? CowShedSide.A : CowShedSide.B;
          data.push({
              time: new Date(time),
              id: cowIter.toString(),
              posX: whichColumn,
              posY: whichSide
          });
      }
  }
}

function parseData(whatTime, barnSize, isBarnSplit) {
  /* Master format :
  {
      "xpos": "1",
      "ypos": "A",
      "value": 5
  },
  */
  const filteredData = [];

  for (let i = 1; i <= barnSize; i++) {
      filteredData.push({
          xpos: i,
          ypos: 'A',
          value: 0
      });
  }
  if (isBarnSplit === true) {
      for (let i = 1; i <= barnSize; i++) {
          filteredData.push({
              xpos: i,
              ypos: 'B',
              value: 0
          });
      }
  }

  const dataTimeRange = data.filter((value: CowPosition) => value.time >= whatTime);
  for (const selectedData of dataTimeRange) {
      const idx = (selectedData.posX - 1) + (selectedData.posY === 'B' ? barnSize : 0);
      filteredData[idx].value += 1;
  }
  return filteredData;
}

@Component({
  selector: 'cows-stricted-area-chart',
  templateUrl: './stricted-area-chart.component.html'
})
export class StrictedAreaChartComponent implements OnInit, OnDestroy {
  private chart: am4charts.XYChart;

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      const chart = am4core.create('chartdiv', am4charts.XYChart);
      chart.maskBullets = false;

      const xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      const yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

      xAxis.dataFields.category = 'xpos';
      yAxis.dataFields.category = 'ypos';

      xAxis.renderer.grid.template.disabled = true;
      xAxis.renderer.minGridDistance = 40;

      yAxis.renderer.grid.template.disabled = true;
      yAxis.renderer.inversed = true;
      yAxis.renderer.minGridDistance = 30;

      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryX = 'xpos';
      series.dataFields.categoryY = 'ypos';
      series.dataFields.value = 'value';
      series.sequencedInterpolation = true;
      series.defaultState.transitionDuration = 3000;

      const bgColor = new am4core.InterfaceColorSet().getFor('background');

      const columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 1;
      columnTemplate.strokeOpacity = 0.2;
      columnTemplate.stroke = bgColor;
      columnTemplate.tooltipText = '{ypos}{xpos} : {value.workingValue.formatNumber("#.")} cows';
      columnTemplate.width = am4core.percent(100);
      columnTemplate.height = am4core.percent(100);

      series.heatRules.push({
          target: columnTemplate,
          property: 'fill',
          min: am4core.color(bgColor),
          max: chart.colors.getIndex(0)
      });

      generateTestData();

      const sensors = [
          {
              sensorX: 0,
              sensorY: 0
          },
          {
              sensorX: 0,
              sensorY: 300
          },
          {
              sensorX: 300,
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

  onTimeSelection(time: Date) {
    console.log(time);

    this.chart.data = parseData(time, 10, true);
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}

