import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFeature } from '../../../models';

/**
 * Componente para mostrar las características del producto
 * Grid responsive con iconos y descripciones
 */
@Component({
  selector: 'app-product-features',
  standalone: true,
  imports: [CommonModule],
  template: './product-features.component.html',
  styleUrl: './product-features.component.scss'
})
export class ProductFeaturesComponent {
  @Input({ required: true }) features!: ProductFeature[];
  @Input() title: string = 'Características Destacadas';
  @Input() subtitle: string = '';
}
