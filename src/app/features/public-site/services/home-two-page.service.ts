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
            altText: 'Instalación profesional de láminas solares Glazing',
            title: 'AHORRA ENERGÍA',
            subtitle: 'CON LÁMINAS SOLARES',
            description: 'Reduce hasta un 80% del calor solar y mejora el confort de tu hogar o negocio con instalación profesional garantizada',
            primaryButton: { text: 'SOLICITAR PRESUPUESTO', action: 'discover' },
            secondaryButton: { text: 'Ver Instalaciones', action: 'video' }
          },
          {
            id: 'slide-2',
            imageUrl: './assets/images/backgrounds/solarcheck/slide-2.jpg',
            altText: 'Red de instaladores certificados Glazing',
            title: 'INSTALADORES',
            subtitle: 'CERTIFICADOS',
            description: 'Conectamos con el profesional más cercano a tu ubicación. Calidad garantizada y respaldo técnico oficial',
            primaryButton: { text: 'ENCONTRAR INSTALADOR', action: 'training' },
            secondaryButton: { text: 'Ver Garantías', action: 'gallery' }
          },
          {
            id: 'slide-3',
            imageUrl: './assets/images/backgrounds/solarcheck/slide-3.png',
            altText: 'Beneficios de las láminas solares residenciales y comerciales',
            title: 'PROTECCIÓN',
            subtitle: 'Y CONFORT',
            description: 'Mejora la estética, seguridad y eficiencia energética de tus espacios con la mejor tecnología del mercado',
            primaryButton: { text: 'VER BENEFICIOS', action: 'shop' },
            secondaryButton: { text: 'Casos de Éxito', action: 'specs' }
          }
        ],
        aboutCompany: {
          bannerImage: './assets/images/backgrounds/solarcheck/slide-1.jpg',
          companyStats: [
            { value: 8, label: 'AÑOS DE\nTRAYECTORIA', unit: '' }
          ],
          companyInfo: {
            title: 'Conectamos Tu Proyecto con Instaladores Certificados',
            subtitle: 'ACERCA DE GLAZING',
            description: 'Glazing es la plataforma líder que conecta clientes con instaladores certificados de láminas solares. Garantizamos calidad, respaldo técnico y los mejores materiales para transformar tus espacios con máximo ahorro energético.',
            ctaText: 'SOLICITAR PRESUPUESTO'
          },
          showProgressBars: true,
          skills: [
            { name: 'Instalación de Láminas Solares', percentage: 95 },
            { name: 'Formación Profesional', percentage: 90 },
            { name: 'Materiales de Calidad', percentage: 98 }
          ],
          contactInfo: {
            phone: '+34 123 456 789',
            description: '¿Tienes algún proyecto en mente? Llámanos:'
          },
          founderInfo: {
            name: 'Glazing Team',
            signature: 'Glazing™',
            photo: './assets/images/team/founder.jpg'
          }
        },
        services: {
          sectionInfo: {
            subtitle: 'NUESTROS SERVICIOS',
            title: 'Soluciones de Láminas Solares para Tu Hogar y Negocio'
          },
          services: [
            {
              icon: 'fas fa-home',
              title: 'Láminas Residenciales',
              description: 'Reduce hasta un 80% del calor solar en tu hogar. Ahorra en climatización y mejora el confort de tu familia con instalación profesional garantizada.',
              link: 'residential'
            },
            {
              icon: 'fas fa-building',
              title: 'Soluciones Comerciales',
              description: 'Mejora la eficiencia energética de tu oficina o local comercial. Instaladores certificados en toda España para proyectos corporativos.',
              link: 'commercial'
            },
            {
              icon: 'fas fa-car',
              title: 'Polarizado Vehicular',
              description: 'Protege tu vehículo del calor y los rayos UV. Instalación rápida y materiales de alta calidad.',
              link: 'automotive'
            },
            {
              icon: 'fas fa-city',
              title: 'Láminas Arquitectónicas',
              description: 'Soluciones para edificios, oficinas y grandes superficies. Control solar, privacidad y diseño.',
              link: 'architectural'
            },
            // {
            //   icon: 'fas fa-sun',
            //   title: 'Láminas de Control Solar',
            //   description: 'Reduce el calor y el deslumbramiento en cualquier ambiente. Ahorro energético y confort.',
            //   link: 'solar-control'
            // }
          ]
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
              title: 'Brindamos soluciones seguras, estéticas y duraderas',
              subtitle: 'Con una larga trayectoria en el rubro y un profundo compromiso con la calidad y la satisfacción de cada cliente.',
              description: 'Con más de 30 años de presencia en el mercado, en Glazing nos hemos consolidado como una empresa líder en el asesoramiento, venta e instalación de láminas de control solar para automóviles y arquitectura. Nuestro equipo está conformado por técnicos altamente capacitados, con una larga trayectoria en el rubro y un profundo compromiso con la calidad y la satisfacción de cada cliente.',
            },
            certification: {
              title: 'Glazing Certified™',
              subtitle: 'En Glazing trabajamos exclusivamente con instaladores certificados bajo nuestro sello Glazing Certified™, lo que garantiza un servicio profesional, seguro y de alta calidad.',
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
                  description: 'Cumplimiento de todos los requisitos legales y de seguridad',
                },
                {
                  icon: 'fas fa-shield-alt',
                  title: 'Cobertura de seguros correspondientes',
                  description: 'Todos los trabajos cuentan con la cobertura de seguros exigida por ley',
                }
              ]
            },
            gallery: [
              {
                image: './assets/images/backgrounds/solarcheck/slide-1.jpg',
                title: 'Instalación Residencial'
              },
              {
                image: './assets/images/backgrounds/solarcheck/slide-2.jpg',
                title: 'Instalación Comercial'
              },
              {
                image: './assets/images/backgrounds/solarcheck/slide-3.png',
                title: 'Proceso Certificado'
              }
            ],
            cta: {
              text: '¿Querés una consulta técnica personalizada? Nuestro equipo te asesora sin cargo.',
              button: 'Solicitar Consulta'
            }
          }
        },
        faqs: {
          faqItems: [
            {
              id: 'faq1',
              question: '¿Se pueden instalar en vidrios ya colocados?',
              answer: 'Sí, totalmente. Las láminas solares Glazing están diseñadas para aplicarse directamente sobre cristales existentes, sin necesidad de obras ni reemplazo de ventanas.',
              isOpen: true
            },
            {
              id: 'faq2',
              question: '¿Qué tan efectivas son contra el calor?',
              answer: 'Nuestras láminas de tecnología nano cerámica y carbono avanzado bloquean hasta el 97% de la radiación infrarroja (IR), reduciendo significativamente la temperatura interior y mejorando el confort térmico.',
              isOpen: false
            },
            {
              id: 'faq3',
              question: '¿Pierdo visibilidad desde adentro hacia afuera?',
              answer: 'No. Las láminas están diseñadas para mantener la visibilidad desde el interior, incluso en modelos con alto nivel de privacidad. Usted ve hacia afuera, pero desde afuera no ven hacia adentro (en condiciones de luz natural).',
              isOpen: false
            },
            {
              id: 'faq5',
              question: '¿Requieren mantenimiento?',
              answer: 'No. Las láminas Glazing no requieren mantenimiento especial. Solo limpieza normal de vidrios, sin productos abrasivos. Son resistentes al desgaste, al sol y al paso del tiempo.',
              isOpen: false
            },
            {
              id: 'faq6',
              question: '¿Tienen garantía?',
              answer: 'Sí. Ofrecemos garantía escrita de hasta 10 años, dependiendo del modelo instalado. Nuestra garantía cubre decoloración, burbujas, despegue o pérdida de propiedades ópticas.',
              isOpen: false
            },
            {
              id: 'faq7',
              question: '¿Cuánto demora la instalación?',
              answer: 'Depende de la superficie y cantidad de ventanas. En la mayoría de los casos, se realiza en una sola jornada laboral, sin necesidad de vaciar completamente el ambiente ni realizar obras.',
              isOpen: false
            },
            {
              id: 'faq8',
              question: '¿Quién realiza la instalación?',
              answer: 'Solo personal certificado Glazing Certified™, con toda la documentación legal, seguros, formación técnica y protocolo de seguridad para ingresar a hogares y empresas con total profesionalismo.',
              isOpen: false
            }
          ]
        }
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
