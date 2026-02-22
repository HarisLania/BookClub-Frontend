import { inject } from '@angular/core';
import { AppConfigService } from './app-config.service';

export const API_CONFIG = () => {
    const config = inject(AppConfigService);

    return {
        BASE_URL: config.apiBaseUrl,
    };
};