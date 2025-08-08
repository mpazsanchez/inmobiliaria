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
        @if (product()!.features && product()!.features.length > 0) {
          <app-product-features 
            [features]="product()!.features"
            [title]="'¿Por qué elegir ' + product()!.name + '?'"
            [subtitle]="'Características que marcan la diferencia'" />
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
