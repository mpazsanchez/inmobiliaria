import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolutionsPageService } from '../../services/solutions-page.service';
import { ProductType } from '../../models/product.interface';

@Component({
  selector: 'app-solutions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solutions.component.html',
  styleUrl: './solutions.component.scss'
})
export class SolutionsComponent implements OnInit {
  products: ProductType[] = [];
  private readonly solutionsService = inject(SolutionsPageService);

  ngOnInit(): void {
    this.products = this.solutionsService.products();
  }
}
