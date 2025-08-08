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
  template: `
    <section class="product-features py-5">
      <div class="container">
        
        @if (title) {
          <div class="row mb-5">
            <div class="col-12 text-center">
              <h2 class="section-title">{{ title }}</h2>
              @if (subtitle) {
                <p class="section-subtitle">{{ subtitle }}</p>
              }
            </div>
          </div>
        }
        
        <div class="row g-4">
          @for (feature of features; track $index) {
            <div class="col-lg-3 col-md-6 col-sm-12">
              <div class="feature-card h-100">
                <div class="feature-icon">
                  <i [class]="feature.icon"></i>
                </div>
                <h4 class="feature-title">{{ feature.title }}</h4>
                <p class="feature-description">{{ feature.description }}</p>
              </div>
            </div>
          }
        </div>
        
      </div>
    </section>
  `,
  styleUrl: './product-features.component.scss'
})
export class ProductFeaturesComponent {
  @Input({ required: true }) features!: ProductFeature[];
  @Input() title: string = 'Características Destacadas';
  @Input() subtitle: string = '';
}
