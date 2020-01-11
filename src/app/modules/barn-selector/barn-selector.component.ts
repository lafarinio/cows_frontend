import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { Deserialize } from 'cerialize';

import { CowshedData } from '../charts/models/CowshedData.model';


@Component({
  selector: 'barn-selector',
  templateUrl: './barn-selector.component.html',
  // styleUrls: ['sliders.css']
})
export class BarnSelectorComponent implements OnInit, AfterViewInit {

  @Output()
  barnSelectedEventEmitter = new EventEmitter<CowshedData>();

  barnData: any; //Observable<Array<CowshedData>>
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
    const restUrl = "http://10.0.0.11:8080/cowShed/getAll"

    this.barnData = this.http.get(restUrl);

    this.emitBarnId(0);
  }

  ngAfterViewInit() {
  }

 
  emitBarnId(id: number) {
    this.barnData.pipe(first()).subscribe(data => {
      const barnData: CowshedData = Deserialize(data[id], CowshedData);
      this.barnSelectedEventEmitter.emit(barnData);
    });
  }

  onDropdownChange(id: number) {
    this.emitBarnId(id);
  }
}
