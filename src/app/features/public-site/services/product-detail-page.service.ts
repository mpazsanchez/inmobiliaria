import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductDetailPageData } from '../models/product-detail-page.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductDetailPageService {
  private readonly apiUrl = '/api/public/product-detail';
  readonly data = signal<ProductDetailPageData | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  async fetchData(productId: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const result = await firstValueFrom(this.http.get<ProductDetailPageData>(`${this.apiUrl}/${productId}`));
      this.data.set(result);
    } catch (err) {
      this.error.set('Error al cargar el producto');
    } finally {
      this.loading.set(false);
    }
  }
}
