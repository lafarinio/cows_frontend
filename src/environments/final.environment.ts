import { urlsConfiguration } from './base.environment';
import { environment } from './environment';

export const finalEnvironment = {...urlsConfiguration, ...environment};
