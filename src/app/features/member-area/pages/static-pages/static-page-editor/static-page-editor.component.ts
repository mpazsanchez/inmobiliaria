import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';
import { ContenidoEstaticoService } from '../../../../../core/services/contenido-estatico.service';
import { SanitizerService } from '../../../../../core/services/sanitizer.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { ContenidoEstatico, TipoPaginaEstatica } from '../../../../../core/models/static-content/contenido-estatico.interface';
import { PageHeaderComponent } from '../../../../../shared/components/admin/page-header/page-header.component';
import { QuillModule } from 'ngx-quill';
import { CanComponentDeactivate } from '../../../../../core/guards/can-deactivate.guard';
import { UnsavedChangesService } from '../../../../../core/services/unsaved-changes.service';

/**
 * Configuración de la barra de herramientas de Quill
 * Permite: encabezados, formato de texto, listas, links e imágenes
 */
const QUILL_MODULES = {
  toolbar: [
    [{ 'header': [2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    ['link'],
    [{ 'align': [] }],
    ['clean']
  ]
};

@Component({
  selector: 'app-static-page-editor',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    QuillModule
  ],
  templateUrl: './static-page-editor.component.html',
  styleUrl: './static-page-editor.component.scss'
})
export class StaticPageEditorComponent implements OnInit, CanComponentDeactivate {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContenidoEstaticoService);
  private sanitizerService = inject(SanitizerService);
  private unsavedChangesService = inject(UnsavedChangesService);
  private toastService = inject(ToastService);

  pageId = signal<TipoPaginaEstatica>('nosotros');
  loading = signal(true);
  saving = signal(false);
  seoExpanded = signal(false);

  form!: FormGroup;

  // Configuración del editor Quill WYSIWYG
  quillModules = QUILL_MODULES;

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
      metaDescripcion: ['', [Validators.maxLength(160)]],
      metaKeywords: ['', [Validators.maxLength(255)]],
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
          metaDescripcion: content.metaDescripcion || '',
          metaKeywords: content.metaKeywords || '',
          publicada: content.publicada ?? true
        });
        // Marcar como pristine después de cargar datos
        this.form.markAsPristine();
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
        // Marcar como pristine incluso con valores por defecto
        this.form.markAsPristine();
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      this.toastService.error('Por favor completa todos los campos requeridos');
      return;
    }

    this.saving.set(true);

    const data: Partial<ContenidoEstatico> = {
      pagina: this.pageId(),
      ...this.form.value
    };

    this.contentService.updateContent(this.pageId(), data).subscribe({
      next: () => {
        this.form.markAsPristine();
        this.saving.set(false);
        this.toastService.success('Contenido guardado correctamente');
        this.router.navigate(['/member/paginas-estaticas']);
      },
      error: (error) => {
        this.saving.set(false);
        this.toastService.error('Error al guardar: ' + (error.message || 'Error desconocido'));
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

  /**
   * Retorna el contenido HTML sanitizado para la vista previa
   * Previene XSS en el preview del editor
   */
  getPreviewContent(): SafeHtml {
    const html = this.form.get('contenidoHtml')?.value || '<p class="text-muted">Sin contenido</p>';
    return this.sanitizerService.sanitizeHtml(html);
  }

  // Guard para prevenir salir sin guardar
  canDeactivate(): boolean | Promise<boolean> {
    // Si el formulario no tiene cambios, permitir salir
    if (this.form.pristine) {
      return true;
    }

    // Mostrar confirmación si hay cambios sin guardar
    return this.unsavedChangesService.confirmLeave();
  }
}
