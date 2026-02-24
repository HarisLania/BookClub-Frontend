import { inject, Injectable, WritableSignal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ToastService {
    private toastr = inject(ToastrService);

    success(message: string, title?: string) {
        this.toastr.success(message, title);
    }

    error(message: string, title?: string, clearSignal?: WritableSignal<string | null>) {
        this.toastr.error(message, title);

        // 🔹 if an error signal is provided, clear it after toast timeout
        if (clearSignal) {
            setTimeout(() => {
                clearSignal.set(null);
            }, 5000); // match your toast timeout
        }
    }

    info(message: string, title?: string) {
        this.toastr.info(message, title);
    }

    warning(message: string, title?: string) {
        this.toastr.warning(message, title);
    }
}