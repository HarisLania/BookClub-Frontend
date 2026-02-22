import { inject, Injectable, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { isPlatformServer } from '@angular/common';

const APP_CONFIG_KEY = makeStateKey<{ apiBaseUrl: string }>('app-config');

@Injectable({ providedIn: 'root' })
export class AppConfigService {
    private config!: { apiBaseUrl: string };
    private platformId = inject(PLATFORM_ID);
    private transferState = inject(TransferState);

    async load(): Promise<void> {
        if (this.transferState.hasKey(APP_CONFIG_KEY)) {
            this.config = this.transferState.get(APP_CONFIG_KEY, { apiBaseUrl: '' });
            console.log('✅ Browser: config loaded from TransferState', this.config);
            return;
        }

        if (isPlatformServer(this.platformId)) {
            try {
                const fs = await import('node:fs/promises');
                const path = await import('node:path');
                const configPath = path.join(process.cwd(), 'src/assets/config/app-config.json');
                const content = await fs.readFile(configPath, 'utf-8');
                const data = JSON.parse(content);

                this.config = data;
                this.transferState.set(APP_CONFIG_KEY, data);
                console.log('✅ Server: config loaded from disk');
            } catch (err) {
                console.error('❌ Server: failed to load config from disk', err);
                this.config = { apiBaseUrl: 'http://localhost:8000/api' };
            }
        }
    }

    get apiBaseUrl(): string {
        if (!this.config) {
            throw new Error('Config not loaded! Check if SSR is enabled and TransferState is working.');
        }
        return this.config.apiBaseUrl;
    }
}