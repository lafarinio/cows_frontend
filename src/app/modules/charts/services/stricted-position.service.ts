import { Injectable } from '@angular/core';
import { UrlService } from '../../../base/services/url.service';
import { Observable } from 'rxjs';
import { StrictedCowPosition } from '../models/stricted-cow-position.model';
import { CowShedSide } from '../models/position.model';
import { StrictedAreaPosition } from '../models/srticted-area-position.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Deserialize } from 'cerialize';

@Injectable({
  providedIn: 'root'
})
export class StrictedPositionService {

  constructor(private ulrService: UrlService,
              private http: HttpClient) { }

  getCows(): Observable<Array<StrictedCowPosition>> {
    const path = 'cowLists';
    const url = this.ulrService.getUrl(path);
    console.log(path, url);
    return this.http.get(url).pipe(
      map(response => {
        return Deserialize(response, StrictedCowPosition);
      })
    );
  }

  parseData(data: Array<StrictedCowPosition>, whatTime: Date, barnSize, isBarnSplit): Array<StrictedAreaPosition> {
    const filteredData: Array<StrictedAreaPosition> = [];

    // creating the barn layout
    for (let i = 1; i <= barnSize; i++) {
      filteredData.push({
	posX: i,
	posY: CowShedSide.A,
	value: 0
      });
    }
    if (isBarnSplit === true) {
      for (let i = 1; i <= barnSize; i++) {
	filteredData.push({
	  posX: i,
	  posY: CowShedSide.B,
	  value: 0
	});
      }
    }

    const dataTimeRange = data.filter((value: StrictedCowPosition) => value.time.getTime() === whatTime.getTime());
    for (const selectedData of dataTimeRange) {
      const idx = (selectedData.posX - 1) + (selectedData.posY === CowShedSide.B ? barnSize : 0);
      filteredData[idx].value += 1;
    }
    return filteredData;
  }
}
