import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CatalogService } from '../../../core/services/catalog.service';
import { CatalogDetails } from '../../../core/models/catalog.model';

@Component({
  selector: 'app-view-catalog',
  imports: [],
  templateUrl: './view-catalog.html',
  styleUrl: './view-catalog.scss',
})
export class ViewCatalog implements OnInit {
  // injecting services
  private bsModalRef = inject(BsModalRef);
  private catalogService = inject(CatalogService);

  @Input() catalogId!: number;
  catalog = signal<CatalogDetails | null>(null);

  ngOnInit() {
    // call API directly inside modal
    this.catalogService.getCatalog(this.catalogId).subscribe({
      next: (data) => this.catalog.set(data),
      error: (err) => console.error(err), // optionally show toast
    });
  }

  close() {
    this.bsModalRef.hide();
  }
}