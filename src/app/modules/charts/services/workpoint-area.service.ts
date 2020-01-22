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
import { WallpointLocation } from '../models/WallpointLocation.model';

@Injectable({
  providedIn: 'root'
})
export class WorkpointAreaService {

  constructor(private ulrService: UrlService,
              private cowsService: CowDataService,
              private http: HttpClient) { }


  getSecondAlgorithmForSelectedTime(idCowShed: number, selectedDate: Date): Observable<Array<WallpointLocation>> {
    const urlParams = {idCowShed};
    const path = 'secondAlgorithm';
    const url = this.ulrService.getUrl(path, urlParams);

    const timeStamp = selectedDate.toISOString();
    const params = {timeStamp};

    console.log(path, url);
    return this.http.get(url, {params}).pipe(
      map((response: any) => {
        console.log(response);
        return Deserialize(response.wallpointLocationDtoList, WallpointLocation);
      }),
      tap(a => console.log(a))
    );
  }
}
