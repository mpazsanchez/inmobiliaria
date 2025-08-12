import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HomeTwoPageData } from '../models/home-two-page.interface';
@Injectable({ providedIn: 'root' })

export class HomeTwoPageService {
  private readonly apiUrl = '/api/public/home-two';
  readonly data = signal<HomeTwoPageData | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  private readonly http = inject(HttpClient);

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
          bannerImage: './assets/images/backgrounds/solarcheck/slide-1.jpg',
          companyStats: [
            { value: 15, label: 'Años de experiencia', unit: 'años' },
            // { value: 1200, label: 'Clientes felices', unit: '' },
            // { value: 50, label: 'Instaladores certificados', unit: '' }
          ],
          companyInfo: {
            title: 'Sobre Glazing',
            subtitle: 'Líderes en láminas solares',
            description: 'Somos una empresa con más de 15 años de experiencia en el sector de láminas solares, brindando soluciones innovadoras y eficientes para hogares y empresas.'
          },
          showProgressBars: true,
          skills: [
            { name: 'Instalación', percentage: 95 },
            { name: 'Atención al cliente', percentage: 90 },
            { name: 'Innovación', percentage: 85 }
          ],
          contactInfo: {
            description: '¿Querés ser parte de nuestra red de instaladores?',
            phone: '+54 11 1234-5678'
          }
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
