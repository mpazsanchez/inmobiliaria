import { Injectable, signal } from '@angular/core';
import { SolarProtectionFilmPageData } from '../models/solar-protection-film-page.interface';
import { of, firstValueFrom } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SolarProtectionFilmPageService {
  readonly data = signal<SolarProtectionFilmPageData | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor() {}

  async fetchData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      // Simulación de API: aquí deberías hacer la llamada real
      const result = await firstValueFrom(of(this.getMockData()).pipe(delay(500)));
      this.data.set(result);
    } catch (err) {
      this.error.set('Error al cargar la página');
    } finally {
      this.loading.set(false);
    }
  }

  private getMockData(): SolarProtectionFilmPageData {
    return {
      heroData: {
        bannerImage: './assets/images/backgrounds/solarcheck/slide-1.jpg',
        title: 'Láminas de Protección Solar',
        subtitle: 'Tecnología avanzada para el control térmico y ahorro energético en tus espacios',
        breadcrumbTextOne: 'HOME',
        breadcrumbTextTwo: 'PRODUCTOS',
        breadcrumbTextThree: 'Láminas de Protección Solar'
      },
      content: {
        mainImage: '/assets/images/backgrounds/solarcheck/slide-1.jpg',
        mainImageAlt: 'Láminas de Protección Solar',
        title: 'Protección Solar Avanzada',
        description: [
          'Nuestras láminas de protección solar combinan tecnología avanzada con diferentes opciones estéticas para brindar soluciones eficaces contra el calor, los rayos UV y el deslumbramiento.',
          'Cada tipo de lámina está diseñado para necesidades específicas: las espejadas plata ofrecen máxima privacidad, las nano cerámicas negras complementan la arquitectura moderna, y las selectivas transparentes preservan la estética original manteniendo excelente protección.'
        ],
        highlightedFeatures: [
          '99% protección UV en todos los tipos',
          'Hasta 95% reducción de rayos infrarrojos',
          'Reducción significativa de costos energéticos'
        ]
      },
      features: [
        {
          icon: 'fas fa-thermometer-half',
          title: 'Control Térmico Superior',
          description: 'Reducción de hasta 82% del calor infrarrojo, manteniendo ambientes frescos y confortables durante el verano.'
        },
        {
          icon: 'fas fa-eye-slash',
          title: 'Privacidad y Estética',
          description: 'Opciones desde completamente transparentes hasta espejadas que brindan privacidad unidireccional.'
        },
        {
          icon: 'fas fa-bolt',
          title: 'Ahorro Energético',
          description: 'Reducción significativa en costos de refrigeración al disminuir la dependencia del aire acondicionado.'
        },
        {
          icon: 'fas fa-shield-virus',
          title: 'Protección UV 99%',
          description: 'Bloquea rayos ultravioleta dañinos en todos nuestros tipos de láminas, protegiendo personas y mobiliario.'
        }
      ],
      specifications: [
        { property: 'Protección UV', value: '99', unit: '%' },
        { property: 'Reducción rayos infrarrojos', value: '80-95', unit: '%' },
        { property: 'Energía solar rechazada', value: '45-79', unit: '%' },
        { property: 'Tipos disponibles', value: '3', unit: 'opciones' },
        { property: 'Garantía', value: '10', unit: 'años' },
        { property: 'Tiempo de instalación', value: '1', unit: 'día' }
      ],
      types: [
        {
          name: 'Láminas Espejadas Plata',
          description: 'Solución eficaz para reducir el calor con acabado reflectante que proporciona privacidad. Permiten visión clara hacia el exterior desde el interior, pero impiden que se vea desde afuera.',
          uvProtection: '99%',
          irReduction: '82%',
          solarEnergyRejection: '74%',
          finish: 'Espejo plata',
          keyBenefits: [
            'Privacidad unidireccional',
            'Reducción significativa del calor',
            'Protección contra desgaste de muebles',
            'Acabado reflectante elegante'
          ]
        },
        {
          name: 'Láminas Nano Cerámicas Negras',
          description: 'Solución avanzada y estética para espacios modernos con aberturas de aluminio y madera. Ofrecen un acabado elegante y sofisticado con alto nivel de protección.',
          uvProtection: '99%',
          irReduction: '80%',
          solarEnergyRejection: '79%',
          finish: 'Tonalidades claro/intermedio/oscuro',
          keyBenefits: [
            'Estética moderna que complementa aberturas',
            'Reducción significativa del deslumbramiento',
            'Filtrado avanzado de rayos infrarrojos',
            'Mejora el diseño arquitectónico'
          ]
        },
        {
          name: 'Láminas Selectivas Transparentes',
          description: 'Completamente transparentes, ideales para mantener la estética original de los cristales sin alterar la apariencia natural de las ventanas.',
          uvProtection: '99%',
          irReduction: '95%',
          solarEnergyRejection: '45%',
          finish: 'Transparente',
          keyBenefits: [
            'Preserva la estética original',
            'No altera la apariencia de los cristales',
            'Máxima reducción de rayos infrarrojos',
            'Ideal para diseños arquitectónicos específicos'
          ]
        }
      ],
      challenges: [
        {
          question: '¿Las láminas solares afectan la visibilidad?',
          answer: 'No, nuestras láminas están diseñadas para mantener una excelente visibilidad. Las transparentes no alteran la vista, mientras que las espejadas permiten ver claramente desde el interior.',
          isOpen: false
        },
        {
          question: '¿Cuánto duran las láminas de protección solar?',
          answer: 'Nuestras láminas tienen una garantía de 10 años y están diseñadas para durar entre 15-20 años con el mantenimiento adecuado.',
          isOpen: false
        },
        {
          question: '¿Se pueden instalar en cualquier tipo de ventana?',
          answer: 'Sí, nuestras láminas son compatibles con todo tipo de ventanas: aluminio, madera, PVC y marcos metálicos. Nuestro equipo evalúa cada caso para garantizar la mejor instalación.',
          isOpen: false
        }
      ],
      banner: {
        title: '¿Necesitas asesoramiento personalizado?',
        subtitle: 'Contacta con nuestros expertos',
        description: 'Te ayudamos a elegir la solución perfecta para tus necesidades específicas',
        buttonText: 'Consultar Ahora',
        buttonAction: '/contact',
        icon: 'fas fa-comments',
        backgroundColor: '#034EA2',
        textColor: '#ffffff'
      },
      relatedProducts: [
        { name: 'Láminas de Seguridad', link: '/products/security-films' },
        { name: 'Láminas Decorativas', link: '/products/decorative-films' },
        { name: 'Láminas Automotrices', link: '/products/automotive-films' },
        { name: 'Recubrimientos Cerámicos', link: '/products/ceramic-coatings' }
      ]
    };
  }
}
