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
  template: `
    <section class="product-content">
      <div class="container">
        <div class="row product-introduction">
          
          <!-- Contenido Principal - Left -->
          <div class="col-lg-7 col-md-12 container-left">
            
            <!-- Imagen Principal -->
            <div class="content-image">
              <img 
                [src]="content.mainImage" 
                [alt]="content.mainImageAlt" 
                class="img-fluid rounded shadow-sm">
            </div>
           
            <!-- Texto Descriptivo -->
            <div class="content-text">
              <h2 class="section-title">{{ content.title }}</h2>
              
              @for (paragraph of content.description; track $index) {
                <p class="section-description">{{ paragraph }}</p>
              }
              
              @if (content.highlightedFeatures.length > 0) {
                <ul class="feature-list">
                  @for (feature of content.highlightedFeatures; track $index) {
                    <li>
                      <i class="fas fa-check text-primary"></i> 
                      {{ feature }}
                    </li>
                  }
                </ul>
              }
            </div>
          </div>

          <!-- Sidebar - Right -->
          <div class="col-lg-4 col-md-12 offset-lg-1 container-right">
            
            <!-- Lista de Productos Relacionados -->
            @if (relatedProducts && relatedProducts.length > 0) {
              <div class="products-list d-flex flex-column gap-3">
                <h4 class="products-list-title">Productos Relacionados</h4>
                
                @for (item of relatedProducts; track $index) {
                  <div class="product-item d-flex justify-content-between align-items-center">
                    <span class="product-name">{{ item.name }}</span>
                    <a [href]="item.link" class="product-link">
                      <i class="fas fa-arrow-right"></i>
                    </a>
                  </div>
                }
              </div>
            }

            <!-- Banner de Contacto -->
            <div class="contact-banner d-flex align-items-center p-3 rounded shadow-sm mt-4">
              <div class="contact-icon me-3">
                <i class="fas fa-phone text-primary"></i>
              </div>
              <div class="contact-content">
                <p class="mb-1 text-muted">Comunícate con nosotros</p>
                <h5 class="fw-bold mb-0">+54 9 351 123-4567</h5>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
  styleUrl: './product-content.component.scss'
})
export class ProductContentComponent {
  @Input({ required: true }) content!: ProductContent;
  @Input() relatedProducts: ProductNavigationItem[] = [];
}
