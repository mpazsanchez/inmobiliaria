import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsTechnologyComponent } from "../../components/products/products-technology/products-technology.component";
import { RouterModule } from '@angular/router';
import { ProductsPageService } from '../../services/products-page.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductsTechnologyComponent, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  public data: any;
  public loading: any;
  public error: any;

  constructor(private readonly productsPageService: ProductsPageService) {
    this.data = this.productsPageService.data;
    this.loading = this.productsPageService.loading;
    this.error = this.productsPageService.error;
  }

  ngOnInit(): void {
    if (this.data() === null && !this.loading()) {
      this.productsPageService.fetchData();
    }
  }
}
