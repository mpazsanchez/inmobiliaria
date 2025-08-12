import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContactPageData } from '../models/contact-page.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContactPageService {
  private readonly apiUrl = '/api/public/contact';
  readonly data = signal<ContactPageData | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  async fetchData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const result = await firstValueFrom(this.http.get<ContactPageData>(this.apiUrl));
      this.data.set(result);
    } catch (err) {
      this.error.set('Error al cargar la página');
    } finally {
      this.loading.set(false);
    }
  }
}
