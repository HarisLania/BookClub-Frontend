import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loader',
    standalone: true,
    template: `
    <div class="loading-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center">
        <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <p class="fw-bold text-uppercase tracking-wider small">{{ message }}</p>
    </div>
  `,
    styles: [`
    :host {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1050;
    }
  `]
})
export class Loader {
    @Input() message = 'Loading...';
}
