import { Component, signal, effect, inject } from '@angular/core';
import { CatalogService } from '../../../core/services/catalog.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastService } from '../../../core/services/toast.service';
import { Catalog } from '../../../core/models/catalog.model';
import { ManageCatalog } from '../manage-catalog/manage-catalog';
import { ViewCatalog } from '../view-catalog/view-catalog';
import { ConfirmModal } from '../../../core/components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-main-catalog',
  imports: [],
  templateUrl: './main-catalog.html',
  styleUrl: './main-catalog.scss',
})
export class MainCatalog {
  private catalogService = inject(CatalogService);
  private modalService = inject(BsModalService);
  private toast = inject(ToastService);

  catalogs = this.catalogService.catalogs;
  catalogsLoading = this.catalogService.catalogsLoading;
  catalogsError = this.catalogService.catalogsError;

  catalogSearchQuery = signal('');
  debouncedCatalogSearchQuery = signal('');
  bsModalRef!: BsModalRef;

  constructor() {

    // Catalog Debounce Search
    effect((onCleanup) => {
      const term = this.catalogSearchQuery();

      const t = setTimeout(() => {
        this.debouncedCatalogSearchQuery.set(term);
      }, 400);

      onCleanup(() => clearTimeout(t));
    });

    // 🔹 load catalogs whenever search changes
    effect(() => {
      this.catalogService.loadCatalogs(this.debouncedCatalogSearchQuery());
    });

    // 🔹 show toast automatically when error occurs and clear the signal
    effect(() => {
      const err = this.catalogsError();
      if (err) this.toast.error(err, 'Error', () => this.catalogService.clearCatalogsError());
    });
  }

  onSearchInput(value: string) {
    this.catalogSearchQuery.set(value);
  }

  openCreateModal() {
    this.bsModalRef = this.modalService.show(ManageCatalog, {
      initialState: { catalogSearchQuery: this.debouncedCatalogSearchQuery() },
    });
  }

  openEditModal(catalog: Catalog) {
    this.bsModalRef = this.modalService.show(ManageCatalog, {
      initialState: { catalog, catalogSearchQuery: this.debouncedCatalogSearchQuery() },
    });
  }

  openViewModal(catalogId: number) {
    this.bsModalRef = this.modalService.show(ViewCatalog, {
      initialState: { catalogId }, // just pass the ID
    });
  }

  deleteCatalog(catalogId: number) {
    this.bsModalRef = this.modalService.show(ConfirmModal, {
      initialState: {
        title: 'Delete Catalog',
        message: 'Are you sure you want to delete this catalog? This action cannot be undone.',
        btnConfirmText: 'Delete',
        isDanger: true
      }
    });

    this.bsModalRef.content.onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.catalogService.deleteCatalog(catalogId)
          .subscribe({
            next: () => {
              this.catalogService.loadCatalogs(this.debouncedCatalogSearchQuery()); // refresh list
              this.toast.success('Catalog deleted successfully');
            },
            error: (err) => {
              this.toast.error(this.catalogService['extractErrorMessage'](err)); // directly show toast
            }
          });
      }
    });
  }
}
