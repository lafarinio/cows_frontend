import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UrlService } from './services/url.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [UrlService]
})
export class BaseModule { }
