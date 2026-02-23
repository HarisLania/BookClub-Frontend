import { Component, effect, inject, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book.model';
import { CatalogDropdown } from '../../core/models/catalog.model';
import { CatalogService } from '../../core/services/catalog.service';

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

  // UI state
  selectedCatalog = signal<number | null>(null);
  bookSearchQuery = signal('');
  debouncedBookSearchQuery = signal('');

  catalogSearchQuery = signal('');
  debouncedCatalogSearchQuery = signal('');

  // expose service signals (Book)
  books!: Signal<Book[]>;
  loading!: Signal<boolean>;
  error!: Signal<string | null>;

  // expose service signals (Catalog)
  catalogDropdownLoading!: Signal<boolean>;
  catalogDropdownError!: Signal<string | null>;
  catalogDropdown!: Signal<CatalogDropdown[]>;

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

    // Book Signals
    this.books = this.bookService.books;
    this.loading = this.bookService.booksLoading;
    this.error = this.bookService.booksError;

    effect(() => {
      this.bookService.loadBooks({
        catalogId: this.selectedCatalog(),
        search: this.debouncedBookSearchQuery(),
      });
    });

    // Catalog Signals
    this.catalogDropdown = this.catalogService.dropdownCatalogs;
    this.catalogDropdownLoading = this.catalogService.dropdownLoading;
    this.catalogDropdownError = this.catalogService.dropdownError;

    effect(() => {
      this.catalogService.loadCatalogDropdown(this.debouncedCatalogSearchQuery());
    });
  }
}
