import { Injectable, signal } from '@angular/core';
import { ProductType } from '../models/product.interface';

@Injectable({ providedIn: 'root' })
export class SolutionsPageService {
  readonly products = signal<ProductType[]>([
    {
      name: 'Láminas de control solar',
      description: 'Las láminas solares para vidrios son películas que se aplican sobre las ventanas para filtrar la radiación solar. Esto reduce el calor que ingresa, mejorando la eficiencia energética y manteniendo los interiores más frescos.',
      uvProtection: '99%',
      irReduction: '82%',
      solarEnergyRejection: '74%',
      finish: 'Espejado plata',
      keyBenefits: [
        'Reducción de calor',
        'Mejora de eficiencia energética',
        'Protección UV',
        'Privacidad sin perder luz natural'
      ],
      specifications: [
        { property: 'Protección UV', value: '99%' },
        { property: 'Reducción IR', value: '82%' },
        { property: 'Rechazo energía solar', value: '74%' }
      ]
    },
    {
      name: 'Láminas de seguridad',
      description: 'Las láminas de seguridad para cristales son películas adhesivas que se colocan en ventanas y puertas. En caso de rotura, estas láminas mantienen los fragmentos de vidrio unidos, evitando que se dispersen y causen lesiones o daños.',
      uvProtection: '99%',
      keyBenefits: [
        'Protección en caso de rotura',
        'Ideal para lugares públicos',
        'Protección contra rayos UV'
      ],
      specifications: [
        { property: 'Espesor', value: '100', unit: 'micrones' },
        { property: 'Protección UV', value: '99%' }
      ]
    },
    {
      name: 'Láminas decorativas esmeriladas',
      description: 'Las láminas decorativas para cristales son películas adhesivas que se aplican con fines estéticos. Transforman el aspecto de los vidrios, añadiendo patrones, colores o texturas, y brindando privacidad sin sacrificar la entrada de luz natural.',
      keyBenefits: [
        'Privacidad sin pérdida de luz',
        'Diseño elegante y moderno',
        'Reducción del deslumbramiento',
        'Fácil mantenimiento y durabilidad',
        'Aplicación versátil'
      ],
      specifications: [
        { property: 'Colores disponibles', value: 'Blanco, gris' },
        { property: 'Acabado', value: 'Mate esmerilado' }
      ]
    }
  ]);
}
