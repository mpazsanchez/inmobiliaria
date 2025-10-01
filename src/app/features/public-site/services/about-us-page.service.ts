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
              name: 'Fairway Servicios Integrales',
              description: 'Fairway es una empresa de servicios integrales con más de 12 años de trayectoria en el mercado. Nos especializamos en cinco áreas claves: Seguridad, Paisajismo, Urbanismo, Industria y Agro. Nos hemos consolidado como un referente a nivel nacional, destacándonos por nuestro compromiso con la excelencia y la satisfacción de nuestros clientes.',
              mission: 'Apostamos por la ética, la responsabilidad y la excelencia en cada uno de los servicios que ofrecemos, porque creemos que el éxito de nuestros clientes es también nuestro éxito.',
              vision: 'Ser líderes nacionales en soluciones integrales, adaptándonos a los cambios del mercado y superando las expectativas de nuestros clientes.'
            },
            team: [],
            stats: [
              { label: 'Divisiones Especializadas', value: '5' },
              { label: 'Años de Experiencia', value: '12+' },
              { label: 'Cobertura', value: 'Nacional' }
            ],
            experienceData: {
              stats: {
                works: '5 divisiones',
                years: '12+',
                coverage: 'Todo el país',
              },
              company: {
                title: 'Fairway Servicios Integrales es mucho más que una empresa de servicios',
                subtitle: 'Más de una década de experiencia y reputación como referentes nacionales en soluciones integrales.',
                description: 'En Fairway, apostamos por la ética, la responsabilidad y la excelencia en cada uno de los servicios que ofrecemos, porque creemos que el éxito de nuestros clientes es también nuestro éxito. Contamos con cinco divisiones especializadas: Seguridad, Agro, Industria, Paisajismo y Urbanismo, lo que nos permite cubrir de manera eficaz y profesional una amplia variedad de necesidades. Desde la protección de instalaciones y entornos, hasta el cuidado y embellecimiento de espacios verdes, y la optimización de procesos industriales y agrícolas, Fairway garantiza la máxima calidad en el desempeño de cada tarea. Nuestro equipo de expertos altamente capacitados se compromete a superar expectativas, brindando soluciones innovadoras y personalizadas en cada uno de los sectores que atendemos.'
              },
              gallery: [
                {
                  title: 'Equipo Fairway',
                  image: './assets/images/backgrounds/fairway/team.jpg',
                }
              ],
              certification: {
                title: 'Fairway Certified™',
                subtitle: 'En Fairway trabajamos con equipos certificados y procesos auditados para garantizar la máxima calidad y seguridad en cada servicio.',
                features: [
                  {
                    icon: 'fas fa-user-shield',
                    title: 'Compromiso ético y profesional',
                    description: 'Responsabilidad y excelencia en cada división.'
                  },
                  {
                    icon: 'fas fa-users',
                    title: 'Equipo altamente capacitado',
                    description: 'Expertos en cada área de servicio.'
                  },
                  {
                    icon: 'fas fa-award',
                    title: 'Certificaciones y auditorías',
                    description: 'Procesos auditados y certificados para máxima calidad.'
                  },
                  {
                    icon: 'fas fa-handshake',
                    title: 'Garantía de satisfacción',
                    description: 'Compromiso con el cliente en cada proyecto.'
                  }
                ]
              }
            },
            divisions: [
              {
                name: 'Seguridad',
                description: 'Soluciones personalizadas para hogares, empresas y organizaciones, de la mano de los mejores fabricantes de la industria para garantizar que nuestros productos sean de la más alta calidad y tecnología avanzada. Instalación de sistemas de alarmas, cámaras de seguridad, control de acceso, automatización del hogar, comercios e industrias y muchas soluciones más, tomando la protección y la tranquilidad del cliente como máxima prioridad.'
              },
              {
                name: 'Paisajismo',
                description: 'Diseño, creación y mantenimiento de espacios exteriores, combinando elementos naturales y decorativos para mejorar la estética y funcionalidad de jardines, parques y áreas exteriores. Servicios: Arquitectura Paisajística y Planeamiento, Ingeniería paisajística, Servicios de Mantenimiento, Ventas de Plantas y diseño de Macetas a medida, Movimiento de Suelo, entre otros.'
              },
              {
                name: 'Industria',
                description: 'Soluciones y servicios para el sector industrial: optimización de procesos, automatización, mantenimiento de maquinaria, estandarización de normativas, regularización de la seguridad en el ambiente laboral y gestión eficiente de recursos. Servicios: Ingeniería Hidráulica, Industrial, Civil, Química, en Sistemas, Vial, Ambiental, Agrimensura y Topografía, Cálculos Estructurales, Trámites ADA, Servicios de Higiene y Seguridad, entre otros.'
              },
              {
                name: 'Urbanismo',
                description: 'Diseño, planificación y desarrollo de espacios urbanos, infraestructura, ordenación del territorio y proyectos que favorecen el bienestar social y ambiental. Servicios: Arquitectura, Maestro Mayor de Obra, Diseño de Planos, Agrimensura, Higiene y Seguridad, Diseño de Interiores, Demolición, Movimiento de Suelo, Herrería, Durlock, Carpintería, Servicios esenciales, Construcción sostenible, Construcción y/o Remodelaciones de Casas, Edificios, Estructuras, Caminos, Canales, Desagües, Alcantarillados, entre otros.'
              },
              {
                name: 'Agro',
                description: 'Soluciones para el sector agrícola: tecnología, productos y servicios para mejorar la producción, gestión y sostenibilidad. Servicios: Siembra, Picado y Cosecha, Administración, Logística, Venta de Semillas, Venta de Fertilizantes, Asesoramiento agronómico y comercial especializado, Higiene y Seguridad, Gestión Ambiental, Veterinarios, Agronomía, entre otros.'
              }
            ],
            technicalBenefits: [],
        productTypes: [],
        testimonials: []
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
