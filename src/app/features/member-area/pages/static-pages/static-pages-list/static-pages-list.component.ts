import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContenidoEstaticoService } from '../../../../../core/services/contenido-estatico.service';
import { ContenidoEstatico, TipoPaginaEstatica } from '../../../../../core/models/static-content/contenido-estatico.interface';
import { PageHeaderComponent } from '../../../../../shared/components/admin/page-header/page-header.component';

interface StaticPageCard {
  id: TipoPaginaEstatica;
  titulo: string;
  descripcion: string;
  icono: string;
  ultimaActualizacion?: string;
  publicada?: boolean;
}

@Component({
  selector: 'app-static-pages-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent],
  templateUrl: './static-pages-list.component.html',
  styleUrl: './static-pages-list.component.scss'
})
export class StaticPagesListComponent implements OnInit {
  private contentService = inject(ContenidoEstaticoService);

  loading = signal(true);
  errorMessage = signal<string | null>(null);
  pages = signal<StaticPageCard[]>([
    {
      id: 'nosotros',
      titulo: 'Quiénes Somos',
      descripcion: 'Historia, misión, visión y valores de Fairway Inmobiliaria',
      icono: 'bi-building',
      publicada: true
    },
    {
      id: 'contacto',
      titulo: 'Contacto',
      descripcion: 'Información de contacto, dirección y formulario',
      icono: 'bi-envelope',
      publicada: true
    },
    {
      id: 'servicios',
      titulo: 'Servicios',
      descripcion: 'Servicios que ofrece la inmobiliaria',
      icono: 'bi-briefcase',
      publicada: true
    },
    {
      id: 'faqs',
      titulo: 'Preguntas Frecuentes',
      descripcion: 'Preguntas y respuestas comunes',
      icono: 'bi-question-circle',
      publicada: true
    },
    {
      id: 'terminos',
      titulo: 'Términos y Condiciones',
      descripcion: 'Términos legales de uso del sitio',
      icono: 'bi-file-text',
      publicada: true
    },
    {
      id: 'privacidad',
      titulo: 'Política de Privacidad',
      descripcion: 'Política de privacidad y protección de datos',
      icono: 'bi-shield-check',
      publicada: true
    }
  ]);

  ngOnInit(): void {
    this.loadPagesStatus();
  }

  private loadPagesStatus(): void {
    this.loading.set(true);
    
    // Cargar el estado real de cada página
    this.contentService.getAllContent().subscribe({
      next: (contenidos: ContenidoEstatico[]) => {
        const updatedPages = this.pages().map(page => {
          const contenido = contenidos.find(c => c.pagina === page.id);
          return {
            ...page,
            ultimaActualizacion: contenido?.ultimaActualizacion,
            publicada: contenido?.publicada ?? true
          };
        });
        this.pages.set(updatedPages);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando páginas:', error);
        // No mostrar error, usar datos por defecto
        this.loading.set(false);
      }
    });
  }

  getPublishedCount(): number {
    return this.pages().filter(p => p.publicada).length;
  }

  getPublicUrl(pageId: TipoPaginaEstatica): string {
    const urlMap: Record<TipoPaginaEstatica, string> = {
      nosotros: '/about',
      contacto: '/contact',
      servicios: '/servicios', // No creado aún
      faqs: '/contact',
      terminos: '/terminos', // No creado aún
      privacidad: '/privacidad' // No creado aún
    };
    return urlMap[pageId] || '/';
  }

  getFragment(pageId: TipoPaginaEstatica): string | undefined {
    const fragmentMap: Record<TipoPaginaEstatica, string | undefined> = {
      nosotros: undefined,
      contacto: undefined,
      servicios: undefined,
      faqs: 'preguntas-frecuentes',
      terminos: undefined,
      privacidad: undefined
    };
    return fragmentMap[pageId];
  }
}
