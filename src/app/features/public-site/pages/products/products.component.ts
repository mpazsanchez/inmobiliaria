import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsTechnologyComponent } from "../../components/products/products-technology/products-technology.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductsTechnologyComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

}
