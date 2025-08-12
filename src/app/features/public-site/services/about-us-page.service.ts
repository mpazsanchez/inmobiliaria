import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AboutUsPageData } from '../models/about-us-page.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AboutUsPageService {
  private readonly apiUrl = '/api/public/about-us';
  readonly data = signal<AboutUsPageData | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  async fetchData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const result = await firstValueFrom(this.http.get<AboutUsPageData>(this.apiUrl));
      this.data.set(result);
    } catch (err) {
      this.error.set('Error al cargar la página');
    } finally {
      this.loading.set(false);
    }
  }
}
