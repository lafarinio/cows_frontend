import { Injectable } from '@angular/core';
import { UrlService } from '../../../base/services/url.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { CowshedSection } from '../models/CowshedContent.model'; 

@Injectable({
  providedIn: 'root'
})
export class CowDataService {

  constructor(private ulrService: UrlService,
              private http: HttpClient) { }

  getDataWithTimestamp(restUrl: string, timestamp: Date): Observable<any> {
    const params = new HttpParams().set("timeStamp", timestamp.toISOString());

    return this.http.get(restUrl, { params: params }); 
  }

  getSectionsDataAlgoThree(timestamp: Date, barnId: number) {
    const dataUrl = "http://10.0.0.11:8080/timeLocation/getThirdAlgorithm/" + barnId;

    return this.getDataWithTimestamp(dataUrl, timestamp);
  }

  parseSectionPositionsToIndices(sections: Array<CowshedSection>) {
    let xPositionsMap = {};
    let yPositionsMap = {};

    // find all possible positions
    for (const section of sections) {
      xPositionsMap[section.posX] = Number(section.posX);
      yPositionsMap[section.posY] = Number(section.posY);
    }
    
    let xStep: number = 0;
    let yStep: number = 0;
    
    // positions should go: 0, xStep, 2*xStep, 3*xStep etc.
    const xArr: Array<number> = Object.values(xPositionsMap);
    if (xArr.length > 1) {
      xArr.sort((a: number, b: number) => a - b);
      
      xStep = xArr[1];
    }

    const yArr: Array<number> = Object.values(yPositionsMap);
    if (yArr.length > 1) {
      yArr.sort((a: number, b: number) => a - b);
      
      yStep = yArr[1];
    }
    
    // turn positions into indices, due to width not dividing cleanly, some of the positions are off by a bit
    for (let i = 0; i < sections.length; i++) {
      if (xStep != 0) {
	sections[i].posX = Math.floor(sections[i].posX / xStep);
      }

      if (yStep != 0) {
	  sections[i].posY = Math.floor(sections[i].posY / yStep);
      }
    }

    console.log("DEBUG parseSectionPositionsToIndices")
    console.log(sections)
  }
}
