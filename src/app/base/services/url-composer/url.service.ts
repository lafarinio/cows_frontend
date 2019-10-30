import { Injectable } from '@angular/core';
import { finalEnvironment } from '../../../../environments/final.environment';
import { keyBy } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor() {}

  private getUrlPath(urlKey: string, params?: object) {
    const urlList = keyBy(finalEnvironment.urlsConfiguration);
    const urlParams = params && keyBy(params);
  }

  private getBaseUrl(): string {
    return finalEnvironment.baseUrl;
  }
}
