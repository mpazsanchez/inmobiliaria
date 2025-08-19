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
        'solar-protection': {
          product: {
            id: 'solar-protection',
            slug: 'solar-protection',
            category: 'solar-protection',
            name: 'Láminas de Protección Solar',
            shortDescription: 'Soluciones para reducir el calor, proteger contra rayos UV y mejorar la eficiencia energética.',
            longDescription: [
              'Las láminas solares para vidrios filtran la radiación solar, reducen el calor y mejoran la eficiencia energética.',
              'Ideales para oficinas, residencias y comercios.'
            ],

            heroData: {
              bannerImage: '/assets/images/backgrounds/solarcheck/slide-1.jpg',
              title: 'Láminas de Protección Solar',
              subtitle: 'Control solar y confort térmico',
              breadcrumbTextOne: 'Inicio',
              breadcrumbTextTwo: 'Productos',
              breadcrumbTextThree: 'Protección Solar'
            },
            content: {
              mainImage: '/assets/images/backgrounds/solarcheck/slide-1.jpg',
              mainImageAlt: 'Láminas de Protección Solar',
              title: 'Láminas de Protección Solar',
              description: [
                'Filtran la radiación solar y reducen el calor.',
                'Mejoran la eficiencia energética y el confort.'
              ],
              highlightedFeatures: [
                'Reducción de hasta 85% del calor',
                'Control del deslumbramiento',
                'Mejora del confort térmico',
                'Reducción de costos de climatización'
              ]
            },
            features: [
              { icon: 'fas fa-sun', title: 'Reducción de Calor', description: 'Hasta 85% menos calor.' },
              { icon: 'fas fa-bolt', title: 'Eficiencia Energética', description: 'Menos consumo de aire acondicionado.' }
            ],
            specifications: [
              { property: 'Protección UV', value: '99%' },
              { property: 'Protección IR', value: '97%' }
            ],
            types: [
              {
                name: 'Láminas Espejadas Plata',
                description: 'Las láminas solares espejadas en tono plata son una solución eficaz para reducir el calor que ingresa a través de los cristales, mejorando el confort en los ambientes y disminuyendo significativamente el gasto en refrigeración. Acabado reflectante, brinda privacidad y protege interiores.',
                specifications: [
                  { property: 'Protección contra rayos UV', value: '99%' },
                  { property: 'Reducción de rayos infrarrojos (IR)', value: '82%' },
                  { property: 'Energía solar total rechazada', value: '74%' },
                  { property: 'Acabado', value: 'Espejo plata' }
                ],
                finish: 'Espejo plata',
                image: '/assets/images/products/solar-plata.jpg',
                challenges: [
                  { question: '¿Las láminas espejadas afectan la visibilidad desde adentro?', answer: 'No, permiten ver hacia afuera con claridad, pero desde afuera brindan privacidad.' },
                  { question: '¿Se pueden instalar en cualquier tipo de vidrio?', answer: 'Sí, son compatibles con la mayoría de los vidrios planos y templados.' },
                  { question: '¿Cuánto tiempo duran las láminas espejadas?', answer: 'Tienen una vida útil de 8 a 12 años según el mantenimiento y exposición solar.' },
                  { question: '¿Requieren mantenimiento especial?', answer: 'Solo limpieza con agua y jabón neutro, evitando productos abrasivos.' },
                  { question: '¿Ayudan a reducir el consumo de aire acondicionado?', answer: 'Sí, al disminuir el ingreso de calor, reducen la necesidad de climatización.' }
                ]
              },
              {
                name: 'Láminas No flexivas tono negras Nano cerámicas',
                description: 'Las láminas solares nano cerámicas en tono negro son una solución avanzada y estética para mejorar el confort y la eficiencia energética en espacios con cristales. Acabado oscuro, protección contra calor y deslumbramiento solar.',
                specifications: [
                  { property: 'Protección contra rayos UV', value: '99%' },
                  { property: 'Reducción de rayos infrarrojos (IR)', value: '80%' },
                  { property: 'Energía solar total rechazada', value: '79%' },
                  { property: 'Tonalidades disponibles', value: 'claro / intermedios / oscuros' }
                ],
                finish: 'Negro nano cerámico',
                image: '/assets/images/products/nano-ceramica.jpg',
                challenges: [
                  { question: '¿Las láminas nano cerámicas se ven oscuras desde adentro?', answer: 'No, ofrecen buena visibilidad y confort visual.' },
                  { question: '¿Protegen contra rayos UV y calor?', answer: 'Sí, bloquean hasta el 99% de rayos UV y gran parte del calor solar.' },
                  { question: '¿Se pueden instalar en automóviles?', answer: 'Sí, son aptas para uso arquitectónico y automotriz.' },
                  { question: '¿Cambian el color del vidrio?', answer: 'Aportan un tono oscuro moderno, sin distorsionar la visión.' },
                  { question: '¿Son resistentes al rayado?', answer: 'Tienen recubrimiento anti-rayas para mayor durabilidad.' }
                ]
              },
              {
                name: 'Láminas Selectivas',
                description: 'Las láminas solares selectivas completamente transparentes son una solución ideal para quienes buscan mejorar la eficiencia energética sin alterar la estética original de los cristales. Mantienen la apariencia natural y la claridad.',
                specifications: [
                  { property: 'Protección contra rayos UV', value: '99%' },
                  { property: 'Reducción de rayos infrarrojos (IR)', value: '95%' },
                  { property: 'Energía solar total rechazada', value: '45%' },
                  { property: 'Acabado', value: 'Transparente' }
                ],
                finish: 'Transparente',
                image: '/assets/images/products/selectiva.jpg',
                challenges: [
                  { question: '¿Las láminas selectivas alteran la estética del vidrio?', answer: 'No, son completamente transparentes y mantienen la apariencia original.' },
                  { question: '¿Bloquean el calor sin oscurecer?', answer: 'Sí, filtran el calor y los rayos UV sin modificar la claridad.' },
                  { question: '¿Son recomendadas para vitrinas comerciales?', answer: 'Sí, protegen productos del sol sin afectar la exhibición.' },
                  { question: '¿Requieren mantenimiento especial?', answer: 'Solo limpieza suave, sin productos abrasivos.' },
                  { question: '¿Tienen garantía?', answer: 'Sí, cuentan con garantía de fábrica de hasta 10 años.' }
                ]
              }
            ],
            challenges: [],
            relatedProducts: [],
            metaTitle: 'Láminas de Protección Solar - Glazing™',
            metaDescription: 'Soluciones solares para confort y eficiencia.',
            keywords: ['solar', 'protección', 'láminas', 'energía'],
            isActive: true,
            featured: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          related: []
        },
        'security': {
          product: {
            id: 'security',
            slug: 'security',
            category: 'security',
            name: 'Láminas de Seguridad',
            shortDescription: 'Protección en caso de rotura y refuerzo de cristales.',
            longDescription: [
              'Las láminas de seguridad mantienen los fragmentos de vidrio unidos en caso de rotura, evitando lesiones.',
              'Ideales para lugares públicos y zonas de alto tránsito.'
            ],
            heroData: {
              bannerImage: '',
              title: 'Láminas de Seguridad',
              subtitle: 'Protección y refuerzo para cristales',
              breadcrumbTextOne: 'Inicio',
              breadcrumbTextTwo: 'Productos',
              breadcrumbTextThree: 'Seguridad'
            },
            content: {
              mainImage: '/assets/images/backgrounds/bg-3.png',
              mainImageAlt: 'Láminas de Seguridad',
              title: 'Láminas de Seguridad',
              description: [
                'Refuerzan cristales y evitan lesiones en caso de rotura. <br> Protegen contra rayos UV. <br> Las láminas de seguridad para cristales son películas adhesivas que se colocan en ventanas y puertas. En caso de rotura, estas láminas mantienen los fragmentos de vidrio unidos, evitando que se dispersen y causen lesiones o daños. <br> Las láminas de seguridad transparentes de 100 micrones están diseñadas para reforzar los cristales, haciéndolos más seguros y resistentes en caso de rotura. Estas láminas actúan como una barrera protectora, manteniendo unidos los fragmentos de vidrio en caso de impacto, lo que previene que se dispersen y causen lesiones o daños a personas y objetos. Esta característica es especialmente crucial en lugares públicos de alto tránsito, donde la seguridad es una prioridad. Beneficios Clave de las Láminas de Seguridad de 100 Micrones:<br> Protección en Caso de Rotura: Estas láminas están diseñadas para mantener el vidrio unido en caso de que se rompa. Esto reduce significativamente el riesgo de lesiones por cortes o daños a los objetos cercanos, ya que los fragmentos de vidrio permanecen adheridos a la lámina, evitando que se esparzan. <br> Ideal para Lugares Públicos: En lugares con alto tránsito, como centros comerciales, escuelas, hospitales y oficinas, estas láminas son fundamentales para garantizar la seguridad de los usuarios. Proporcionan una capa adicional de protección, minimizando el riesgo de accidentes relacionados con vidrios rotos. <br> Protección Contra Rayos UV: Además de su función de seguridad, estas láminas ofrecen una protección del 99% contra los rayos ultravioleta (UV). Esto no solo protege a las personas de los efectos nocivos de la exposición a los rayos UV, sino que también ayuda a prevenir la decoloración y el deterioro de muebles, cortinas, y otros objetos expuestos a la luz solar directa. '
              ],
              highlightedFeatures: [
                'Protección en caso de rotura',
                'Ideal para lugares públicos',
                'Protección UV 99%'
              ]
            },
            features: [
              { icon: 'fas fa-shield-alt', title: 'Protección', description: 'Evita lesiones en caso de rotura.' },
              { icon: 'fas fa-sun', title: 'Protección UV', description: 'Protección UV 99%.' }
            ],
            specifications: [
              { property: 'Espesor', value: '100-400 micrones' },
              { property: 'Protección UV', value: '99%' }
            ],
            types: [
              {
                name: 'Láminas de Seguridad Transparentes (100-400 micrones)',
                description: 'Las láminas de seguridad transparentes están diseñadas para reforzar los cristales, haciéndolos más seguros y resistentes en caso de rotura. Actúan como barrera protectora, manteniendo unidos los fragmentos de vidrio y previniendo lesiones o daños. Disponibles en diferentes espesores: 100, 200, 300 y 400 micrones. Ideales para lugares públicos y zonas de alto tránsito. Ofrecen protección UV del 99% y mantienen la estética original del cristal.',
                specifications: [
                  { property: 'Grosor y disponibilidad', value: '100 / 200 / 300 / 400 micrones' },
                  { property: 'Protección en caso de rotura', value: 'Mantiene los fragmentos de vidrio adheridos a la lámina' },
                  { property: 'Protección contra rayos UV', value: '99%' },
                  { property: 'Impacto en la estética del cristal', value: 'Transparente, sin cambio visible' },
                  { property: 'Resistencia de presión', value: '45.36 kg/cm² (100 micrones), 77 kg/cm² (200), 106 kg/cm² (300), 127 kg/cm² (400)' }
                ],
                finish: 'Transparente',
                image: '/assets/images/products/seguridad-100.jpg',
                challenges: [
                  { question: '¿Las láminas de seguridad afectan la transparencia del vidrio?', answer: 'No, son invisibles y no alteran la estética.' },
                  { question: '¿Qué pasa si el vidrio se rompe?', answer: 'La lámina mantiene los fragmentos unidos, evitando lesiones.' },
                  { question: '¿Son aptas para lugares públicos?', answer: 'Sí, son ideales para escuelas, hospitales y oficinas.' },
                  { question: '¿Protegen contra rayos UV?', answer: 'Sí, bloquean hasta el 99% de rayos UV.' },
                  { question: '¿Cuánto duran instaladas?', answer: 'Tienen una vida útil de 8 a 12 años.' }
                ]
              },
              {
                name: '100 micrones color 20%',
                description: 'Lámina de seguridad de 100 micrones con tonalidad, combina protección física y control solar. Refuerza cristales, reduce temperatura y mejora eficiencia energética. Ofrece privacidad y estética moderna.',
                specifications: [
                  { property: 'Protección contra rayos UV', value: '99%' },
                  { property: 'Reducción de rayos infrarrojos (IR)', value: '97%' },
                  { property: 'Energía solar total rechazada', value: '78%' },
                  { property: 'Acabado', value: 'Color 20%' }
                ],
                finish: 'Color 20%',
                image: '/assets/images/products/seguridad-100-color.jpg',
                challenges: [
                  { question: '¿La lámina de color reduce la visibilidad?', answer: 'Ofrece privacidad sin comprometer la visión desde adentro.' },
                  { question: '¿Combina protección física y solar?', answer: 'Sí, refuerza el vidrio y reduce el ingreso de calor.' },
                  { question: '¿Se puede instalar en cualquier ventana?', answer: 'Sí, es compatible con la mayoría de los cristales.' },
                  { question: '¿Requiere mantenimiento especial?', answer: 'Solo limpieza suave, sin productos abrasivos.' },
                  { question: '¿Tiene garantía?', answer: 'Sí, cuenta con garantía de fábrica.' }
                ]
              }
            ],
            challenges: [
              'Mantener la estética del cristal',
              'Fácil aplicación y durabilidad',
              'Compatibilidad con diferentes tipos de vidrio'
            ],
            relatedProducts: [],
            metaTitle: 'Láminas de Seguridad - Glazing™',
            metaDescription: 'Protección y refuerzo para cristales.',
            keywords: ['seguridad', 'protección', 'cristales', 'uv'],
            isActive: true,
            featured: false,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          related: []
        },
        'decorative': {
          product: {
            id: 'decorative',
            slug: 'decorative',
            category: 'decorative',
            name: 'Láminas Decorativas',
            shortDescription: 'Transforma el aspecto de los vidrios y brinda privacidad.',
            longDescription: [
              'Las láminas decorativas añaden patrones, colores o texturas y brindan privacidad sin sacrificar la entrada de luz natural.',
              'Ideales para hoteles, restaurantes y oficinas.'
            ],
            heroData: {
              bannerImage: '/assets/images/backgrounds/solarcheck/slide-3.png',
              title: 'Láminas Decorativas',
              subtitle: 'Privacidad y diseño elegante',
              breadcrumbTextOne: 'Inicio',
              breadcrumbTextTwo: 'Productos',
              breadcrumbTextThree: 'Decorativas'
            },
            content: {
              mainImage: '/assets/images/backgrounds/solarcheck/slide-3.png',
              mainImageAlt: 'Láminas Decorativas',
              title: 'Láminas Decorativas',
              description: [
                'Transforma el aspecto de los vidrios y brinda privacidad.',
                'Variedad de colores y diseños.'
              ],
              highlightedFeatures: [
                'Privacidad sin pérdida de luz',
                'Variedad de colores',
                'Diseño elegante y moderno',
                'Reducción del deslumbramiento',
                'Fácil mantenimiento y durabilidad',
                'Aplicación versátil'
              ]
            },
            features: [
              { icon: 'fas fa-eye-slash', title: 'Privacidad', description: 'Sin pérdida de luz.' },
              { icon: 'fas fa-palette', title: 'Variedad de colores', description: 'Disponible en blanco y gris.' }
            ],
            specifications: [
              { property: 'Colores disponibles', value: 'Blanco, gris, vinilos de color' },
              { property: 'Acabado', value: 'Mate esmerilado, vinilo' }
            ],
            types: [
              {
                name: 'Láminas Esmeriladas',
                description: 'Las láminas decorativas esmeriladas son una excelente opción para quienes buscan añadir un toque estético y funcional a sus cristales. Permiten el paso de luz natural, bloquean la visión directa y ofrecen privacidad sin pérdida de luminosidad. Disponibles en blanco, grises y otros tonos neutros. Acabado mate y elegante, fácil de limpiar y duradero.',
                specifications: [
                  { property: 'Transmisión de luz', value: 'Alta, permite la entrada de luz natural' },
                  { property: 'Privacidad', value: 'Alta, evita la visión clara desde ambos lados' },
                  { property: 'Disponibilidad de colores', value: 'Blanco, grises, otros tonos neutros' },
                  { property: 'Acabado', value: 'Esmerilado, mate y elegante' },
                  { property: 'Mantenimiento', value: 'Fácil de limpiar y duradero' }
                ],
                finish: 'Esmerilado',
                image: '/assets/images/products/esmerilada.jpg'
              },
              {
                name: 'Vinilos de color',
                description: 'Vinilos decorativos de colores para cristales, ofrecen privacidad total y control completo de la luz. No permiten el paso de luz, bloquean la visión y están disponibles en una amplia gama de colores y estilos. Ideales para oficinas, salas de reuniones, hogares y comercios. Fácil mantenimiento y aplicación versátil.',
                specifications: [
                  { property: 'Transmisión de luz', value: 'Nula, no permite el paso de luz' },
                  { property: 'Privacidad', value: 'Completa, impide la visión desde ambos lados' },
                  { property: 'Disponibilidad de colores', value: 'Amplia gama de colores y estilos' },
                  { property: 'Aplicación', value: 'Superficies de vidrio, ventanas, puertas, divisiones' },
                  { property: 'Colores', value: 'La mayoría de colores disponibles' }
                ],
                finish: 'Color',
                image: '/assets/images/products/vinilo-color.jpg'
              }
            ],
            challenges: [],
            relatedProducts: [],
            metaTitle: 'Láminas Decorativas - Glazing™',
            metaDescription: 'Privacidad y diseño elegante.',
            keywords: ['decorativa', 'esmerilada', 'privacidad', 'diseño'],
            isActive: true,
            featured: false,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          related: []
        },
        'solar-plata': {
          product: {
            id: 'solar-plata',
            slug: 'solar-plata',
            category: 'solar-protection',
            name: 'Solar Espejada Plata',
            shortDescription: 'Lámina reflectante que reduce el calor, protege contra rayos UV e IR, y brinda privacidad.',
            longDescription: [
              'La lámina Solar Espejada Plata está diseñada para maximizar la protección solar y la privacidad.',
              'Su acabado espejado permite una visión clara hacia el exterior mientras bloquea miradas desde fuera.'
            ],
            heroData: {
              bannerImage: '/assets/images/products/solar-plata.jpg',
              title: 'Solar Espejada Plata',
              subtitle: 'Protección solar y privacidad superior',
              breadcrumbTextOne: 'Inicio',
              breadcrumbTextTwo: 'Productos',
              breadcrumbTextThree: 'Solar Espejada Plata'
            },
            content: {
              mainImage: '/assets/images/products/solar-plata.jpg',
              mainImageAlt: 'Solar Espejada Plata',
              title: 'Solar Espejada Plata',
              description: [
                'Reduce el calor y protege contra rayos UV e IR.',
                'Ideal para oficinas, residencias y comercios.'
              ],
              highlightedFeatures: [
                'Bloquea hasta 74% de energía solar',
                'Protección UV 99%',
                'Protección IR 82%',
                'Privacidad con visión hacia el exterior'
              ]
            },
            features: [
              { icon: 'fas fa-sun', title: 'Protección Solar', description: 'Bloquea hasta 74% de energía solar.' },
              { icon: 'fas fa-shield-alt', title: 'Protección UV', description: 'Protección UV 99%.' },
              { icon: 'fas fa-thermometer-half', title: 'Protección IR', description: 'Protección IR 82%.' },
              { icon: 'fas fa-eye-slash', title: 'Privacidad', description: 'Visión hacia el exterior, privacidad desde fuera.' }
            ],
            specifications: [
              { property: 'Protección UV', value: '99%' },
              { property: 'Protección IR', value: '82%' },
              { property: 'Rechazo energía solar', value: '74%' },
              { property: 'Acabado', value: 'Espejado plata' }
            ],
            types: [
              {
                name: 'Plata 15',
                description: 'Mayor rechazo solar, acabado espejado intenso.',
                uvProtection: '99%',
                irReduction: '82%',
                solarEnergyRejection: '74%',
                finish: 'Espejado',
                keyBenefits: ['Máxima privacidad', 'Alto rechazo solar']
              },
              {
                name: 'Plata 35',
                description: 'Balance entre protección y luminosidad.',
                uvProtection: '99%',
                irReduction: '70%',
                solarEnergyRejection: '65%',
                finish: 'Espejado suave',
                keyBenefits: ['Privacidad', 'Protección solar']
              }
            ],
            challenges: [],
            relatedProducts: [
              { name: 'Solar Espejada Bronce', link: '/product/solar-bronce' },
              { name: 'Seguridad 100 micrones', link: '/product/seguridad-100' }
            ],
            metaTitle: 'Solar Espejada Plata - Glazing™',
            metaDescription: 'Lámina reflectante para máxima protección solar y privacidad.',
            keywords: ['solar', 'espejada', 'plata', 'protección', 'privacidad'],
            isActive: true,
            featured: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          related: [
            { id: 'solar-bronce', name: 'Solar Espejada Bronce', image: '/assets/images/products/solar-bronce.jpg', shortDescription: 'Bloquea energía solar y rayos UV, acabado bronce para mayor confort.' },
            { id: 'seguridad-100', name: 'Seguridad 100 micrones', image: '/assets/images/products/seguridad-100.jpg', shortDescription: 'Refuerza cristales, mantiene unidos los fragmentos y protege contra UV.' }
          ]
        },
        'seguridad-100': {
          product: {
            id: 'seguridad-100',
            slug: 'seguridad-100',
            category: 'security',
            name: 'Seguridad 100 micrones',
            shortDescription: 'Lámina transparente que refuerza cristales y protege contra rayos UV.',
            longDescription: [
              'La lámina Seguridad 100 micrones está diseñada para reforzar cristales y evitar lesiones en caso de rotura.',
              'Ideal para lugares públicos y zonas de alto tránsito.'
            ],
            heroData: {
              bannerImage: '/assets/images/products/seguridad-100.jpg',
              title: 'Seguridad 100 micrones',
              subtitle: 'Protección y refuerzo para cristales',
              breadcrumbTextOne: 'Inicio',
              breadcrumbTextTwo: 'Productos',
              breadcrumbTextThree: 'Seguridad 100 micrones'
            },
            content: {
              mainImage: '/assets/images/products/seguridad-100.jpg',
              mainImageAlt: 'Seguridad 100 micrones',
              title: 'Seguridad 100 micrones',
              description: [
                'Refuerza cristales y mantiene unidos los fragmentos en caso de rotura.',
                'Protege contra rayos UV.'
              ],
              highlightedFeatures: [
                'Protección en caso de rotura',
                'Ideal para lugares públicos',
                'Protección UV 99%'
              ]
            },
            features: [
              { icon: 'fas fa-shield-alt', title: 'Protección', description: 'Evita lesiones en caso de rotura.' },
              { icon: 'fas fa-sun', title: 'Protección UV', description: 'Protección UV 99%.' }
            ],
            specifications: [
              { property: 'Espesor', value: '100 micrones' },
              { property: 'Protección UV', value: '99%' }
            ],
            types: [
              {
                name: 'Transparente',
                description: 'Protección sin alterar la estética del vidrio.',
                uvProtection: '99%',
                keyBenefits: ['Protección', 'Transparencia']
              }
            ],
            challenges: [],
            relatedProducts: [
              { name: 'Solar Espejada Plata', link: '/product/solar-plata' }
            ],
            metaTitle: 'Seguridad 100 micrones - Glazing™',
            metaDescription: 'Lámina transparente para reforzar cristales y proteger contra rayos UV.',
            keywords: ['seguridad', 'protección', 'cristales', 'uv'],
            isActive: true,
            featured: false,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          related: [
            { id: 'solar-plata', name: 'Solar Espejada Plata', image: '/assets/images/products/solar-plata.jpg', shortDescription: 'Reduce el calor, protege UV y brinda privacidad con acabado reflectante.' }
          ]
        },
        'decorativa-esmerilada': {
          product: {
            id: 'decorativa-esmerilada',
            slug: 'decorativa-esmerilada',
            category: 'decorative',
            name: 'Decorativa Esmerilada',
            shortDescription: 'Lámina mate que brinda privacidad sin perder luz, disponible en varios colores.',
            longDescription: [
              'La lámina Decorativa Esmerilada transforma el aspecto de los vidrios y brinda privacidad.',
              'Disponible en blanco y gris, con acabado mate esmerilado.'
            ],
            heroData: {
              bannerImage: '/assets/images/products/decorativa-esmerilada.jpg',
              title: 'Decorativa Esmerilada',
              subtitle: 'Privacidad y diseño elegante',
              breadcrumbTextOne: 'Inicio',
              breadcrumbTextTwo: 'Productos',
              breadcrumbTextThree: 'Decorativa Esmerilada'
            },
            content: {
              mainImage: '/assets/images/products/decorativa-esmerilada.jpg',
              mainImageAlt: 'Decorativa Esmerilada',
              title: 'Decorativa Esmerilada',
              description: [
                'Brinda privacidad sin perder luz.',
                'Diseño elegante y moderno.'
              ],
              highlightedFeatures: [
                'Privacidad sin pérdida de luz',
                'Variedad de colores',
                'Diseño elegante y moderno',
                'Reducción del deslumbramiento',
                'Fácil mantenimiento y durabilidad',
                'Aplicación versátil'
              ]
            },
            features: [
              { icon: 'fas fa-eye-slash', title: 'Privacidad', description: 'Sin pérdida de luz.' },
              { icon: 'fas fa-palette', title: 'Variedad de colores', description: 'Disponible en blanco y gris.' }
            ],
            specifications: [
              { property: 'Colores disponibles', value: 'Blanco, gris' },
              { property: 'Acabado', value: 'Mate esmerilado' }
            ],
            types: [
              {
                name: 'Blanco',
                description: 'Acabado mate esmerilado blanco.',
                keyBenefits: ['Privacidad', 'Diseño elegante']
              },
              {
                name: 'Gris',
                description: 'Acabado mate esmerilado gris.',
                keyBenefits: ['Privacidad', 'Diseño moderno']
              }
            ],
            challenges: [],
            relatedProducts: [
              { name: 'Solar Espejada Plata', link: '/product/solar-plata' }
            ],
            metaTitle: 'Decorativa Esmerilada - Glazing™',
            metaDescription: 'Lámina mate para privacidad y diseño elegante.',
            keywords: ['decorativa', 'esmerilada', 'privacidad', 'diseño'],
            isActive: true,
            featured: false,
            createdAt: new Date(),
            updatedAt: new Date()
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
