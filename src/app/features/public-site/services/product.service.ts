import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { 
  Product, 
  ProductListResponse, 
  ProductFilters, 
  ProductCategory,
  ProductFeature,
  TechnicalSpec,
  ProductChallenge,
  ProductType,
  ProductBanner 
} from '../models';

/**
 * Servicio para gestión de productos
 * Simula llamadas a API pero está preparado para integrarse con backend real
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  /**
   * Obtener producto por slug
   * @param slug - Identificador único del producto
   * @returns Observable<Product | null>
   */
  getProductBySlug(slug: string): Observable<Product | null> {
    const product = this.getProductData(slug);
    return of(product).pipe(delay(500)); // Simula latencia de red
  }

  /**
   * Obtener producto por ID
   * @param id - ID del producto
   * @returns Observable<Product | null>
   */
  getProductById(id: string): Observable<Product | null> {
    // En producción esto haría una llamada HTTP
    const allProducts = this.getAllProductsSync();
    const product = allProducts.find(p => p.id === id) || null;
    return of(product).pipe(delay(300));
  }

  /**
   * Listar productos con filtros
   * @param filters - Filtros de búsqueda
   * @param page - Página actual
   * @param limit - Elementos por página
   * @returns Observable<ProductListResponse>
   */
  getProducts(filters: ProductFilters = {}, page: number = 1, limit: number = 10): Observable<ProductListResponse> {
    let products = this.getAllProductsSync();

    // Aplicar filtros
    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }
    if (filters.featured !== undefined) {
      products = products.filter(p => p.featured === filters.featured);
    }
    if (filters.isActive !== undefined) {
      products = products.filter(p => p.isActive === filters.isActive);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.shortDescription.toLowerCase().includes(searchTerm)
      );
    }

    // Paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    const response: ProductListResponse = {
      products: paginatedProducts,
      total: products.length,
      page,
      limit,
      totalPages: Math.ceil(products.length / limit)
    };

    return of(response).pipe(delay(400));
  }

  /**
   * Obtener productos destacados
   * @param limit - Número máximo de productos
   * @returns Observable<Product[]>
   */
  getFeaturedProducts(limit: number = 6): Observable<Product[]> {
    const products = this.getAllProductsSync()
      .filter(p => p.featured && p.isActive)
      .slice(0, limit);
    
    return of(products).pipe(delay(300));
  }

  /**
   * Obtener productos relacionados
   * @param currentProductId - ID del producto actual
   * @param category - Categoría para filtrar relacionados
   * @param limit - Número máximo de productos
   * @returns Observable<Product[]>
   */
  getRelatedProducts(currentProductId: string, category?: ProductCategory, limit: number = 4): Observable<Product[]> {
    let products = this.getAllProductsSync()
      .filter(p => p.id !== currentProductId && p.isActive);
    
    if (category) {
      products = products.filter(p => p.category === category);
    }
    
    return of(products.slice(0, limit)).pipe(delay(300));
  }

  /**
   * Datos hardcodeados de productos (simula base de datos)
   * En producción esto vendría de una API
   */
  private getProductData(slug: string): Product | null {
    const products = this.getAllProductsSync();
    return products.find(p => p.slug === slug) || null;
  }

  /**
   * Obtener todos los productos (método privado para simulación)
   */
  private getAllProductsSync(): Product[] {
    return [
      // Producto: Láminas de Protección Solar
      {
        id: 'solar-protection-film-001',
        slug: 'solar-protection-film',
        category: ProductCategory.SOLAR_FILMS,
        name: 'Láminas de Protección Solar',
        shortDescription: 'Tecnología avanzada para el control térmico y ahorro energético en tus espacios',
        longDescription: [
          'Nuestras láminas de protección solar combinan tecnología avanzada con diferentes opciones estéticas para brindar soluciones eficaces contra el calor, los rayos UV y el deslumbramiento. Desde láminas completamente transparentes hasta opciones espejadas que proporcionan privacidad.',
          'Cada tipo de lámina está diseñado para necesidades específicas: las espejadas plata ofrecen máxima privacidad, las nano cerámicas negras complementan la arquitectura moderna, y las selectivas transparentes preservan la estética original manteniendo excelente protección.'
        ],
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
            icon: 'fas fa-shield-alt',
            title: 'Protección UV 99%',
            description: 'Bloquea el 99% de los rayos ultravioleta dañinos, protegiendo tu piel y tus muebles del desgaste prematuro.'
          },
          {
            icon: 'fas fa-thermometer-half',
            title: 'Control Térmico',
            description: 'Reduce significativamente el calor interior, creando ambientes más confortables y disminuyendo el uso de aire acondicionado.'
          },
          {
            icon: 'fas fa-eye-slash',
            title: 'Privacidad',
            description: 'Opciones espejadas que permiten visión clara hacia el exterior mientras mantienen tu privacidad durante el día.'
          },
          {
            icon: 'fas fa-leaf',
            title: 'Ahorro Energético',
            description: 'Contribuye a la eficiencia energética de tu hogar u oficina, reduciendo costos de climatización hasta un 30%.'
          }
        ],
        specifications: [
          { property: 'Transmisión de luz visible', value: '15-70', unit: '%' },
          { property: 'Reducción de calor solar', value: '45-79', unit: '%' },
          { property: 'Protección UV', value: '99', unit: '%' },
          { property: 'Reducción de deslumbramiento', value: '30-85', unit: '%' },
          { property: 'Espesor', value: '50-100', unit: 'micrones' },
          { property: 'Garantía', value: '10', unit: 'años' }
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
        ],
        metaTitle: 'Láminas de Protección Solar - Glazing™',
        metaDescription: 'Láminas de protección solar de alta tecnología. 99% protección UV, control térmico y ahorro energético. Espejadas, cerámicas y transparentes.',
        keywords: ['láminas solares', 'protección UV', 'control térmico', 'ahorro energético', 'láminas espejadas', 'nano cerámicas'],
        isActive: true,
        featured: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-08-08')
      },
      
      // Producto: Láminas de Protección Solar (versión con slug diferente)
      {
        id: 'solar-protection-film-002',
        slug: 'solar-protection-film-001',
        category: ProductCategory.SOLAR_FILMS,
        name: 'Láminas de Protección Solar Premium',
        shortDescription: 'Tecnología avanzada para el control térmico y ahorro energético en tus espacios',
        longDescription: [
          'Nuestras láminas de protección solar combinan tecnología avanzada con diferentes opciones estéticas para brindar soluciones eficaces contra el calor, los rayos UV y el deslumbramiento. Desde láminas completamente transparentes hasta opciones espejadas que proporcionan privacidad.',
          'Cada tipo de lámina está diseñado para necesidades específicas: las espejadas plata ofrecen máxima privacidad, las nano cerámicas negras complementan la arquitectura moderna, y las selectivas transparentes preservan la estética original manteniendo excelente protección.'
        ],
        heroData: {
          bannerImage: './assets/images/backgrounds/solarcheck/slide-2.jpg',
          title: 'Láminas de Protección Solar Premium',
          subtitle: 'Tecnología avanzada para el control térmico y ahorro energético en tus espacios',
          breadcrumbTextOne: 'HOME',
          breadcrumbTextTwo: 'PRODUCTOS',
          breadcrumbTextThree: 'Láminas de Protección Solar Premium'
        },
        content: {
          mainImage: '/assets/images/backgrounds/solarcheck/slide-2.jpg',
          mainImageAlt: 'Láminas de Protección Solar Premium',
          title: 'Protección Solar Avanzada Premium',
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
            icon: 'fas fa-shield-alt',
            title: 'Protección UV 99%',
            description: 'Bloquea el 99% de los rayos ultravioleta dañinos, protegiendo tu piel y tus muebles del desgaste prematuro.'
          },
          {
            icon: 'fas fa-thermometer-half',
            title: 'Control Térmico',
            description: 'Reduce significativamente el calor interior, creando ambientes más confortables y disminuyendo el uso de aire acondicionado.'
          },
          {
            icon: 'fas fa-eye-slash',
            title: 'Privacidad',
            description: 'Opciones espejadas que permiten visión clara hacia el exterior mientras mantienen tu privacidad durante el día.'
          },
          {
            icon: 'fas fa-leaf',
            title: 'Ahorro Energético',
            description: 'Contribuye a la eficiencia energética de tu hogar u oficina, reduciendo costos de climatización hasta un 30%.'
          }
        ],
        specifications: [
          { property: 'Transmisión de luz visible', value: '15-70', unit: '%' },
          { property: 'Reducción de calor solar', value: '45-79', unit: '%' },
          { property: 'Protección UV', value: '99', unit: '%' },
          { property: 'Reducción de deslumbramiento', value: '30-85', unit: '%' },
          { property: 'Espesor', value: '50-100', unit: 'micrones' },
          { property: 'Garantía', value: '10', unit: 'años' }
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
        ],
        metaTitle: 'Láminas de Protección Solar Premium - Glazing™',
        metaDescription: 'Láminas de protección solar de alta tecnología. 99% protección UV, control térmico y ahorro energético. Espejadas, cerámicas y transparentes.',
        keywords: ['láminas solares', 'protección UV', 'control térmico', 'ahorro energético', 'láminas espejadas', 'nano cerámicas'],
        isActive: true,
        featured: true,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-08-08')
      }
      // Aquí se pueden agregar más productos...
    ];
  }
}
