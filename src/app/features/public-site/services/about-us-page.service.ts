import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AboutUsPageData } from '../models/about-us-page.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AboutUsPageService {
  private readonly apiUrl = '/api/public/about-us';
  readonly data = signal<AboutUsPageData | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  private readonly http = inject(HttpClient);
  constructor() {}

  async fetchData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const result: AboutUsPageData = {
        companyInfo: {
          name: 'Glazing',
          description: 'Transformamos tus espacios con vidrio de alta calidad',
          mission: 'Brindar soluciones innovadoras en vidrio para mejorar la calidad de vida de las personas.',
          vision: 'Ser líderes en el sector del vidrio, reconocidos por nuestra calidad e innovación.'
        },
        team: [
          {
            name: 'a',
            role: 'Developer',
            photo: '/assets/images/team/a.jpg',
            bio: 'Apasionado por la tecnología y el desarrollo web.'
          }
        ],
        stats: [
          { label: 'Proyectos Completados', value: '150+' },
          { label: 'Clientes Satisfechos', value: '120+' },
          { label: 'Años de Experiencia', value: '10' }
        ],
        experienceData: {
          stats: {
            works: '4.000+',
            years: '30+',
            coverage: 'Todo el país',
          },
          company: {
            title: 'Brindamos soluciones seguras, estéticas y duraderas',
            subtitle:
              'Con una larga trayectoria en el rubro y un profundo compromiso con la calidad y la satisfacción de cada cliente.',
            description:
              'Con más de 30 años de presencia en el mercado, en Glazing nos hemos consolidado como una empresa líder en el asesoramiento, venta e instalación de láminas de control solar para automóviles y arquitectura. Nuestro equipo está conformado por técnicos altamente capacitados, con una larga trayectoria en el rubro y un profundo compromiso con la calidad y la satisfacción de cada cliente.',
          },
          gallery: [
            {
              title: 'Equipo Glazing',
              image: './assets/images/backgrounds/image-2.jpg',
            }
          ],
          certification: {
            title: 'Glazing Certified™',
            subtitle:
              'En Glazing trabajamos exclusivamente con instaladores certificados bajo nuestro sello Glazing Certified™, lo que garantiza un servicio profesional, seguro y de alta calidad.',
            features: [
              {
                icon: 'fas fa-graduation-cap',
                title: 'Capacitaciones técnicas actualizadas',
                description: 'Formación continua en las últimas tecnologías',
              },
              {
                icon: 'fas fa-hard-hat',
                title: 'Certificación en trabajos en altura',
                description: 'Seguridad garantizada en instalaciones complejas',
              },
              {
                icon: 'fas fa-shield-alt',
                title: 'Cobertura de seguros correspondiente',
                description: 'Protección completa para instalador y cliente',
              },
              {
                icon: 'fas fa-file-contract',
                title: 'Documentación formal y habilitaciones laborales',
                description: 'Cumplimiento total de normativas legales',
              },
            ],
          }
        },
        technicalBenefits: [
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
        ],
        productTypes: [
          {
            id: 'solar-protection',
            title: 'Láminas de Protección Solar',
            description: 'Diseñadas para reducir el calor y el deslumbramiento, mejorando el confort interior y reduciendo la necesidad de aire acondicionado.',
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
            id: 'privacy',
            title: 'Láminas de Privacidad',
            description: 'Ofrecen diferentes niveles de opacidad y diseño para aumentar la privacidad sin comprometer la luz natural.',
            icon: 'fas fa-eye-slash',
            benefits: [
              'Privacidad durante el día',
              'Mantenimiento de luz natural',
              'Visibilidad desde el interior',
              'Diferentes niveles de opacidad'
            ],
            applications: ['Oficinas ejecutivas', 'Consultorios', 'Residencias', 'Salas de juntas']
          },
          {
            id: 'security',
            title: 'Láminas de Seguridad',
            description: 'Refuerzan el vidrio para aumentar su resistencia al impacto, ayudando a prevenir roturas y mejorar la seguridad.',
            icon: 'fas fa-shield-alt',
            benefits: [
              'Aumento de resistencia al impacto',
              'Prevención de roturas peligrosas',
              'Protección contra intrusiones',
              'Retención de fragmentos'
            ],
            applications: ['Bancos', 'Joyerías', 'Escuelas', 'Edificios gubernamentales']
          },
          {
            id: 'decorative',
            title: 'Láminas Decorativas',
            description: 'Disponibles en una variedad de colores y patrones, estas láminas permiten personalizar la apariencia de los vidrios.',
            icon: 'fas fa-palette',
            benefits: [
              'Personalización estética',
              'Variedad de diseños',
              'Mejora del ambiente',
              'Adaptación arquitectónica'
            ],
            applications: ['Hoteles', 'Restaurantes', 'Showrooms', 'Oficinas corporativas']
          }
        ],
        testimonials: [
          {
            id: 1,
            name: 'María González',
            position: 'Gerente de Operaciones',
            company: 'Construcciones del Valle',
            content: 'Glazing superó nuestras expectativas con su servicio profesional y productos de alta calidad. Su equipo demostró un compromiso excepcional en cada fase del proyecto.',
            initials: 'MG'
          },
          {
            id: 2,
            name: 'Carlos Rodríguez',
            position: 'Arquitecto Principal',
            company: 'Diseños Modernos SA',
            content: 'La calidad de los vidrios y la atención al detalle de Glazing es incomparable. Han sido nuestro socio estratégico en múltiples proyectos exitosos.',
            initials: 'CR'
          },
          {
            id: 3,
            name: 'Ana Patricia López',
            position: 'Directora de Proyectos',
            company: 'Inmobiliaria Premier',
            content: 'Trabajar con Glazing ha sido una experiencia excepcional. Su profesionalismo y innovación en soluciones de vidrio han transformado nuestros espacios.',
            initials: 'AL'
          }
        ]
      }

      this.data.set(result);
    } catch (err) {
      this.error.set('Error al cargar la página');
    } finally {
      this.loading.set(false);
    }
  }

  // async fetchData(): Promise<void> {
  //   this.loading.set(true);
  //   this.error.set(null);
  //   try {
  //     const result = await firstValueFrom(this.http.get<AboutUsPageData>(this.apiUrl));
  //     this.data.set(result);
  //   } catch (err) {
  //     this.error.set('Error al cargar la página');
  //   } finally {
  //     this.loading.set(false);
  //   }
  // }
}
