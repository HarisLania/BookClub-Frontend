import { Component, inject, Input, OnInit, Signal } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../../core/services/catalog.service';
import { BookService } from '../../../core/services/book.service';
import { ToastService } from '../../../core/services/toast.service';
import { Catalog } from '../../../core/models/catalog.model';
import { BookDropdown } from '../../../core/models/book.model';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-manage-catalog',
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
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
  booksDropdown!: Signal<BookDropdown[]>;
  loading = false;

  ngOnInit() {
    this.isUpdate = this.catalog != null;
    // Initialize form with input values
    this.form = this.fb.group({
      name: [this.catalog?.name || '', Validators.required],
      books: [this.catalog?.books || []],
    });

    // Load books dropdown
    this.bookService.loadBookDropdown();
    this.booksDropdown = this.bookService.dropdownBooks;
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const value: Catalog = this.form.value;
    if (this.isUpdate) {
      this.catalogService.updateCatalog(this.catalog.id, value).subscribe({
        next: () => {
          this.toast.success('Catalog updated successfully');
          this.catalogService.loadCatalogs(this.searchQuery);
          this.bsModalRef.hide();
          this.loading = false;
        },
        error: (err) => {
          this.toast.error(err); // backend/API errors
          this.loading = false;
        },
      });
    } else {
      this.catalogService.createCatalog(value).subscribe({
        next: () => {
          this.toast.success('Catalog created successfully');
          this.catalogService.loadCatalogs(this.searchQuery);
          this.bsModalRef.hide();
          this.loading = false;
        },
        error: (err) => {
          this.toast.error(err); // backend/API errors
          this.loading = false;
        },
      });
    }
  }

  cancel() {
    this.bsModalRef.hide();
  }
}