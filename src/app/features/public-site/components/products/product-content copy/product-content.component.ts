import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductContent, ProductNavigationItem } from '../../../models';

/**
 * Componente para mostrar el contenido principal del producto
 * Incluye imagen, descripción y características destacadas
 */
@Component({
  selector: 'app-product-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-content.component.html',
  styleUrl: './product-content.component.scss'
})
export class ProductContentComponent {
  @Input({ required: true }) content!: ProductContent;
  @Input() relatedProducts: ProductNavigationItem[] = [];
}
