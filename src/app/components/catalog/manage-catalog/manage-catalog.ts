import { Component, effect, inject, Input, OnInit, signal } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../../core/services/catalog.service';
import { BookService } from '../../../core/services/book.service';
import { ToastService } from '../../../core/services/toast.service';
import { Catalog } from '../../../core/models/catalog.model';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Loader } from '../../../core/components/loader/loader';

@Component({
  selector: 'app-manage-catalog',
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, Loader],
  templateUrl: './manage-catalog.html',
  styleUrl: './manage-catalog.scss',
})
export class ManageCatalog implements OnInit {
  // injecting services
  private bsModalRef = inject(BsModalRef);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  private catalogService = inject(CatalogService);
  private bookService = inject(BookService);

  @Input() catalog!: Catalog;
  @Input() searchQuery = '';
  isUpdate = false;
  form!: FormGroup;

  booksDropdown = this.bookService.dropdownBooks;
  dropdownLoading = this.bookService.dropdownLoading;
  dropdownError = this.bookService.dropdownError;
  loading = signal(false);

  constructor() {
    // Handle Dropdown Error
    effect(() => {
      const err = this.dropdownError();
      if (err) this.toast.error(err, 'Error', () => this.bookService.clearDropdownError());
    });
  }

  ngOnInit() {
    this.isUpdate = this.catalog != null;
    // Initialize form with input values
    this.form = this.fb.group({
      name: [this.catalog?.name || '', [Validators.required, Validators.maxLength(100)]],
      books: [this.catalog?.books || []],
    });

    // Load books dropdown
    this.bookService.loadBookDropdown();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const value: Catalog = this.form.value;
    if (this.isUpdate) {
      this.catalogService.updateCatalog(this.catalog.id, value).subscribe({
        next: () => {
          this.loading.set(false);
          this.catalogService.loadCatalogs(this.searchQuery);
          this.bsModalRef.hide();
        },
        error: (err) => {
          this.toast.error(err); // backend/API errors
          this.loading.set(false);
        },
      });
    } else {
      this.catalogService.createCatalog(value).subscribe({
        next: () => {
          this.toast.success('Catalog created successfully');
          this.loading.set(false);
          this.catalogService.loadCatalogs(this.searchQuery);
          this.bsModalRef.hide();
        },
        error: (err) => {
          this.toast.error(err); // backend/API errors
          this.loading.set(false);
        },
      });
    }
  }

  cancel() {
    this.bsModalRef.hide();
  }
}