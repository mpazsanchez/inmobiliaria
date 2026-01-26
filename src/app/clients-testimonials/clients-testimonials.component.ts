import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenidoDinamicoService } from '../core/services/contenido-dinamico.service';
import { Testimonio } from '../core/models/testimonio.interface';

@Component({
  selector: 'app-clients-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients-testimonials.component.html',
  styleUrl: './clients-testimonials.component.scss'
})
export class ClientsTestimonialsComponent implements OnInit {
  private contenidoService = inject(ContenidoDinamicoService);
  
  testimonials = signal<Testimonio[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadTestimonios();
  }

  private loadTestimonios(): void {
    this.contenidoService.getTestimonios({ activo: true }).subscribe({
      next: (testimonios: Testimonio[]) => {
        this.testimonials.set(testimonios);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error cargando testimonios:', error);
        this.isLoading.set(false);
      }
    });
  }
}
