import { Injectable } from '@angular/core';
import { finalEnvironment } from '../../../environments/final.environment';
import { keyBy } from 'lodash';
import { exists } from '../operators/exists';
import { Dictionary } from '../../shared/models/dictionary.model';
import { dictionarySerializer } from "../../shared/serializers/dictionary.serializer";

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor() {}

  getUrl(path: string, params?: object) {
    const prefix = this.getBaseUrl();
    const suffix = this.getSuffix(path, params);

    return [prefix, suffix]
      .filter(exists)
      .join('/');
  }

  injectPathParameters(path: string, parameters: Dictionary<any>): string {

    return Object.getOwnPropertyNames(parameters)
      .reduce((previousPath, parameterName) => this.replaceAll(previousPath, parameterName, parameters[parameterName]), path);
  }

  private getBaseUrl(): string {
    return finalEnvironment.baseUrl;
  }

  private getSuffix(path: string, params?: Dictionary<any>) {
    const suffix = this.getUrlPath(path);
    const urlParams = params && keyBy(params);
    if (exists(urlParams)) {
      return this.injectPathParameters(suffix, urlParams);
    }
    return suffix;
  }

  private getUrlPath(path: string): string {
    const configuration = finalEnvironment.urlsConfiguration;
    const urlList: Dictionary<any> = dictionarySerializer.Deserialize(configuration);
    return urlList[path];
  }

  private replaceAll(input: string, toReplace: string, replacement: string): string {
    return input.split(`:${toReplace}`).join(replacement);  // funkcjonalne replaceAll
  }
}
