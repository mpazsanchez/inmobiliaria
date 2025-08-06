import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProductType {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  applications: string[];
}

interface TechnicalBenefit {
  icon: string;
  title: string;
  description: string;
  percentage?: string;
}

@Component({
  selector: 'app-products-technology',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-technology.component.html',
  styleUrl: './products-technology.component.scss'
})
export class ProductsTechnologyComponent {

  productTypes: ProductType[] = [
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
  ];

  technicalBenefits: TechnicalBenefit[] = [
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
      description: 'Garantía de hasta 10 años, resistentes al desgaste, sol y paso del tiempo.'
    }
  ];

  trackByProductId(index: number, item: ProductType): string {
    return item.id;
  }

  trackByBenefitTitle(index: number, item: TechnicalBenefit): string {
    return item.title;
  }
}
