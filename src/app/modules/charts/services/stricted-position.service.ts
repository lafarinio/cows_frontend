import { Injectable } from '@angular/core';
import { UrlService } from '../../../base/services/url.service';
import { Observable } from 'rxjs';
import { StrictedCowPosition } from '../models/stricted-cow-position.model';
import { CowShedSide } from '../models/position.model';
import { StrictedAreaPosition } from '../models/srticted-area-position.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Deserialize } from 'cerialize';
import { CowshedContent, CowshedSection } from '../models/CowshedContent.model';
import { CowDataService } from './cow-data.service';

@Injectable({
  providedIn: 'root'
})
export class StrictedPositionService {

  constructor(private ulrService: UrlService,
              private cowsService: CowDataService,
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

  getFirstOrThirdAlgorithmForSelectedTime(idCowShed: number, selectedDate: Date, path: string): Observable<Array<CowshedSection>> {
    const urlParams = {idCowShed};
    const url = this.ulrService.getUrl(path, urlParams);

    const timeStamp = selectedDate.toISOString();
    const params = {timeStamp};

    console.log(path, url);
    return this.http.get(url, {params}).pipe(
      map(response => {
        return Deserialize(response, CowshedContent);
      }),
      map((data: CowshedContent) => this.cowsService.parseSectionPositionsToIndices(data.cowshedSections)),
      tap(a => console.log(a))
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
