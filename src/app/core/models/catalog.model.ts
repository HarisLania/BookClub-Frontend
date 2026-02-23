import { Book } from './book.model';

export interface Catalog {
    id: number;
    name: string;
    books: number[];
}

export interface CatalogDropdown {
    id: number;
    name: string;
}

export interface CatalogDetails {
    id: number;
    name: string;
    books: Book[];
}