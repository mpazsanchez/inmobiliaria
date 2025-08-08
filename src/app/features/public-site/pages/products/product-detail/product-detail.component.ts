import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';

// Servicios
import { ProductService } from '../../../services/product.service';

// Modelos
import { Product } from '../../../models';

// Componentes
import { ProductHeroComponent } from '../../../components/products/product-hero/product-hero.component';
import { ProductContentComponent } from '../../../components/products/product-content/product-content.component';
import { ProductFeaturesComponent } from '../../../components/products/product-features/product-features.component';

/**
 * Página genérica para mostrar detalles de cualquier producto
 * Utiliza el slug de la ruta para cargar dinámicamente el producto
 * Sigue el patrón de arquitectura modular definido en README.md
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    ProductHeroComponent,
    ProductContentComponent,
    ProductFeaturesComponent
  ],
  template: `
    <!-- Loading State -->
    @if (isLoading()) {
      <div class="loading-container d-flex justify-content-center align-items-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando producto...</span>
        </div>
      </div>
    }

    <!-- Error State -->
    @else if (error()) {
      <div class="error-container text-center py-5">
        <div class="container">
          <i class="fas fa-exclamation-triangle text-warning mb-3" style="font-size: 3rem;"></i>
          <h2>Producto no encontrado</h2>
          <p class="text-muted">{{ error() }}</p>
          <button 
            class="btn btn-primary"
            (click)="goBack()">
            <i class="fas fa-arrow-left me-2"></i>
            Volver a Productos
          </button>
        </div>
      </div>
    }

    <!-- Product Content -->
    @else if (product()) {
      <div class="product-detail-page">
        
        <!-- Hero Section -->
        <app-product-hero [heroData]="product()!.heroData" />
        
        <!-- Main Content -->
        <app-product-content 
          [content]="product()!.content"
          [relatedProducts]="product()!.relatedProducts" />
        
        <!-- Features Section -->
        @if (product()?.features && product()!.features.length > 0) {
          <app-product-features 
            [features]="product()!.features"
            [title]="'¿Por qué elegir ' + product()!.name + '?'"
            [subtitle]="'Características que marcan la diferencia'" />
        }
        
        <!-- Product Types Section -->
        @if (product()?.types && product()!.types!.length > 0) {
          <section class="product-types py-5">
            <div class="container">
              <div class="row mb-5">
                <div class="col-12 text-center">
                  <h2 class="section-title">Tipos Disponibles</h2>
                  <p class="section-description">
                    Diferentes opciones para adaptarse a tus necesidades específicas
                  </p>
                </div>
              </div>
              
              <div class="row g-4">
                @for (type of product()?.types; track $index) {
                  <div class="col-lg-4 col-md-6">
                    <div class="type-card h-100">
                      <div class="type-header">
                        <h4 class="type-name">{{ type.name }}</h4>
                        @if (type.finish) {
                          <span class="type-finish">{{ type.finish }}</span>
                        }
                      </div>
                      
                      <p class="type-description">{{ type.description }}</p>
                      
                      @if (type.uvProtection || type.irReduction || type.solarEnergyRejection) {
                        <div class="type-specs">
                          @if (type.uvProtection) {
                            <div class="spec-item">
                              <i class="fas fa-shield-alt text-primary"></i>
                              <span>UV: {{ type.uvProtection }}</span>
                            </div>
                          }
                          @if (type.irReduction) {
                            <div class="spec-item">
                              <i class="fas fa-thermometer-half text-danger"></i>
                              <span>IR: {{ type.irReduction }}</span>
                            </div>
                          }
                          @if (type.solarEnergyRejection) {
                            <div class="spec-item">
                              <i class="fas fa-sun text-warning"></i>
                              <span>Solar: {{ type.solarEnergyRejection }}</span>
                            </div>
                          }
                        </div>
                      }
                      
                      @if (type.keyBenefits && type.keyBenefits.length > 0) {
                        <ul class="type-benefits">
                          @for (benefit of type.keyBenefits; track $index) {
                            <li>
                              <i class="fas fa-check text-success"></i>
                              {{ benefit }}
                            </li>
                          }
                        </ul>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </section>
        }
        
        <!-- Specifications Section -->
        @if (product()?.specifications && product()!.specifications.length > 0) {
          <section class="product-specifications py-5 bg-light">
            <div class="container">
              <div class="row">
                <div class="col-12 text-center mb-5">
                  <h2 class="section-title">Especificaciones Técnicas</h2>
                </div>
                
                <div class="col-lg-8 mx-auto">
                  <div class="specifications-table">
                    @for (spec of product()!.specifications; track $index) {
                      <div class="spec-row">
                        <div class="spec-property">{{ spec.property }}</div>
                        <div class="spec-value">
                          {{ spec.value }}
                          @if (spec.unit) {
                            {{ spec.unit }}
                          }
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </section>
        }
        
        <!-- Challenges/FAQ Section -->
        @if (product()?.challenges && product()!.challenges.length > 0) {
          <section class="product-challenges py-5">
            <div class="container">
              <div class="row">
                <div class="col-12 text-center mb-5">
                  <h2 class="section-title">Preguntas Frecuentes</h2>
                </div>
                
                <div class="col-lg-8 mx-auto">
                  <div class="accordion" id="challengesAccordion">
                    @for (challenge of product()?.challenges; track $index) {
                      <div class="accordion-item">
                        <h3 class="accordion-header" [id]="'heading' + $index">
                          <button 
                            class="accordion-button collapsed" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            [attr.data-bs-target]="'#collapse' + $index"
                            [attr.aria-expanded]="false"
                            [attr.aria-controls]="'collapse' + $index">
                            {{ challenge.question }}
                          </button>
                        </h3>
                        <div 
                          [id]="'collapse' + $index"
                          class="accordion-collapse collapse"
                          [attr.aria-labelledby]="'heading' + $index"
                          data-bs-parent="#challengesAccordion">
                          <div class="accordion-body">
                            {{ challenge.answer }}
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </section>
        }
        
        <!-- Call to Action Banner -->
        @if (product()?.banner) {
          <section class="product-banner py-5" 
                   [style.background-color]="product()?.banner?.backgroundColor"
                   [style.color]="product()?.banner?.textColor">
            <div class="container text-center">
              <div class="row align-items-center">
                <div class="col-lg-8 mx-auto">
                  <i [class]="product()?.banner?.icon + ' mb-3'" style="font-size: 3rem;"></i>
                  <h2 class="banner-title">{{ product()?.banner?.title }}</h2>
                  <h4 class="banner-subtitle">{{ product()?.banner?.subtitle }}</h4>
                  <p class="banner-description">{{ product()?.banner?.description }}</p>
                  <a 
                    [href]="product()?.banner?.buttonAction" 
                    class="btn btn-light btn-lg">
                    {{ product()?.banner?.buttonText }}
                  </a>
                </div>
              </div>
            </div>
          </section>
        }
        
      </div>
    }
  `,
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  
  // Signals para manejo de estado reactivo
  product = signal<Product | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  // Para limpiar suscripciones
  private destroy$ = new Subject<void>();
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar producto basado en el slug de la ruta
   */
  private loadProduct(): void {
    this.isLoading.set(true);
    this.error.set(null);

    const slug = this.route.snapshot.paramMap.get('slug');
    
    if (!slug) {
      this.error.set('No se encontró el identificador del producto');
      this.isLoading.set(false);
      return;
    }

    this.productService.getProductBySlug(slug)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (product: Product | null) => {
          if (product) {
            this.product.set(product);
            this.updateSEO(product);
          } else {
            this.error.set('No se encontró el producto especificado');
          }
        },
        error: (err) => {
          console.error('Error loading product:', err);
          this.error.set('Error al cargar el producto. Por favor, intenta nuevamente.');
        }
      });
  }

  /**
   * Actualizar metadatos SEO
   */
  private updateSEO(product: Product): void {
    // Título de la página
    this.titleService.setTitle(product.metaTitle);
    
    // Meta description
    this.metaService.updateTag({
      name: 'description',
      content: product.metaDescription
    });
    
    // Keywords
    this.metaService.updateTag({
      name: 'keywords',
      content: product.keywords.join(', ')
    });
    
    // Open Graph tags
    this.metaService.updateTag({
      property: 'og:title',
      content: product.metaTitle
    });
    
    this.metaService.updateTag({
      property: 'og:description',
      content: product.metaDescription
    });
    
    this.metaService.updateTag({
      property: 'og:image',
      content: product.content.mainImage
    });
  }

  /**
   * Navegar hacia atrás
   */
  goBack(): void {
    this.router.navigate(['/products']);
  }
}
