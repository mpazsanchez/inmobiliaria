import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContenidoEstaticoService } from '../../../../core/services/contenido-estatico.service';
import { FAQ } from '../../../../core/models/testimonio.interface';

@Component({
  selector: 'app-fairway-faq-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './fairway-faq-section.component.html',
  styleUrl: './fairway-faq-section.component.scss'
})
export class FairwayFaqSectionComponent implements OnInit {
  private contenidoService = inject(ContenidoEstaticoService);

  // Estado
  faqs = signal<FAQ[]>([]);
  isLoading = signal(true);
  openFaqId = signal<number | null>(null);

  // Categorías disponibles
  categorias = signal<string[]>([]);
  categoriaActiva = signal<string>('todas');

  ngOnInit(): void {
    this.loadFaqs();
  }

  private loadFaqs(): void {
    this.contenidoService.getFaqs().subscribe({
      next: (faqs) => {
        this.faqs.set(faqs);

        // Extraer categorías únicas
        const cats = [...new Set(faqs.map(f => f.categoria).filter(Boolean))] as string[];
        this.categorias.set(cats);

        // Abrir primera pregunta por defecto
        if (faqs.length > 0) {
          this.openFaqId.set(faqs[0].id);
        }

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando FAQs:', error);
        this.isLoading.set(false);
      }
    });
  }

  toggleFaq(id: number): void {
    if (this.openFaqId() === id) {
      this.openFaqId.set(null);
    } else {
      this.openFaqId.set(id);
    }
  }

  isFaqOpen(id: number): boolean {
    return this.openFaqId() === id;
  }

  filtrarPorCategoria(categoria: string): void {
    this.categoriaActiva.set(categoria);
  }

  get faqsFiltradas(): FAQ[] {
    const categoria = this.categoriaActiva();
    if (categoria === 'todas') {
      return this.faqs();
    }
    return this.faqs().filter(f => f.categoria === categoria);
  }

  trackByFaqId(index: number, faq: FAQ): number {
    return faq.id;
  }
}
