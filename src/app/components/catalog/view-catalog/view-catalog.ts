import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CatalogService } from '../../../core/services/catalog.service';
import { CatalogDetails } from '../../../core/models/catalog.model';
import { Loader } from '../../../core/components/loader/loader';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-view-catalog',
  imports: [Loader],
  templateUrl: './view-catalog.html',
  styleUrl: './view-catalog.scss',
})
export class ViewCatalog implements OnInit {
  // injecting services
  private bsModalRef = inject(BsModalRef);
  private catalogService = inject(CatalogService);
  private toast = inject(ToastService);

  @Input() catalogId!: number;
  catalog = signal<CatalogDetails | null>(null);
  loading = signal(false);

  ngOnInit() {
    this.loading.set(true);
    // call API directly inside modal
    this.catalogService.getCatalog(this.catalogId).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (data: CatalogDetails) => this.catalog.set(data),
      error: (err) => this.toast.error(err),
    });
  }

  close() {
    this.bsModalRef.hide();
  }
}