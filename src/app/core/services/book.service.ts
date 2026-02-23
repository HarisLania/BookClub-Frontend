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
    books = signal<Book[]>([]);
    dropdownBooks = signal<BookDropdown[]>([]);
    booksLoading = signal(false);
    dropdownLoading = signal(false);
    booksError = signal<string | null>(null);
    dropdownError = signal<string | null>(null);

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
        this.booksLoading.set(true);
        this.booksError.set(null);

        let params = new HttpParams();

        if (filters?.catalogId) {
            params = params.set('catalogs__id', filters.catalogId);
        }

        if (filters?.search) {
            params = params.set('search', filters.search);
        }

        this.http
            .get<Book[]>(`${this.api.BASE_URL}/books/`, { params })
            .pipe(finalize(() => this.booksLoading.set(false)))
            .subscribe({
                next: data => this.books.set(data),
                error: err => this.booksError.set(this.extractErrorMessage(err))
            });
    }


    // 🔹 Load dropdown books
    loadBookDropdown(search?: string) {
        this.dropdownLoading.set(true);
        this.dropdownError.set(null);

        let params = new HttpParams();
        if (search) {
            params = params.set('search', search);
        }

        this.http
            .get<BookDropdown[]>(`${this.api.BASE_URL}/books/dropdown/`, { params })
            .pipe(finalize(() => this.dropdownLoading.set(false)))
            .subscribe({
                next: data => this.dropdownBooks.set(data),
                error: err => this.dropdownError.set(this.extractErrorMessage(err))
            });
    }
}