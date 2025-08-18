import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductsPageData } from '../models/products-page.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsPageService {
  private readonly apiUrl = '/api/public/products';
  readonly data = signal<any | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  private readonly http = inject(HttpClient);

  async fetchData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      // MOCK ADAPTADO PARA PRODUCTS TECHNOLOGY
      const result = {
        categories: [
          {
            id: 'solar-protection',
            title: 'Láminas de Protección Solar',
            description: 'Las láminas solares para vidrios filtran la radiación solar, reducen el calor y mejoran la eficiencia energética.',
            icon: 'fas fa-sun',
            benefits: [
              'Reducción de hasta 85% del calor',
              'Control del deslumbramiento',
              'Mejora del confort térmico',
              'Reducción de costos de climatización'
            ],
            applications: ['Oficinas', 'Residencias', 'Centros comerciales', 'Vehículos']
          },
          {
            id: 'security',
            title: 'Láminas de Seguridad',
            description: 'Las láminas de seguridad para cristales mantienen los fragmentos de vidrio unidos en caso de rotura, evitando lesiones.',
            icon: 'fas fa-shield-alt',
            benefits: [
              'Protección en caso de rotura',
              'Ideal para lugares públicos',
              'Protección contra rayos UV'
            ],
            applications: ['Bancos', 'Joyerías', 'Escuelas', 'Edificios gubernamentales']
          },
          {
            id: 'decorative',
            title: 'Láminas Decorativas',
            description: 'Transforman el aspecto de los vidrios, añadiendo patrones, colores o texturas, y brindando privacidad sin sacrificar la entrada de luz natural.',
            icon: 'fas fa-palette',
            benefits: [
              'Privacidad sin pérdida de luz',
     
              'Diseño elegante y moderno',
              'Reducción del deslumbramiento',
              'Fácil mantenimiento y durabilidad',
              'Aplicación versátil'
            ],
            applications: ['Hoteles', 'Restaurantes', 'Showrooms', 'Oficinas corporativas']
          }
        ],
        featured: [
          {
            icon: 'fas fa-thermometer-half',
            title: 'Reducción de Calor',
            description: 'Nuestras láminas bloquean hasta el 97% de la radiación infrarroja, manteniendo espacios más frescos.',
            percentage: '97%'
          },
          {
            icon: 'fas fa-bolt',
            title: 'Eficiencia Energética',
            description: 'Reduce hasta un 30% el consumo de aire acondicionado y sistemas de climatización.',
            percentage: '30%'
          },
          {
            icon: 'fas fa-shield-virus',
            title: 'Protección UV',
            description: 'Bloquean hasta el 99% de los rayos UV, protegiendo interiores y personas.',
            percentage: '99%'
          },
          {
            icon: 'fas fa-clock',
            title: 'Durabilidad',
            description: 'Garantía de hasta 10 años, resistentes al desgaste, sol y paso del tiempo.',
            percentage: '10 años'
          }
        ]
      };
      this.data.set(result);
    } catch (err) {
      this.error.set('Error al cargar la página');
    } finally {
      this.loading.set(false);
    }
  }
}
