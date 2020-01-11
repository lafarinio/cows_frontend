import { Injectable } from '@angular/core';
import { UrlService } from '../../../base/services/url.service';
import { Observable } from 'rxjs';
import { StrictedCowPosition } from '../models/stricted-cow-position.model';
import { CowShedSide } from '../models/position.model';
import { StrictedAreaPosition } from '../models/srticted-area-position.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Deserialize } from 'cerialize';

@Injectable({
  providedIn: 'root'
})
export class CowDataService {

  constructor(private ulrService: UrlService,
              private http: HttpClient) { }

  getDataWithTimestamp(restUrl: string, timestamp: Date): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const params = new HttpParams().set("timeStamp", timestamp.toISOString());

    return this.http.get(restUrl, { /*headers: headers, */params: params }); 
  } 
}
