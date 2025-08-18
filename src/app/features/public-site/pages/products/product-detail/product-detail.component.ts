
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductHeroComponent } from '../../../components/products/product-hero/product-hero.component';
import { ProductContentComponent } from '../../../components/products/product-content/product-content.component';
import { ProductFeaturesComponent } from '../../../components/products/product-features/product-features.component';
import { ProductDetailPageService } from '../../../services';

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
    ProductFeaturesComponent,
    RouterLink
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  public data: any;
  public loading: any;
  public error: any;

    private readonly route= inject(ActivatedRoute);
    private readonly router= inject(Router);
    private readonly productDetailPageService= inject(ProductDetailPageService); 

  constructor() {
    this.data = this.productDetailPageService.data;
    this.loading = this.productDetailPageService.loading;
    this.error = this.productDetailPageService.error;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || this.route.snapshot.paramMap.get('slug');
    if (this.data() === null && !this.loading() && id) {
      this.productDetailPageService.fetchData(id);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  getTypeSlug(typeName: string): string {
    return typeName.toLowerCase().replace(/\s+/g, '-');
  }
}
