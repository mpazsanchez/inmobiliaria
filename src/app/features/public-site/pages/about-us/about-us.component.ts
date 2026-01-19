
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContenidoEstaticoService } from '../../../../core/services/contenido-estatico.service';
import { ContenidoEstatico } from '../../../../core/models/static-content/contenido-estatico.interface';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit {
  content: ContenidoEstatico | null = null;
  safeHtml: SafeHtml = '';
  loading = true;
  error: string | null = null;

  private readonly contenidoService = inject(ContenidoEstaticoService);
  private readonly sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.loadContent();
  }

  private loadContent(): void {
    this.loading = true;
    this.contenidoService.getPageContent('nosotros').subscribe({
      next: (content: ContenidoEstatico) => {
        this.content = content;
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(content.contenidoHtml);
        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error loading content:', err);
        this.error = 'Error al cargar el contenido';
        this.loading = false;
      }
    });
  }

  get experienceData() {
    // Mantener compatibilidad con el componente experience-section si existe
    return null;
  }
}
