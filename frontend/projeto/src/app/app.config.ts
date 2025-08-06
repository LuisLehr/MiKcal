import { ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { importProvidersFrom } from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt, 'pt');

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
              provideRouter(routes),
              provideHttpClient(),
              importProvidersFrom(
                NgCircleProgressModule.forRoot({
                  radius: 80,
                  outerStrokeWidth: 16,
                  innerStrokeWidth: 8,
                  outerStrokeColor: '#78C000',
                  innerStrokeColor: '#C7E596',
                  animation: true,
                  animationDuration: 300,
                })
              ),
            ],
};
