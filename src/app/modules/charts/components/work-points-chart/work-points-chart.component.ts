import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_material from '@amcharts/amcharts4/themes/material';
import { PositionNames } from '../../models/position.model';
import { WorkpointAreaPosition } from '../../models/workpoint-area-position.model';
import { UrlService } from '../../../../base/services/url.service';

function barnToChartScalers(bWidth: number, bHeight: number, bX: number, bY: number) {
  const sX = bX / bWidth;
  const sY = bY / bHeight;

  return [sX, sY];
}

function barnCoordToChartCoord(bWidth: number, bHeight: number, cWidth: number, cHeight: number, bX: number, bY: number) {
  // assumes barn coords go from (0,0) in the bottom left, (maxX, maxY) in the top right

  let sX: number;
  let sY: number;
  [sX, sY] = barnToChartScalers(bWidth, bHeight, bX, bY);
  
  const cX = cWidth - cWidth * sX;
  const cY = cHeight - cHeight * sY;

  return [cX, cY];
}

const barnWidth = 30
const barnHeight = 20


@Component({
  selector: 'cows-work-points-chart',
  templateUrl: './work-points-chart.component.html'
})
export class WorkPointsChartComponent implements OnInit, OnDestroy {
  private chart: am4charts.XYChart;

  constructor(private zone: NgZone,
              private urlService: UrlService) {}

  onBarnSelection(barnId: number) {
    console.log("Selected barn " + barnId);
  }


  onTimeSelection(time: Date) {
    console.log(time);
  }
  
  ngOnInit() {
    // const example = this.urlService.getUrl('cow', {id: '123'});
    // console.log(example);
    // const example2 = this.urlService.getUrl('cowLists');
    // console.log(example2);
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      const chart = am4core.create('chartdiv', am4charts.XYChart);
      chart.colors.step = 3;

      // Create axes
      const xAxis = chart.xAxes.push(new am4charts.ValueAxis());
      xAxis.renderer.minGridDistance = 50;
      xAxis.min = 0;
      xAxis.max = barnWidth;

      const yAxis = chart.yAxes.push(new am4charts.ValueAxis());
      yAxis.renderer.minGridDistance = 50;
      yAxis.min = 0;
      yAxis.max = barnHeight;

      const bgColor = new am4core.InterfaceColorSet().getFor('background');

      // Create series #1
      const series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = PositionNames.posY;
      series.dataFields.valueX = PositionNames.posX;
      series.dataFields.value = PositionNames.value;
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
          max: chart.colors.getIndex(0)
      });

      const contentHeight = 428.67;
      const contentWidth = 742;

      bullet.adapter.add("pixelHeight", function (pixelHeight, target) {
	var dataItem:any = target.dataItem;

	const scalers = barnToChartScalers(barnWidth, barnHeight, dataItem.dataContext.sensorWidth, dataItem.dataContext.sensorHeight)
	const scaledHeight = scalers[1] * contentHeight       
	
	return scaledHeight;
      });
			 
      bullet.adapter.add("pixelWidth", function (pixelWidth, target) {
	const dataItem: any = target.dataItem;

	const scalers = barnToChartScalers(barnWidth, barnHeight, dataItem.dataContext.sensorWidth, dataItem.dataContext.sensorHeight)
	const scaledWidth = scalers[0] * contentWidth       
	
	return scaledWidth;
      });
					    
      const data = [
        {
	  // from lower left corner
	  posX: 0,
	  posY: 10, 
	  sensorWidth: 20,
	  sensorHeight: 10,
          value: 1,
        },
        {
	  posX: 0,
          posY: 20,
	  sensorWidth: 10,
	  sensorHeight: 10,
          value: 2,
        },
        {
	  posX: 10,
          posY: 20,
	  sensorWidth: 10,
	  sensorHeight: 10,
          value: 3,
        },
        {
	  posX: 20,
          posY: 20,
	  sensorWidth: 10,
	  sensorHeight: 10,
          value: 4,
        },
        {
	  posX: 20,
          posY: 10,
	  sensorWidth: 10,
	  sensorHeight: 10,
          value: 5,
        }
      ];

      chart.data = data;

      const sensors = [
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

      for (const pos of sensors) {
	const sensor = new am4core.Image();
	sensor.href = 'assets/img/sensor_icon.svg';
	sensor.valign = 'top';
	sensor.align = 'right';

	const coords = barnCoordToChartCoord(barnWidth, barnHeight, contentWidth, contentHeight, pos.sensorX, pos.sensorY);
	sensor.marginRight = coords[0] - (sensor.innerWidth / 4);
	sensor.marginTop = coords[1] - (sensor.innerHeight / 4);
	
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


