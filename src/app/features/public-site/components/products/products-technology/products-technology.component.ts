import { Component, Input } from '@angular/core';
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
  @Input() productTypes: ProductType[] = [];
  @Input() technicalBenefits: TechnicalBenefit[] = [];
  @Input() showCallToAction?: boolean = true;

  trackByProductId(index: number, item: ProductType): string {
    return item.id;
  }

  trackByBenefitTitle(index: number, item: TechnicalBenefit): string {
    return item.title;
  }
}
