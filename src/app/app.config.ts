import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { BOOK_SERVICE_TOKEN } from './core/tokens/book-service.token';
import { BOOK_SERVICE_FACTORY_PROVIDER } from './core/factories/book-service.factory';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(),
    provideAnimationsAsync(),
    { provide: BOOK_SERVICE_TOKEN, ...BOOK_SERVICE_FACTORY_PROVIDER }
  ]
};
