import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Barns {
  
}

@Component({
  selector: 'barn-selector',
  templateUrl: './barn-selector.component.html',
  // styleUrls: ['sliders.css']
})

export class BarnSelectorComponent implements OnInit, AfterViewInit {

  @Output()
  barnSelectedEventEmitter = new EventEmitter<number>();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    //const restUrl = "http://10.0.0.11:8080/cowShed/getAll"

    //var barns;
    //this.http.get(restUrl).subscribe((data: any) => barns;

    //for (var i = 0; i < barns.length; i++) {
    //  console.log(barns[i].idCowshed + " " + barns[i].width);
    //}
  }

  ngAfterViewInit() {
  }

 
  emitBarnId(id: number) {
    this.barnSelectedEventEmitter.emit(id);
  }

  onDropdownChange(id: number) {
    this.emitBarnId(id);
  }
}
