import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  imports: [CommonModule, RouterModule],
  templateUrl: './products-technology.component.html',
  styleUrl: './products-technology.component.scss'
})
export class ProductsTechnologyComponent {
  @Input() showTechnicalBenefits?: boolean = true;
  @Input() showProductType?: boolean = true;
  @Input() productTypes: ProductType[] = [];
  @Input() technicalBenefits: TechnicalBenefit[] = [
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
  ];
  @Input() showCallToAction?: boolean = true;

  trackByProductId(index: number, item: ProductType): string {
    return item.id;
  }

  trackByBenefitTitle(index: number, item: TechnicalBenefit): string {
    return item.title;
  }
}
