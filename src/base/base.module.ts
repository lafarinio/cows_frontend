import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UrlService } from './services/url-composer/url.service';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule
  ],
  providers: [UrlService]
})
export class BaseModule { }
