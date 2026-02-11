import { Injectable, signal, inject, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HomePageData } from '../models/home-page.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomePageService {
  private readonly apiUrl = '/api/public/home';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly transferState = inject(TransferState);
  readonly data = signal<HomePageData | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  async fetchData(): Promise<void> {
    const stateKey = makeStateKey<HomePageData>('home-page-data');
    
    // Intentar obtener de TransferState
    const cached = this.transferState.get(stateKey, null);
    if (cached) {
      this.data.set(cached);
      this.transferState.remove(stateKey);
      return;
    }
    
    // No hacer llamadas API durante SSR/prerender (no hay backend)
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    try {
      const result = await firstValueFrom(this.http.get<HomePageData>(this.apiUrl));
      this.data.set(result);
      this.transferState.set(stateKey, result);
    } catch (err) {
      this.error.set('Error al cargar la página');
    } finally {
      this.loading.set(false);
    }
  }
}
