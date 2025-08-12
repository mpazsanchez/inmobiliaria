import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsTechnologyComponent } from "../../components/products/products-technology/products-technology.component";
import { ProductsPageService } from '../../services/products-page.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductsTechnologyComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  public data: any;
  public loading: any;
  public error: any;

  constructor(private productsPageService: ProductsPageService) {
    this.data = this.productsPageService.data;
    this.loading = this.productsPageService.loading;
    this.error = this.productsPageService.error;
    effect(() => {
      if (this.data() === null && !this.loading()) {
        this.productsPageService.fetchData();
      }
    });
  }
}
