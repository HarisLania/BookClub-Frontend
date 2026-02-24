import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ToastService {
    private toastr = inject(ToastrService);

    success(message: string, title?: string) {
        this.toastr.success(message, title);
    }

    error(message: string, title?: string, cleanup?: () => void) {
        this.toastr.error(message, title);
        if (cleanup) {
            setTimeout(() => {
                cleanup();
            }, 5000);
        }
    }

    info(message: string, title?: string) {
        this.toastr.info(message, title);
    }

    warning(message: string, title?: string) {
        this.toastr.warning(message, title);
    }
}