import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContenidoEstaticoService } from '../../../../../core/services/contenido-estatico.service';
import { ContenidoEstatico, TipoPaginaEstatica } from '../../../../../core/models/static-content/contenido-estatico.interface';
import { PageHeaderComponent } from '../../../../../shared/components/admin/page-header/page-header.component';

// Importar editor WYSIWYG si lo tienes, sino usar textarea simple
// import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-static-page-editor',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PageHeaderComponent
  ],
  templateUrl: './static-page-editor.component.html',
  styleUrl: './static-page-editor.component.scss'
})
export class StaticPageEditorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContenidoEstaticoService);

  pageId = signal<TipoPaginaEstatica>('nosotros');
  loading = signal(true);
  saving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  form!: FormGroup;

  private pageTitles: Record<TipoPaginaEstatica, string> = {
    nosotros: 'Quiénes Somos',
    contacto: 'Contacto',
    servicios: 'Servicios',
    faqs: 'Preguntas Frecuentes',
    terminos: 'Términos y Condiciones',
    privacidad: 'Política de Privacidad'
  };

  ngOnInit(): void {
    // Obtener el ID de la página desde la ruta
    const id = this.route.snapshot.paramMap.get('id') as TipoPaginaEstatica;
    if (id) {
      this.pageId.set(id);
    }

    this.initForm();
    this.loadContent();
  }

  private initForm(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      contenidoHtml: ['', [Validators.required]],
      publicada: [true]
    });
  }

  private loadContent(): void {
    this.loading.set(true);
    
    this.contentService.getPageContent(this.pageId()).subscribe({
      next: (content: ContenidoEstatico) => {
        this.form.patchValue({
          titulo: content.titulo,
          contenidoHtml: content.contenidoHtml,
          publicada: content.publicada ?? true
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando contenido:', error);
        // Usar valores por defecto
        this.form.patchValue({
          titulo: this.pageTitles[this.pageId()],
          contenidoHtml: '<p>Agrega aquí el contenido de la página.</p>',
          publicada: true
        });
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const data: Partial<ContenidoEstatico> = {
      pagina: this.pageId(),
      ...this.form.value
    };

    this.contentService.updateContent(this.pageId(), data).subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set('Contenido guardado correctamente');
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/member-area/paginas-estaticas']);
        }, 2000);
      },
      error: (error) => {
        this.saving.set(false);
        this.errorMessage.set('Error al guardar: ' + (error.message || 'Error desconocido'));
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/member-area/paginas-estaticas']);
  }

  getTitle(): string {
    return `Editar: ${this.pageTitles[this.pageId()]}`;
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getPreviewContent(): string {
    return this.form.get('contenidoHtml')?.value || '<p class="text-muted">Sin contenido</p>';
  }
}
