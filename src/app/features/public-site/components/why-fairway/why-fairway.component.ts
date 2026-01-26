import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContenidoDinamicoService } from '../../../../core/services/contenido-dinamico.service';
import { Testimonio, Beneficio } from '../../../../core/models/testimonio.interface';

@Component({
  selector: 'app-why-fairway',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './why-fairway.component.html',
  styleUrl: './why-fairway.component.scss'
})
export class WhyFairwayComponent implements OnInit {
  private contenidoService = inject(ContenidoDinamicoService);

  beneficios: Beneficio[] = [];
  testimonios: Testimonio[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.cargarContenido();
  }

  private cargarContenido(): void {
    // Cargar beneficios y testimonios en paralelo
    this.contenidoService.getBeneficios().subscribe({
      next: (beneficios: Beneficio[]) => {
        this.beneficios = beneficios;
      }
    });

    this.contenidoService.getTestimoniosDestacados(3).subscribe({
      next: (testimonios: Testimonio[]) => {
        this.testimonios = testimonios;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
