import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { finalize } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Catalog, CatalogDropdown, CatalogDetails } from '../models/catalog.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
    private api = API_CONFIG();
    private http = inject(HttpClient);

    // 🔹 Signals for main catalog list
    catalogsLoading = signal(false);
    catalogsError = signal<string | null>(null);
    catalogs = signal<Catalog[]>([]);

    // 🔹 Signals for dropdown catalogs
    dropdownLoading = signal(false);
    dropdownError = signal<string | null>(null);
    dropdownCatalogs = signal<CatalogDropdown[]>([]);

    private extractErrorMessage(err: HttpErrorResponse): string {
        if (!err?.error) return 'Unknown error';
        if (err.status === 400) {
            const keys = Object.keys(err.error);
            if (keys.length) return err.error[keys[0]]?.[0] || 'Validation failed';
        }
        return err.error.detail || 'Something went wrong';
    }

    // 🔹 Load main catalog list
    loadCatalogs(search?: string) {
        this.catalogsLoading.set(true);
        this.catalogsError.set(null);

        let params = new HttpParams();
        if (search) params = params.set('search', search);

        this.http
            .get<Catalog[]>(`${this.api.BASE_URL}/catalogs/`, { params })
            .pipe(finalize(() => this.catalogsLoading.set(false)))
            .subscribe({
                next: data => this.catalogs.set(data),
                error: err => this.catalogsError.set(this.extractErrorMessage(err)),
            });
    }

    // 🔹 Load dropdown catalogs into signal
    loadCatalogDropdown(search?: string) {
        this.dropdownLoading.set(true);
        this.dropdownError.set(null);

        let params = new HttpParams();
        if (search) params = params.set('search', search);

        this.http
            .get<CatalogDropdown[]>(`${this.api.BASE_URL}/catalogs/dropdown/`, { params })
            .pipe(finalize(() => this.dropdownLoading.set(false)))
            .subscribe({
                next: data => this.dropdownCatalogs.set(data),
                error: err => this.dropdownError.set(this.extractErrorMessage(err)),
            });
    }

    // 🔹 Get catalog details
    getCatalog(id: number) {
        return this.http.get<CatalogDetails>(`${this.api.BASE_URL}/catalogs/${id}/`);
    }

    // 🔹 Create catalog
    createCatalog(payload: { name: string; books: number[] }) {
        return this.http.post<Catalog>(`${this.api.BASE_URL}/catalogs/`, payload);
    }

    // 🔹 Update catalog
    updateCatalog(id: number, payload: { name: string; books: number[] }) {
        return this.http.put<Catalog>(`${this.api.BASE_URL}/catalogs/${id}/`, payload);
    }

    // 🔹 Delete catalog
    deleteCatalog(id: number) {
        return this.http.delete(`${this.api.BASE_URL}/catalogs/${id}/`);
    }

}