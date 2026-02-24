import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { finalize } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Book, BookDropdown } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService {
    private api = API_CONFIG();
    private http = inject(HttpClient);

    // 🔹 state
    private _books = signal<Book[]>([]);
    private _dropdownBooks = signal<BookDropdown[]>([]);
    private _booksLoading = signal(false);
    private _dropdownLoading = signal(false);
    private _booksError = signal<string | null>(null);
    private _dropdownError = signal<string | null>(null);

    // 🔹 Expose Read-only Signals
    books = this._books.asReadonly();
    dropdownBooks = this._dropdownBooks.asReadonly();
    booksLoading = this._booksLoading.asReadonly();
    dropdownLoading = this._dropdownLoading.asReadonly();
    booksError = this._booksError.asReadonly();
    dropdownError = this._dropdownError.asReadonly();

    clearBooksError() { this._booksError.set(null); }
    clearDropdownError() { this._dropdownError.set(null); }

    extractErrorMessage(err: HttpErrorResponse): string {
        if (!err?.error) return 'Unknown error';

        if (err.status === 400) {
            // validation error
            const keys = Object.keys(err.error);
            if (keys.length) return err.error[keys[0]]?.[0] || 'Validation failed';
        }

        // fallback: detail key or generic
        return err.error.detail || 'Something went wrong';
    }

    // 🔹 Load full books list
    loadBooks(filters?: { catalogId?: number | null; search?: string }) {
        this._booksLoading.set(true);
        this._booksError.set(null);

        let params = new HttpParams();

        if (filters?.catalogId) {
            params = params.set('catalogs__id', filters.catalogId);
        }

        if (filters?.search) {
            params = params.set('search', filters.search);
        }

        this.http
            .get<Book[]>(`${this.api.BASE_URL}/books/`, { params })
            .pipe(finalize(() => this._booksLoading.set(false)))
            .subscribe({
                next: data => this._books.set(data),
                error: err => this._booksError.set(this.extractErrorMessage(err))
            });
    }


    // 🔹 Load dropdown books
    loadBookDropdown(search?: string) {
        this._dropdownLoading.set(true);
        this._dropdownError.set(null);

        let params = new HttpParams();
        if (search) {
            params = params.set('search', search);
        }

        this.http
            .get<BookDropdown[]>(`${this.api.BASE_URL}/books/dropdown/`, { params })
            .pipe(finalize(() => this._dropdownLoading.set(false)))
            .subscribe({
                next: data => this._dropdownBooks.set(data),
                error: err => this._dropdownError.set(this.extractErrorMessage(err))
            });
    }
}