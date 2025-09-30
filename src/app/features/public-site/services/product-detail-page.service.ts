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
        paisajismo: {
          product: {
            id: 'paisajismo',
            slug: 'paisajismo',
            category: 'paisajismo',
            name: 'Servicios de Paisajismo',
            shortDescription: 'Soluciones integrales para espacios verdes, arquitectura paisajística, ingeniería y mantenimiento.',
            longDescription: [
              'Ofrecemos servicios completos de paisajismo, desde el diseño y diagnóstico hasta la ejecución y mantenimiento de espacios verdes, arquitectura paisajística, ingeniería y venta de plantas y accesorios.'
            ],
            heroData: {
              bannerImage: '/assets/images/backgrounds/fairway/paisajismo.jpg',
              title: 'Paisajismo',
              subtitle: 'Soluciones integrales para espacios verdes',
              breadcrumbTextOne: 'Inicio',
              breadcrumbTextTwo: 'Servicios',
              breadcrumbTextThree: 'Paisajismo',
            },
            content: {
              mainImage: '/assets/images/backgrounds/fairway/paisajismo-1.jpg',
              mainImageAlt: 'Paisajismo',
              title: 'Servicios de Paisajismo',
              blocks: [
                {
                  subtitle: 'Proyecto paisajístico',
                  items: [
                    'Master Plan paisajístico',
                    'Relevamiento y diagnóstico de espacios verdes',
                    'Plan de manejo, conservación y mantenimiento',
                    'Gestión de planes y proyectos',
                    'Formación de personas en mantenimiento',
                    'Consultoría y estudio de medio ambiente y paisajismo',
                    'Elaboración de pliegos bases y condiciones para llamado de licitaciones',
                    'Dirección y seguimiento de obras',
                    'Presentación de Proyecto',
                    'Planos de plantación',
                    'Croquis',
                    'Documentación gráfica y escrita'
                  ]
                },
                {
                  subtitle: 'Arquitectura Paisajística y Planeamiento',
                  items: [
                    'Diseño, croquis, preliminares y anteproyectos',
                    'Cómputos métricos',
                    'Presupuesto base',
                    'Desarrollo del proyecto',
                    'Pliego de especificaciones técnicas',
                    'Dirección de obra',
                    'Gerenciamiento de proyectos',
                    'Gerenciamiento de construcción'
                  ]
                },
                {
                  subtitle: 'Presentaciones',
                  items: [
                    'Planos',
                    'Perspectivas',
                    'Renders',
                    'Croquis, bocetos y dibujos a mano alzada',
                    'Detalles constructivos'
                  ]
                },
                {
                  subtitle: 'Ingeniería paisajística',
                  items: [
                    'Sistemas de Riego',
                    'Iluminación paisajística',
                    'Sistemas de drenaje',
                    'Césped',
                    'Biorremediación',
                    'Techos verdes y jardines verticales',
                    'Recuperación Árboles y sanidad vegetal',
                    'Recuperación de suelos y cuerpos de agua'
                  ]
                },
                {
                  subtitle: 'Servicios de Mantenimiento',
                  items: [
                    'Parques',
                    'Jardines',
                    'Canteros',
                    'Canchas deportivas',
                    'Huertas',
                    'Invernaderos',
                    'Edificios',
                    'Fabricas'
                  ]
                },
                {
                  subtitle: 'Ventas de Plantas',
                  items: [
                    'Florales',
                    'Aromáticas y Verduras',
                    'Plantas de Interior',
                    'Verduras en Plug',
                    'Colgantes',
                    'Cactus y Suculentas',
                    'Arbustos',
                    'Arboles',
                    'Frutales y Cítricos'
                  ]
                },
                {
                  subtitle: 'Accesorios de Plantas',
                  items: [
                    'Tierra Fértil',
                    'Chip Cubresuelo',
                    'Piedras Cantero'
                  ]
                },
                {
                  subtitle: 'Venta de Macetas',
                  items: [
                    'Macetas de Fibrocemento',
                    'Adornos de Fibrocemento'
                  ]
                },
                {
                  subtitle: 'Movimiento de Suelo',
                  items: [
                    'Excavaciones',
                    'Nivelación de caminos',
                    'Compactado',
                    'Demolición de estructuras y edificios'
                  ]
                }
              ],
              highlightedFeatures: [
                'Diseño profesional de espacios verdes',
                'Ingeniería paisajística avanzada',
                'Mantenimiento integral',
                'Venta de plantas y accesorios',
                'Movimiento de suelo y obras',
                'Presentaciones gráficas y técnicas'
              ],
              description: [],
            },
            features: [
              { icon: 'fas fa-leaf', title: 'Diseño', description: 'Proyecto paisajístico y master plan.' },
              { icon: 'fas fa-tree', title: 'Ingeniería', description: 'Riego, drenaje, techos verdes.' },
              { icon: 'fas fa-tools', title: 'Mantenimiento', description: 'Parques, jardines, canteros.' },
              { icon: 'fas fa-seedling', title: 'Venta de plantas', description: 'Florales, aromáticas, arbustos.' },
              { icon: 'fas fa-flask', title: 'Consultoría', description: 'Estudio de medio ambiente y paisajismo.' }
            ],
            specifications: [
              { property: 'Cobertura', value: 'Todo el país' },
              { property: 'Experiencia', value: '12+ años' }
            ],
            types: [],
            challenges: [],
            relatedProducts: [],
            metaTitle: 'Servicios de Paisajismo - Fairway',
            metaDescription: 'Soluciones integrales para espacios verdes, arquitectura paisajística, ingeniería y mantenimiento.',
            keywords: ['paisajismo', 'arquitectura', 'mantenimiento', 'plantas'],
            isActive: true,
            featured: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          related: [],
        },
        urbanismo: {
          product: {
            id: 'urbanismo',
            slug: 'urbanismo',
            category: 'urbanismo',
            name: 'Servicios de Urbanismo',
            shortDescription: 'Soluciones profesionales para obras, construcción, movimiento de suelo, herrería, durlock y carpintería.',
            longDescription: [
              'Ofrecemos servicios integrales de urbanismo, desde arquitectura y diseño de planos hasta construcción, movimiento de suelo, herrería, durlock y carpintería.'
            ],
            heroData: {
              // bannerImage: '/assets/images/backgrounds/fairway/urbanismo-1.jpg',
              bannerImage: '/assets/images/backgrounds/fairway/urbanismo.jpg',
              title: 'Urbanismo',
              subtitle: 'Obras, construcción y servicios esenciales',
              breadcrumbTextOne: 'Inicio',
              breadcrumbTextTwo: 'Servicios',
              breadcrumbTextThree: 'Urbanismo',
            },
            content: {
              mainImage: '/assets/images/backgrounds/fairway/urbanismo-1.jpg',
              mainImageAlt: 'Urbanismo',
              title: 'Servicios de Urbanismo',
              blocks: [
                {
                  subtitle: 'Servicios Profesionales',
                  items: [
                    'Servicios de Arquitectura',
                    'Servicios de Maestro Mayor de Obra',
                    'Diseño de Planos',
                    'Servicios de Agrimensura',
                    'Servicios de Higiene y Seguridad',
                    'Servicios de Diseño de Interiores'
                  ]
                },
                {
                  subtitle: 'Demolición',
                  items: [
                    'Demolición de casas, Edificios, Caminos, Fabricas, Etc.'
                  ]
                },
                {
                  subtitle: 'Movimiento de Suelo',
                  items: [
                    'Excavaciones',
                    'Nivelación de caminos',
                    'Compactado',
                    'Alquiler de minicargadora'
                  ]
                },
                {
                  subtitle: 'Construcción',
                  items: [
                    'Construcción de Casas, Edificios y Estructuras',
                    'Construcción de caminos',
                    'Construcción de canales',
                    'Construcción de desagües y alcantarillados',
                    'Construcción sostenible',
                    'Remodelaciones de viviendas existentes'
                  ]
                },
                {
                  subtitle: 'Servicios de Herrería',
                  items: [
                    'Diseños a medida',
                    'Modificaciones',
                    'Remodelaciones',
                    'Construcciones'
                  ]
                },
                {
                  subtitle: 'Servicios de Durlock',
                  items: [
                    'Colocación de Durlock en cielorrasos y/o paredes',
                    'Construcción de Estructuras en Steel Framing',
                    'Construcción de Estructuras en Wood Framing',
                    'Remodelaciones y/o Modificaciones'
                  ]
                },
                {
                  subtitle: 'Servicios de Carpintería',
                  items: [
                    'Diseño de muebles a medida',
                    'Modificaciones',
                    'Remodelaciones',
                    'Construcciones'
                  ]
                },
                {
                  subtitle: 'Servicios esenciales',
                  items: [
                    'Servicios de Agua',
                    'Servicios Eléctricos',
                    'Servicios de Gas'
                  ]
                }
              ],
              highlightedFeatures: [
                'Arquitectura y diseño profesional',
                'Construcción sostenible',
                'Movimiento de suelo y demolición',
                'Servicios de herrería y carpintería',
                'Servicios esenciales: agua, gas, electricidad'
              ],
              description: [],
            },
            features: [
              { icon: 'fas fa-city', title: 'Arquitectura', description: 'Servicios profesionales y diseño de planos.' },
              { icon: 'fas fa-hammer', title: 'Construcción', description: 'Obras, remodelaciones y sostenibilidad.' },
              { icon: 'fas fa-truck', title: 'Movimiento de suelo', description: 'Excavaciones, nivelación y compactado.' },
              { icon: 'fas fa-wrench', title: 'Herrería y carpintería', description: 'Diseños a medida y remodelaciones.' },
              { icon: 'fas fa-bolt', title: 'Servicios esenciales', description: 'Agua, electricidad y gas.' }
            ],
            specifications: [
              { property: 'Cobertura', value: 'Todo el país' },
              { property: 'Experiencia', value: '12+ años' }
            ],
            types: [],
            challenges: [],
            relatedProducts: [],
            metaTitle: 'Servicios de Urbanismo - Fairway',
            metaDescription: 'Obras, construcción, movimiento de suelo, herrería, durlock y carpintería.',
            keywords: ['urbanismo', 'arquitectura', 'construcción', 'servicios'],
            isActive: true,
            featured: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          related: [],
        },
        agro: {
          product: {
            id: 'agro',
            slug: 'agro',
            category: 'agro',
            name: 'Servicios Agropecuarios',
            shortDescription: 'Soluciones para el agro: siembra, cosecha, administración, logística, semillas y fertilizantes.',
            longDescription: [
              'Brindamos servicios integrales para el sector agropecuario, desde la siembra y cosecha hasta la administración, logística y venta de insumos.'
            ],
            heroData: {
              bannerImage: '/assets/images/backgrounds/bg-4.png',
              title: 'Agro',
              subtitle: 'Soluciones para el campo',
              breadcrumbTextOne: 'Inicio',
              breadcrumbTextTwo: 'Servicios',
              breadcrumbTextThree: 'Agro',
            },
            content: {
              mainImage: '/assets/images/backgrounds/bg-4.png',
              mainImageAlt: 'Agro',
              title: 'Servicios Agropecuarios',
              blocks: [
                {
                  subtitle: 'Servicios de Siembra, Picado y Cosecha',
                  items: [
                    'Siembra a porcentaje',
                    'Labranza conservacionista',
                    'Agricultura de precisión',
                    'Siembra asociada',
                    'Pasturas',
                    'Picado y ensilado de forrajes',
                    'Picado fino',
                    'Cosecha fina y Gruesa'
                  ]
                },
                {
                  subtitle: 'Administración',
                  items: [
                    'Administración de establecimientos agropecuarios',
                    'Asesoramiento integral de tambos'
                  ]
                },
                {
                  subtitle: 'Logística',
                  items: [
                    'Logística a granel de granos, fertilizantes y semillas',
                    'Logística de bolsas e insumos'
                  ]
                },
                {
                  subtitle: 'Venta de Semillas',
                  items: [
                    'Semillas híbridas de maíz, girasol y sorgo',
                    'Semillero de soja y trigo',
                    'Semillas de pasturas y verdeos'
                  ]
                },
                {
                  subtitle: 'Venta de Fertilizantes',
                  items: [
                    'Nitrogenados',
                    'Fosforados',
                    'Mezclas'
                  ]
                },
                {
                  subtitle: 'Otros Servicios',
                  items: [
                    'Asesoramiento agronómico y comercial especializado',
                    'Servicios de Higiene y Seguridad',
                    'Servicios de Gestión Ambiental',
                    'Servicios Veterinarios',
                    'Servicios de Agronomía'
                  ]
                }
              ],
              highlightedFeatures: [
                'Siembra y cosecha profesional',
                'Administración y logística',
                'Venta de semillas y fertilizantes',
                'Servicios veterinarios y agronómicos',
                'Gestión ambiental y seguridad'
              ],
              description: [],
            },
            features: [
              { icon: 'fas fa-tractor', title: 'Siembra y cosecha', description: 'Servicios profesionales y maquinaria.' },
              { icon: 'fas fa-warehouse', title: 'Logística', description: 'Granos, insumos y fertilizantes.' },
              { icon: 'fas fa-seedling', title: 'Semillas', description: 'Venta de híbridos y pasturas.' },
              { icon: 'fas fa-flask', title: 'Fertilizantes', description: 'Nitrogenados, fosforados y mezclas.' },
              { icon: 'fas fa-user-md', title: 'Veterinaria', description: 'Servicios veterinarios y agronómicos.' }
            ],
            specifications: [
              { property: 'Cobertura', value: 'Todo el país' },
              { property: 'Experiencia', value: '12+ años' }
            ],
            types: [],
            challenges: [],
            relatedProducts: [],
            metaTitle: 'Servicios Agropecuarios - Fairway',
            metaDescription: 'Soluciones para el agro: siembra, cosecha, administración, logística, semillas y fertilizantes.',
            keywords: ['agro', 'siembra', 'cosecha', 'logística', 'insumos'],
            isActive: true,
            featured: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          related: [],
        },
        industria: {
          product: {
            id: 'industria',
            slug: 'industria',
            category: 'industria',
            name: 'Servicios Industriales',
            shortDescription: 'Ingeniería hidráulica, industrial, civil, química, sistemas, vial, ambiental y más.',
            longDescription: [
              'Soluciones integrales para la industria: ingeniería, cálculos estructurales, gestión ambiental, higiene y seguridad.'
            ],
            heroData: {
              bannerImage: '/assets/images/backgrounds/fairway/industria.jpg',
              title: 'Industria',
              subtitle: 'Soluciones integrales para la industria',
              breadcrumbTextOne: 'Inicio',
              breadcrumbTextTwo: 'Servicios',
              breadcrumbTextThree: 'Industria',
            },
            content: {
              mainImage: '/assets/images/backgrounds/fairway/industria.jpg',
              mainImageAlt: 'Industria',
              title: 'Servicios Industriales',
              blocks: [
                {
                  subtitle: 'Ingeniería Hidráulica',
                  items: [
                    'Estudios Hidrológicos',
                    'Estudios Hidráulicos',
                    'Hidráulica Marítima',
                    'Ingeniería Sanitaria',
                    'Estudios de Riesgo Hídrico – Oil & Gas'
                  ]
                },
                {
                  subtitle: 'Ingeniería Industrial',
                  items: [
                    'Optimización de Procesos Productivos',
                    'Análisis y Mejora Continua de Sistemas',
                    'Implementación de Sistemas de Gestión de Calidad',
                    'Gestión de la Cadena de Suministro',
                    'Automatización y Control de Procesos',
                    'Estudios de Tiempos y Movimientos',
                    'Consultoría en Eficiencia Energética',
                    'Implementación de Lean Manufacturing',
                    'Simulación de Procesos Industriales',
                    'Mantenimiento Preventivo y Predictivo',
                    'Gestión de Proyectos Industriales',
                    'Servicios de Ejecución de Obra'
                  ]
                },
                {
                  subtitle: 'Ingeniería Civil',
                  items: [
                    'Proyecto y Diseño de Estructuras',
                    'Cálculo Estructural',
                    'Estudios Geotécnicos',
                    'Obras de Infraestructura Urbana y Rural',
                    'Diseño y Construcción de Puentes',
                    'Construcción y Supervisión de Obras Civiles',
                    'Planificación y Diseño de Redes de Servicios Públicos',
                    'Estudios y Obras de Pavimentación',
                    'Control y Gestión de Obras',
                    'Inspección Técnica y Supervisión de Proyectos'
                  ]
                },
                {
                  subtitle: 'Ingeniería Química',
                  items: [
                    'Diseño y Optimización de Procesos Químicos',
                    'Análisis y Control de Calidad en Procesos',
                    'Consultoría en Ingeniería de Procesos',
                    'Escalado y Diseño de Plantas Industriales',
                    'Tratamiento y Gestión de Residuos Químicos',
                    'Investigación y Desarrollo (I+D) en la Industria Química',
                    'Automatización de Procesos Químicos',
                    'Control de la Contaminación Ambiental y Emisiones',
                    'Análisis de Seguridad Química y Gestión de Riesgos',
                    'Implementación de Tecnologías de Energía Limpia',
                    'Estudio y Diseño de Sistemas de Transferencia de Calor y Masa',
                    'Consultoría en Seguridad Industrial y Salud Ocupacional',
                    'Desarrollo de Procesos de Extracción y Purificación'
                  ]
                },
                {
                  subtitle: 'Ingeniería en Sistemas',
                  items: [
                    'Desarrollo de Software a Medida',
                    'Análisis y Diseño de Sistemas Informáticos',
                    'Implementación de Sistemas de Gestión Empresarial (ERP)',
                    'Desarrollo y Mantenimiento de Aplicaciones Web y Móviles',
                    'Consultoría en Transformación Digital',
                    'Arquitectura de Sistemas y Redes',
                    'Seguridad Informática y Ciberseguridad',
                    'Implementación de Bases de Datos y Administración',
                    'Automatización de Procesos Empresariales',
                    'Soporte Técnico y Consultoría de TI',
                    'Desarrollo de Soluciones Cloud (Nube)',
                    'Integración de Sistemas y Software',
                    'Consultoría en Infraestructura Tecnológica',
                    'Optimización de Sistemas de Información'
                  ]
                },
                {
                  subtitle: 'Ingeniería Vial',
                  items: [
                    'Diseños Planimétricos',
                    'Diseño Altimétrico',
                    'Cálculo de Movimiento de Suelo',
                    'Perfiles Transversales',
                    'Planos de Señalización'
                  ]
                },
                {
                  subtitle: 'Ingeniería Ambiental',
                  items: [
                    'Plan de Gestión Ambiental',
                    'Evaluación de Impacto Ambiental',
                    'Estudio de Impacto Ambiental',
                    'Categorización Industrial - Ley 11.459',
                    'Estudios de Impacto Ambiental',
                    'Conformación y Gestión Integral de la Carpeta Técnica de Industria Municipal',
                    'Gestión de Residuos Especiales - Inscripción y renovación Anual',
                    'Gestión de Efluentes Gaseosos',
                    'Presentaciones ante la Secretaría de Ambiente y Desarrollo Sustentable de Nación',
                    'Presentación de Efluentes según Decreto 674',
                    'Trámites ante el CEAMSE',
                    'Limpiezas técnicas y de Tanques con Certificación - Trabajos en Espacios Confinados',
                    'Implementación y Certificación de Sistemas ISO 14001 de Gestión Ambiental',
                    'Elaboración de Planes de Contingencias para actuación ante derrames y otras emergencias ambientales'
                  ]
                },
                {
                  subtitle: 'Agrimensura y Topografía',
                  items: [
                    'Estado parcelario',
                    'Mensura',
                    'Mensura para Proyecto',
                    'Mensura Particular y División en propiedad Horizontal',
                    'Prescripción Adquisitiva',
                    'Asesoramiento Legal y Técnico',
                    'Enrase y Perfiles medianeros',
                    'Controles de obra',
                    'Relevamiento Planialtimétrico'
                  ]
                },
                {
                  subtitle: 'Cálculos Estructurales',
                  items: [
                    'Estructuras Metálicas',
                    'Estructuras de Hormigón Armado',
                    'Cálculo Estructural de Piezas y Elementos Complejos',
                    'Verificación, Diseño y Análisis Térmico de Estructuras de Hormigón Masivo'
                  ]
                },
                {
                  subtitle: 'Trámites ADA',
                  items: [
                    'Prefactibilidad Hídrica',
                    'Aptitud Hidráulica de Obra',
                    'Aptitud de Obra de Explotación del Recurso Hídrico Superficial',
                    'Aptitud de Obra de Explotación del Recurso Hídrico Subterráneo',
                    'Aptitud de Obra para Vertido de Efluentes Líquidos',
                    'Permiso de Aptitud Hidráulica',
                    'Permiso de Explotación del Recurso Hídrico Superficial',
                    'Permiso de Explotación del Recurso Hídrico Subterráneo',
                    'Permiso de Vertido de Efluentes Líquidos'
                  ]
                },
                {
                  subtitle: 'Servicios de Higiene y Seguridad',
                  items: [
                    'Servicios Externos de Higiene y Seguridad',
                    'Implementación y Certificación de Normas ISO 45.001 / ISO 9001',
                    'Mediciones de Campo',
                    'Estudios y Análisis de Riesgos',
                    'Sistemas de Autoprotección LEY 5920 GCBA Y DISPOSICIÓN 1358',
                    'Protocolos de Emergencia Frente al SARS–COVID-19',
                    'Protección Contra Incendios',
                    'Seguridad para trabajos con Riesgos Especiales',
                    'Gestión Ambiental',
                    'Programas de Seguridad - Resolución 51/97 y 319/99',
                    'Cursos y Capacitaciones'
                  ]
                }
              ],
              highlightedFeatures: [
                'Ingeniería hidráulica, industrial y civil',
                'Gestión ambiental y seguridad',
                'Cálculos estructurales y trámites ADA',
                'Agrimensura y topografía',
                'Consultoría y ejecución de obra'
              ],
              description: [],
            },
            features: [
              { icon: 'fas fa-industry', title: 'Ingeniería', description: 'Hidráulica, industrial, civil, química, sistemas.' },
              { icon: 'fas fa-leaf', title: 'Ambiental', description: 'Gestión ambiental y seguridad.' },
              { icon: 'fas fa-drafting-compass', title: 'Cálculos estructurales', description: 'Estructuras metálicas y hormigón.' },
              { icon: 'fas fa-map-marked-alt', title: 'Agrimensura', description: 'Mensura, relevamiento y controles de obra.' },
              { icon: 'fas fa-clipboard-check', title: 'Trámites ADA', description: 'Prefactibilidad, permisos y aptitudes.' }
            ],
            specifications: [
              { property: 'Cobertura', value: 'Todo el país' },
              { property: 'Experiencia', value: '12+ años' }
            ],
            types: [],
            challenges: [],
            relatedProducts: [],
            metaTitle: 'Servicios Industriales - Fairway',
            metaDescription: 'Ingeniería hidráulica, industrial, civil, química, sistemas, vial, ambiental y más.',
            keywords: ['industria', 'ingeniería', 'ambiental', 'cálculos'],
            isActive: true,
            featured: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          related: [],
        },
        seguridad: {
          product: {
            id: 'seguridad',
            slug: 'seguridad',
            category: 'seguridad',
            name: 'Servicios de Seguridad',
            shortDescription: 'Soluciones en cámaras, domótica, alarmas y control de acceso.',
            longDescription: [
              'Ofrecemos servicios integrales de seguridad: venta e instalación de cámaras, domótica, alarmas y control de acceso.'
            ],
            heroData: {
              bannerImage: '/assets/images/backgrounds/bg-2.png',
              title: 'Seguridad',
              subtitle: 'Protección y tecnología para tu espacio',
              breadcrumbTextOne: 'Inicio',
              breadcrumbTextTwo: 'Servicios',
              breadcrumbTextThree: 'Seguridad',
            },
            content: {
              mainImage: '/assets/images/backgrounds/bg-2.png',
              mainImageAlt: 'Seguridad',
              title: 'Servicios de Seguridad',
              blocks: [
                {
                  subtitle: 'Venta / Instalación cámaras',
                  items: [
                    'Cámaras IP, HD y 4K',
                    'Cámaras con detección de movimiento',
                    'Cámaras PTZ (Pan, Tilt, Zoom)',
                    'Cámaras para interiores y exteriores',
                    'Cámaras con visión nocturna y térmica',
                    'Sistemas de grabación y almacenamiento (NVR/DVR)',
                    'Configuración de sistemas de monitoreo remoto (vía smartphone o PC)',
                    'Mantenimiento y actualización de sistemas de cámaras',
                    'Integración con otros sistemas de seguridad (alarmas, control de acceso)'
                  ]
                },
                {
                  subtitle: 'Venta / Instalación equipos de domótica',
                  items: [
                    'Sistemas de automatización de luces',
                    'Termostatos inteligentes',
                    'Controladores de persianas y cortinas automáticas',
                    'Enchufes y tomacorrientes inteligentes',
                    'Sensores de movimiento y de puertas/ventanas',
                    'Controladores de sistemas de seguridad y cámaras',
                    'Integración con asistentes virtuales (Alexa, Google Home, etc.)',
                    'Programación y configuración de sistemas domóticos',
                    'Mantenimiento y soporte técnico para equipos de domótica',
                    'Cerraduras inteligentes'
                  ]
                },
                {
                  subtitle: 'Venta / Instalación Alarmas',
                  items: [
                    'Sistemas de alarmas para intrusos',
                    'Alarmas contra incendios',
                    'Alarmas de pánico y emergencias',
                    'Sensores de movimiento, puertas y ventanas',
                    'Sirenas y luces estroboscópicas',
                    'Comunicadores GSM para notificaciones en tiempo real',
                    'Sistemas de alarma conectados a central de monitoreo',
                    'Instalación de paneles de control y teclados',
                    'Mantenimiento preventivo y correctivo de sistemas de alarmas'
                  ]
                },
                {
                  subtitle: 'Venta / Instalación de Control de Acceso',
                  items: [
                    'Lectores biométricos (huella digital, reconocimiento facial)',
                    'Controladores de acceso por tarjetas o códigos PIN',
                    'Cerraduras electrónicas y magnéticas',
                    'Sistemas de acceso remoto o móvil',
                    'Software de gestión de acceso',
                    'Soluciones de acceso para empresas, oficinas, residencias',
                    'Integración con cámaras de vigilancia y sistemas de alarmas',
                    'Mantenimiento y actualización de sistemas de control de acceso',
                    'Servicios de auditoría y monitoreo de acceso'
                  ]
                },
                {
                  subtitle: 'Venta / Instalación de Sistema de Gestión de Video',
                  items: [
                    'Software de gestión de video (VMS)',
                    'Almacenamiento en la nube para videos de seguridad',
                    'Soluciones de análisis de video (detección de movimiento, reconocimiento facial, seguimiento de objetos)',
                    'Plataformas para monitoreo centralizado de múltiples ubicaciones',
                    'Integración con sistemas de cámaras de videovigilancia',
                    'Soluciones de video en tiempo real y grabación en alta calidad',
                    'Mantenimiento y soporte de plataformas de gestión de video',
                    'Personalización de configuraciones para optimizar la seguridad',
                    'Consultoría para la optimización del sistema de video'
                  ]
                }
              ],
              highlightedFeatures: [
                'Venta e instalación de cámaras',
                'Domótica y automatización',
                'Alarmas y control de acceso',
                'Gestión de video y monitoreo',
                'Integración y soporte técnico'
              ],
              description: [],
            },
            features: [
              { icon: 'fas fa-video', title: 'Cámaras', description: 'IP, HD, 4K, PTZ, visión nocturna.' },
              { icon: 'fas fa-home', title: 'Domótica', description: 'Automatización, sensores y asistentes virtuales.' },
              { icon: 'fas fa-bell', title: 'Alarmas', description: 'Intrusos, incendios, pánico y emergencias.' },
              { icon: 'fas fa-lock', title: 'Control de acceso', description: 'Biométricos, tarjetas, cerraduras electrónicas.' },
              { icon: 'fas fa-server', title: 'Gestión de video', description: 'VMS, análisis, almacenamiento y monitoreo.' }
            ],
            specifications: [
              { property: 'Cobertura', value: 'Todo el país' },
              { property: 'Experiencia', value: '12+ años' }
            ],
            types: [],
            challenges: [],
            relatedProducts: [],
            metaTitle: 'Servicios de Seguridad - Fairway',
            metaDescription: 'Soluciones en cámaras, domótica, alarmas y control de acceso.',
            keywords: ['seguridad', 'cámaras', 'domótica', 'alarmas'],
            isActive: true,
            featured: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          related: [],
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
