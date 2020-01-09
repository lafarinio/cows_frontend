import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'barn-selector',
  templateUrl: './barn-selector.component.html',
  // styleUrls: ['sliders.css']
})
export class BarnSelectorComponent implements OnInit, AfterViewInit {

  @Output()
  barnSelectedEventEmitter = new EventEmitter<any>(); // CowshedData

  barnData: any //Observable<Array<CowshedData>>
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
    const restUrl = "http://10.0.0.11:8080/cowShed/getAll"

    this.barnData = this.http.get(restUrl);

    this.emitBarnId(0);
  }

  ngAfterViewInit() {
  }

 
  emitBarnId(id: number) {
    this.barnData.subscribe(data => { // TODO: add pipe(first())
      this.barnSelectedEventEmitter.emit(data[id]);
    });
    
    //this.barnSelectedEventEmitter.emit(id);
  }

  onDropdownChange(id: number) {
    this.emitBarnId(id);
  }
}
