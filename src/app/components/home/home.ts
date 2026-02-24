import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BookService } from '../../core/services/book.service';
import { CatalogService } from '../../core/services/catalog.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private bookService = inject(BookService);
  private catalogService = inject(CatalogService);
  private toast = inject(ToastService);

  // UI state
  selectedCatalog = signal<number | null>(null);
  bookSearchQuery = signal('');
  debouncedBookSearchQuery = signal('');

  catalogSearchQuery = signal('');
  debouncedCatalogSearchQuery = signal('');

  // expose service signals (Book)
  books = this.bookService.books;
  loading = this.bookService.booksLoading;
  error = this.bookService.booksError;

  // expose service signals (Catalog)
  catalogDropdownLoading = this.catalogService.dropdownLoading;
  catalogDropdownError = this.catalogService.dropdownError;
  catalogDropdown = this.catalogService.dropdownCatalogs;

  constructor() {

    // Book Debounce Effect
    effect((onCleanup) => {
      const value = this.bookSearchQuery();

      const timeoutId = setTimeout(() => {
        this.debouncedBookSearchQuery.set(value);
      }, 400);

      onCleanup(() => clearTimeout(timeoutId));
    });

    // Catalog Debounce Effect
    effect((onCleanup) => {
      const term = this.catalogSearchQuery();

      if (!term || term.length < 2) return;

      const t = setTimeout(() => {
        this.debouncedCatalogSearchQuery.set(term);
      }, 250);

      onCleanup(() => clearTimeout(t));
    });

    effect(() => {
      this.bookService.loadBooks({
        catalogId: this.selectedCatalog(),
        search: this.debouncedBookSearchQuery(),
      });
    });

    effect(() => {
      this.catalogService.loadCatalogDropdown(this.debouncedCatalogSearchQuery());
    });

    // Handle Catalog Dropdown Error
    effect(() => {
      const err = this.catalogDropdownError();
      if (err) this.toast.error(err, 'Error', () => this.catalogService.clearDropdownError());
    });
  }
}
