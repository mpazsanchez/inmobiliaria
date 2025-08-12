import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HomeTwoPageData } from '../models/home-two-page.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeTwoPageService {
  private readonly apiUrl = '/api/public/home-two';
  readonly data = signal<HomeTwoPageData | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  async fetchData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      // MOCK: datos locales hasta tener backend
      const result: HomeTwoPageData = {
        heroSliders: [
          {
            id: 'slide-1',
            imageUrl: './assets/images/backgrounds/solarcheck/slide-1.jpg',
            altText: 'Ahorra energía con láminas solares',
            title: 'AHORRA ENERGÍA',
            subtitle: 'CON LÁMINAS SOLARES',
            description: 'Reduce hasta un 80% del calor solar y mejora el confort',
            primaryButton: { text: 'SOLICITAR PRESUPUESTO', action: 'discover' },
            secondaryButton: { text: 'Ver Instalaciones', action: 'video' }
          }
        ],
        aboutCompany: {
          bannerImage: './assets/images/backgrounds/solarcheck/slide-2.jpg'
        },
        services: [],
        experience: {},
        faqs: []
      };
      await new Promise(res => setTimeout(res, 300)); // simula delay
      this.data.set(result);
    } catch (err) {
      this.error.set('Error al cargar la página HomeTwo');
    } finally {
      this.loading.set(false);
    }
  }
}
