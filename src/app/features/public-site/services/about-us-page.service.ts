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
              title: 'Laminas selectivo Las Delicias',
              image: './assets/images/backgrounds/solarcheck/slide-1.jpg',
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
        productTypes: [
          {
            id: 'solar',
            title: 'Láminas de control solar',
            description: 'Reducen el calor y el deslumbramiento, mejorando la eficiencia energética.',
            icon: 'fas fa-sun',
            benefits: ['Ahorro energético', 'Protección UV', 'Mayor confort térmico'],
            applications: ['Edificios', 'Automóviles', 'Industria']
          },
          {
            id: 'seguridad',
            title: 'Láminas de seguridad',
            description: 'Aumentan la resistencia del vidrio y protegen contra impactos.',
            icon: 'fas fa-shield-alt',
            benefits: ['Protección contra robos', 'Reducción de accidentes', 'Mayor privacidad'],
            applications: ['Comercios', 'Viviendas', 'Instituciones']
          },
          {
            id: 'decorativas',
            title: 'Láminas decorativas',
            description: 'Ofrecen variedad de diseños y colores para personalizar ambientes.',
            icon: 'fas fa-palette',
            benefits: ['Estética', 'Privacidad', 'Personalización'],
            applications: ['Oficinas', 'Hogares', 'Locales comerciales']
          },
          {
            id: 'antivandalicas',
            title: 'Láminas antivandálicas',
            description: 'Protegen el vidrio contra actos vandálicos y accidentes.',
            icon: 'fas fa-user-shield',
            benefits: ['Resistencia', 'Seguridad', 'Durabilidad'],
            applications: ['Transporte público', 'Escuelas', 'Instituciones']
          },
          // {
          //   id: 'espejadas',
          //   title: 'Láminas espejadas',
          //   description: 'Brindan efecto espejo y mayor privacidad.',
          //   icon: 'fas fa-mirror',
          //   benefits: ['Privacidad', 'Estética', 'Control solar'],
          //   applications: ['Edificios', 'Consultorios', 'Oficinas']
          // }
        ],
        technicalBenefits: [
          {
            icon: 'fas fa-thermometer-half',
            title: 'Ahorro energético',
            description: 'Reduce el consumo de aire acondicionado y calefacción.',
            percentage: 'Hasta 30%'
          },
          {
            icon: 'fas fa-sun',
            title: 'Protección UV',
            description: 'Bloquea más del 99% de los rayos UV.',
            percentage: '99%'
          },
          {
            icon: 'fas fa-eye-slash',
            title: 'Privacidad',
            description: 'Permite ver sin ser visto desde el exterior.'
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
