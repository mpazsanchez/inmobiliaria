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
      // MOCK LOCAL PARA DESARROLLO
      const mockDetails: any = {
        'solar-plata': {
          product: {
            id: 'solar-plata',
            name: 'Solar Espejada Plata',
            description: 'Lámina reflectante que reduce el calor, protege contra rayos UV e IR, y brinda privacidad.',
            images: ['/assets/images/products/solar-plata.jpg'],
            features: [
              'Bloquea hasta 74% de energía solar',
              'Protección UV 99%',
              'Protección IR 82%',
              'Privacidad con visión hacia el exterior'
            ],
            specs: [
              { label: 'Protección UV', value: '99%' },
              { label: 'Protección IR', value: '82%' },
              { label: 'Rechazo energía solar', value: '74%' },
              { label: 'Acabado', value: 'Espejado plata' }
            ]
          },
          related: [
            { id: 'solar-bronce', name: 'Solar Espejada Bronce', image: '/assets/images/products/solar-bronce.jpg', shortDescription: 'Bloquea energía solar y rayos UV, acabado bronce para mayor confort.' },
            { id: 'seguridad-100', name: 'Seguridad 100 micrones', image: '/assets/images/products/seguridad-100.jpg', shortDescription: 'Refuerza cristales, mantiene unidos los fragmentos y protege contra UV.' }
          ]
        },
        'seguridad-100': {
          product: {
            id: 'seguridad-100',
            name: 'Seguridad 100 micrones',
            description: 'Lámina transparente que refuerza cristales, mantiene unidos los fragmentos y protege contra rayos UV.',
            images: ['/assets/images/products/seguridad-100.jpg'],
            features: [
              'Protección en caso de rotura',
              'Ideal para lugares públicos',
              'Protección UV 99%'
            ],
            specs: [
              { label: 'Espesor', value: '100 micrones' },
              { label: 'Protección UV', value: '99%' }
            ]
          },
          related: [
            { id: 'solar-plata', name: 'Solar Espejada Plata', image: '/assets/images/products/solar-plata.jpg', shortDescription: 'Reduce el calor, protege UV y brinda privacidad con acabado reflectante.' }
          ]
        },
        'decorativa-esmerilada': {
          product: {
            id: 'decorativa-esmerilada',
            name: 'Decorativa Esmerilada',
            description: 'Lámina mate que brinda privacidad sin perder luz, disponible en varios colores.',
            images: ['/assets/images/products/decorativa-esmerilada.jpg'],
            features: [
              'Privacidad sin pérdida de luz',
              'Variedad de colores',
              'Diseño elegante y moderno',
              'Reducción del deslumbramiento',
              'Fácil mantenimiento y durabilidad',
              'Aplicación versátil'
            ],
            specs: [
              { label: 'Colores disponibles', value: 'Blanco, gris' },
              { label: 'Acabado', value: 'Mate esmerilado' }
            ]
          },
          related: [
            { id: 'solar-plata', name: 'Solar Espejada Plata', image: '/assets/images/products/solar-plata.jpg', shortDescription: 'Reduce el calor, protege UV y brinda privacidad con acabado reflectante.' }
          ]
        }
      };
      const result = mockDetails[productId] || null;
      this.data.set(result);
    } catch (err) {
      this.error.set('Error al cargar el producto');
    } finally {
      this.loading.set(false);
    }
  }
}
