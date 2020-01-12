import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { Deserialize } from 'cerialize';

import { CowshedData, CowshedTimeRange } from '../charts/models/CowshedData.model';
import { UrlService } from '../../base/services/url.service';


@Component({
  selector: 'barn-selector',
  templateUrl: './barn-selector.component.html',
  // styleUrls: ['sliders.css']
})
export class BarnSelectorComponent implements OnInit, AfterViewInit {

  @Output()
  barnSelectedEventEmitter = new EventEmitter<CowshedData>();

  barnData: any; //Observable<Array<CowshedData>>

  constructor(private urlService: UrlService,
              private http: HttpClient) { }

  ngOnInit() {
    const path = 'getCowSheds';
    const restUrl = this.urlService.getUrl(path);

    this.barnData = this.http.get(restUrl);

    this.emitBarnId(0);
  }

  ngAfterViewInit() {
  }


  emitBarnId(id: number) {
    this.barnData.pipe(first()).subscribe(data => {
      const selectedBarnData: CowshedData = Deserialize(data[id], CowshedData);
      this.barnSelectedEventEmitter.emit(selectedBarnData);
    });
  }

  onDropdownChange(id: number) {
    this.emitBarnId(id);
  }
}
