import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    templateUrl: './confirm-modal.html',
    styleUrl: './confirm-modal.scss',
})
export class ConfirmModal {
    public bsModalRef = inject(BsModalRef);

    title = 'Confirm';
    message = 'Are you sure?';
    btnConfirmText = 'Confirm';
    btnCancelText = 'Cancel';
    isDanger = true;

    public onClose: Subject<boolean> = new Subject<boolean>();

    confirm() {
        this.onClose.next(true);
        this.bsModalRef.hide();
    }

    decline() {
        this.onClose.next(false);
        this.bsModalRef.hide();
    }
}
