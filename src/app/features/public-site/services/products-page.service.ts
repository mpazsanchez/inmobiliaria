import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductsPageData } from '../models/products-page.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsPageService {
  private readonly apiUrl = '/api/public/products';
  readonly data = signal<ProductsPageData | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  async fetchData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const result = await firstValueFrom(this.http.get<ProductsPageData>(this.apiUrl));
      this.data.set(result);
    } catch (err) {
      this.error.set('Error al cargar la página');
    } finally {
      this.loading.set(false);
    }
  }
}
