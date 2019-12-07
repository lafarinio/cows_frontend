import { Injectable } from '@angular/core';
import { UrlService } from '../../../base/services/url.service';
import { Observable } from 'rxjs';
import { StrictedCowPosition } from '../models/stricted-cow-position.model';
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
}
