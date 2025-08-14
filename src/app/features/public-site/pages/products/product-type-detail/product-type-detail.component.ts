import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailPageService } from '../../../services/product-detail-page.service';

@Component({
  selector: 'app-product-type-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-type-detail.component.html',
  styleUrl: './product-type-detail.component.scss'
})
export class ProductTypeDetailComponent implements OnInit {
  public type: any = null;
  public loading = false;
  public error: string | null = null;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productDetailPageService = inject(ProductDetailPageService);

  ngOnInit(): void {
    this.loading = true;
    let slug = this.route.snapshot.paramMap.get('slug') || '';
    slug = decodeURIComponent(slug);
    // Normalizar para quitar acentos y caracteres especiales
    slug = slug.normalize('NFD').replace(/[̀-ͯ]/g, '');
    // Buscar el tipo en todos los productos mock
    const allProducts = this.getAllMockProducts();
    let foundType = null;
    for (const prodKey in allProducts) {
      const product = allProducts[prodKey].product;
      if (product.types) {
        foundType = product.types.find((t: any) => this.slugify(t.name) === slug);
        if (foundType) break;
      }
    }
    if (foundType) {
      this.type = foundType;
      this.loading = false;
    } else {
      this.error = 'No se encontró el tipo de producto.';
      this.loading = false;
    }
  }

  slugify(name: string): string {
    // Normaliza y quita acentos igual que el slug de la URL
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-');
  }

  getAllMockProducts(): any {
    // Acceso directo al mock del servicio
    // @ts-ignore
    return (this.productDetailPageService as any).constructor.mockDetails;
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
