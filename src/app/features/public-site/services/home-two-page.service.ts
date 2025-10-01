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
            imageUrl: './assets/images/backgrounds/fairway/slide-1.webp',
            altText: 'Instalación profesional de láminas solares Glazing',
            title: 'SOLUCIONES INTEGRALES',
            subtitle: 'PARA EL AGRO',
            description:
              'Ofrecemos soluciones destinadas a mejorar la producción, gestión y sostenibilidad de las actividades agrícolas',
            primaryButton: {
              text: 'CONOCÉ NUESTRAS SOLUCIONES',
              action: 'discover',
            },
            secondaryButton: { text: 'Contactanos', action: 'video' },
          },
          {
            id: 'slide-2',
            imageUrl: './assets/images/backgrounds/fairway/slide-2.webp',
            altText: 'Red de instaladores certificados Glazing',
            title: 'DISEÑO Y DESARROLLO',
            subtitle: 'DE ESPACIOS URBANOS',
            description:
              'Buscamos crear entornos funcionales, sostenibles y de calidad, que favorezcan el bienestar social y ambiental',
            primaryButton: {
              text: 'DESCUBRÍ NUESTROS PROYECTOS',
              action: 'training',
            },
            secondaryButton: { text: 'Ver Más', action: 'gallery' },
          },
          {
            id: 'slide-3',
            imageUrl: './assets/images/backgrounds/fairway/slide-3.webp',
            altText: 'Alarma y seguridad',
            title: 'SEGURIDAD',
            subtitle: 'Y PROTECCIÓN',
            description:
              'Nos enfocamos en generar soluciones personalizadas para hogares, empresas y organizaciones. Contamos con un equipo de expertos altamente capacitados',
            primaryButton: { text: 'CONOCÉ NUESTROS PLANES', action: 'shop' },
            secondaryButton: { text: 'Casos de Éxito', action: 'specs' },
          },
        ],
        aboutCompany: {
          bannerImage: './assets/images/backgrounds/solarcheck/slide-8.jpg',
          companyStats: [
            { value: 12, label: 'AÑOS DE\nTRAYECTORIA', unit: '' },
          ],
          companyInfo: {
            title: 'Mucho más que una empresa de servicios',
            subtitle: 'ACERCA DE FAIRWAY SERVICIOS INTEGRALES',
            description:
              'Con más de una década de experiencia, hemos construido una sólida reputación como referentes nacionales en la prestación de soluciones integrales en diversos sectores. Contamos con cinco divisiones especializadas: Seguridad, Agro, Industria, Paisajismo y Urbanismo, lo que nos permite cubrir de manera eficaz y profesional una amplia variedad de necesidades.',
            ctaText: 'SOLICITAR PRESUPUESTO',
          },
          showProgressBars: false,
          skills: [
            { name: 'Instalación de Láminas Solares', percentage: 95 },
            { name: 'Formación Profesional', percentage: 90 },
            { name: 'Materiales de Calidad', percentage: 98 },
          ],
          contactInfo: {
            phone: '+54 249 424-4568',
            description: '¿Tenés algún proyecto en mente? Llámanos:',
          },
          founderInfo: {
            name: 'Glazing Team',
            signature: 'Glazing™',
            photo: './assets/images/team/founder.jpg',
          },
        },
        services: {
          sectionInfo: {
            subtitle: 'NUESTROS SERVICIOS',
            title: 'Contamos con cinco divisiones especializadas',
          },
          services: [
            {
              icon: 'fas fa-seedling',
              title: 'Agro',
              description:
                'Servicios de Siembra, Picado y Cosecha, Administración, Logística, Venta de Semillas, Venta de Fertilizantes, Asesoramiento agronómico y comercial especializado, Servicios de Higiene y Seguridad, Servicios de Gestión Ambiental, Servicios Veterinarios, Servicios de Agronomía.',
              link: '/services/agro',
            },
            {
              icon: 'fas fa-city',
              title: 'Urbanismo',
              description:
                'Servicios de Arquitectura, Maestro Mayor de Obra, Diseño de Planos, Agrimensura, Higiene y Seguridad, Diseño de Interiores, Demolición, Movimiento de Suelo, Servicios de Herrería, Durlock, Carpintería, Servicios esenciales, Construcción sostenible, Construcción y Remodelaciones de Casas, Edificios, Estructuras, Caminos, Canales, Desagües, Alcantarillados.',
              link: 'services/urbanismo',
            },
            {
              icon: 'fas fa-home',
              title: 'Seguridad',
              description:
                'Instalación de sistemas de alarmas, cámaras de seguridad, control de acceso, automatización del hogar, comercios e industrias y muchas soluciones más, tomando la protección y la tranquilidad del cliente como máxima prioridad',
              link: 'services/seguridad',
            },
            {
              icon: 'fas fa-tree',
              title: 'Paisajismo',
              description:
                'Arquitectura Paisajística y Planeamiento, Ingeniería paisajística, Servicios de Mantenimiento, Ventas de Plantas y diseño de Macetas a medida, Movimiento de Suelo, entre otros',
              link: 'services/paisajismo',
            },
            {
              icon: 'fas fa-cogs',
              title: 'Industria',
              description:
                'Servicios de  Ingeniería Hidráulica, Ingeniería Industrial, Ingeniería Civil, Ingeniería Química, Ingeniería en Sistemas, Ingeniería Vial, Ingeniería Ambiental, Agrimensura y Topografía, Cálculos Estructurales, Trámites ADA, Servicios de Higiene y Seguridad, entre otros',
              link: 'services/industria',
            },
          ],
        },
        experience: {
          showCertification: true,
          showCta: true,
          isAboutComponent: false,
          experienceData: {
            stats: {
              works: '4.000+',
              years: '30+',
              coverage: 'Todo el país',
            },
            company: {
              title: 'Con más de 12 años en el mercado, nos hemos consolidado como un referente a nivel nacional',
              subtitle:
                'Nuestro equipo de expertos altamente capacitados se compromete a superar expectativas, brindando soluciones innovadoras y personalizadas en cada uno de los sectores que atendemos.',
              description:
                '',
            },
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
                  title: 'Profesionales certificados',
                  description: 'Personal con experiencia y aval oficial',
                },
                {
                  icon: 'fas fa-check-circle',
                  title: 'Documentación formal y habilitaciones laborales',
                  description:
                    'Cumplimiento de todos los requisitos legales y de seguridad',
                },
                {
                  icon: 'fas fa-shield-alt',
                  title: 'Cobertura de seguros correspondientes',
                  description:
                    'Todos los trabajos cuentan con la cobertura de seguros exigida por ley',
                },
              ],
            },
            gallery: [
              {
                image: './assets/images/backgrounds/fairway/slide-8.jpg',
                title: 'Industria',
              },
              {
                image: './assets/images/backgrounds/fairway/slide-10.jpg',
                title: 'Agro',
              },
              {
                image: './assets/images/backgrounds/fairway/slide-11.jpg',
                title: 'Desarrollo Urbanístico',
              },
            ],
            cta: {
              text: '¿Querés saber solicitar una cotización para tu proyecto?',
              button: 'Contactanos',
            },
            clients: [
              { name: 'Cannon', logo: './assets/images/clients/cannon.jpg' },
              { name: 'Carrefour', logo: './assets/images/clients/carrefour.png' },
              { name: 'Constructora Vasquez', logo: './assets/images/clients/constructora vasquez.png' },
              { name: 'DIA', logo: './assets/images/clients/dia.png' },
              { name: 'Faro Verde', logo: './assets/images/clients/faro verde - black.png' },
              { name: 'Felfort', logo: './assets/images/clients/felfort.png' },
              { name: 'Globant', logo: './assets/images/clients/globant.png' },
              { name: 'Shell', logo: './assets/images/clients/shell.png' },
              { name: 'YPF', logo: './assets/images/clients/ypf.png' }
            ],
          },
        },
        faqs: {
          faqItems: [
            {
              id: 'faq1',
              question: '¿Se pueden instalar en vidrios ya colocados?',
              answer:
                'Sí, totalmente. Las láminas solares Glazing están diseñadas para aplicarse directamente sobre cristales existentes, sin necesidad de obras ni reemplazo de ventanas.',
              isOpen: true,
            },
            {
              id: 'faq2',
              question: '¿Qué tan efectivas son contra el calor?',
              answer:
                'Nuestras láminas de tecnología nano cerámica y carbono avanzado bloquean hasta el 97% de la radiación infrarroja (IR), reduciendo significativamente la temperatura interior y mejorando el confort térmico.',
              isOpen: false,
            },
            {
              id: 'faq3',
              question: '¿Pierdo visibilidad desde adentro hacia afuera?',
              answer:
                'No. Las láminas están diseñadas para mantener la visibilidad desde el interior, incluso en modelos con alto nivel de privacidad. Usted ve hacia afuera, pero desde afuera no ven hacia adentro (en condiciones de luz natural).',
              isOpen: false,
            },
            {
              id: 'faq5',
              question: '¿Requieren mantenimiento?',
              answer:
                'No. Las láminas Glazing no requieren mantenimiento especial. Solo limpieza normal de vidrios, sin productos abrasivos. Son resistentes al desgaste, al sol y al paso del tiempo.',
              isOpen: false,
            },
            {
              id: 'faq6',
              question: '¿Tienen garantía?',
              answer:
                'Sí. Ofrecemos garantía escrita de hasta 10 años, dependiendo del modelo instalado. Nuestra garantía cubre decoloración, burbujas, despegue o pérdida de propiedades ópticas.',
              isOpen: false,
            },
            {
              id: 'faq7',
              question: '¿Cuánto demora la instalación?',
              answer:
                'Depende de la superficie y cantidad de ventanas. En la mayoría de los casos, se realiza en una sola jornada laboral, sin necesidad de vaciar completamente el ambiente ni realizar obras.',
              isOpen: false,
            },
            {
              id: 'faq8',
              question: '¿Quién realiza la instalación?',
              answer:
                'Solo personal certificado Glazing Certified™, con toda la documentación legal, seguros, formación técnica y protocolo de seguridad para ingresar a hogares y empresas con total profesionalismo.',
              isOpen: false,
            },
          ],
        },
      };
      await new Promise((res) => setTimeout(res, 300)); // simula delay
      this.data.set(result);
    } catch (err) {
      this.error.set('Error al cargar la página HomeTwo');
    } finally {
      this.loading.set(false);
    }
  }
}
