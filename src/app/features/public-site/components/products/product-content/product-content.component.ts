import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { ProductContent, ProductNavigationItem } from '../../../models';
import { SanitizerService } from '../../../../../core/services/sanitizer.service';

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

  private sanitizerService = inject(SanitizerService);

  /**
   * Sanitiza la descripción HTML para prevenir XSS
   */
  get safeDescription(): SafeHtml {
    if (typeof this.content?.description === 'string') {
      return this.sanitizerService.sanitizeHtml(this.content.description);
    }
    return '';
  }
}
