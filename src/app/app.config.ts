import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
import { AppConfigService } from './core/config/app-config.service';
import { provideToastr } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { importProvidersFrom } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(ModalModule.forRoot()),

    // ✅ ngx-toastr global configuration
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
    }),

    provideAppInitializer(() => {
      const configService = inject(AppConfigService);
      return configService.load();
    }),
  ],
};