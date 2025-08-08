import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionPublicComponent } from '../../hero-section-public/hero-section-public.component';
import { ProductHeroData } from '../../../models';

/**
 * Componente Hero específico para páginas de productos
 * Reutilizable para cualquier producto que implemente ProductHeroData
 */
@Component({
  selector: 'app-product-hero',
  standalone: true,
  imports: [CommonModule, HeroSectionPublicComponent],
  template: `
    <app-hero-section-public
      [backgroundImage]="heroData.bannerImage"
      [title]="heroData.title"
      [subtitle]="heroData.subtitle"
      [breadcrumbTextOne]="heroData.breadcrumbTextOne"
      [breadcrumbTextTwo]="heroData.breadcrumbTextTwo"
      [breadcrumbTextThree]="heroData.breadcrumbTextThree"
    />
  `,
  styleUrl: './product-hero.component.scss'
})
export class ProductHeroComponent {
  @Input({ required: true }) heroData!: ProductHeroData;
}
