import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map } from 'rxjs/operators';
import { Deserialize } from 'cerialize';

import { CowshedData, CowshedTimeRange } from '../charts/models/CowshedData.model';
import { UrlService } from '../../base/services/url.service';
import { Observable } from "rxjs";


@Component({
  selector: 'barn-selector',
  templateUrl: './barn-selector.component.html',
  // styleUrls: ['sliders.css']
})
export class BarnSelectorComponent implements OnInit, AfterViewInit {

  @Output()
  barnSelectedEventEmitter = new EventEmitter<CowshedData>();

  barnData$: Observable<Array<CowshedData>>;
  barnDataArray: Array<CowshedData>;

  constructor(private urlService: UrlService,
              private http: HttpClient) { }

  ngOnInit() {
    const path = 'getCowSheds';
    const restUrl = this.urlService.getUrl(path);

    this.barnData$ = this.http.get(restUrl).pipe(
      map((response: Array<any>) => Deserialize(response, CowshedData))
    );

    this.barnData$.subscribe(data => {
      this.barnDataArray = data;
      this.emitBarnId(0);
    });

  }

  ngAfterViewInit() {
  }


  emitBarnId(id: number) {
    console.log(this.barnDataArray[0]);
    this.barnSelectedEventEmitter.emit(this.barnDataArray[id]);
  }

  onDropdownChange(id: number) {
    this.emitBarnId(id);
  }
}
