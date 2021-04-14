import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { version, name, author } from '../package.json';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic([
  {
    provide: 'SERVER_URL',
    useValue: environment.backendUrl
  },
  {
    provide: 'APP_PUBLISHER',
    useValue: author
  },
  {
    provide: 'APP_NAME',
    useValue: name
  },
  {
    provide: 'APP_VERSION',
    useValue: version
  }
]).bootstrapModule(AppModule)
  .catch(err => console.log(err));
