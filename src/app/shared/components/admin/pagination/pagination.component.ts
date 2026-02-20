import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 0;
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() itemLabel = 'elementos';
  @Output() pageChange = new EventEmitter<number>();

  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get paginasArray(): number[] {
    const rango = 2;
    const paginas: number[] = [];
    for (let i = Math.max(1, this.currentPage - rango); i <= Math.min(this.totalPages, this.currentPage + rango); i++) {
      paginas.push(i);
    }
    return paginas;
  }

  onPageChange(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPages && pagina !== this.currentPage) {
      this.pageChange.emit(pagina);
    }
  }
}
