import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContentAdminService, ContentType } from '../../../services/content-admin.service';
import type { Testimonio, Beneficio, FAQ, Banner } from '../../../../../core/models';

@Component({
  selector: 'app-content-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './content-form.component.html',
  styleUrl: './content-form.component.scss'
})
export class ContentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContentAdminService);

  // Tipo de contenido y modo
  contentType = signal<ContentType>('testimonios');
  isEditMode = signal(false);
  itemId = signal<number | null>(null);

  // Estado
  loading = signal(false);
  saving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Formulario
  form!: FormGroup;

  // Opciones
  iconosDisponibles: string[] = [];
  categoriasFaq: string[] = [];
  posicionesBanner: { value: string; label: string }[] = [];

  // Preview de imagen
  photoPreview = signal<string | null>(null);

  ngOnInit() {
    this.iconosDisponibles = this.contentService.getIconosDisponibles();
    this.categoriasFaq = this.contentService.getCategoriasFaq();
    this.posicionesBanner = this.contentService.getPosicionesBanner();

    // Determinar tipo de contenido y modo desde la ruta
    const url = this.router.url;
    if (url.includes('/testimonios/')) {
      this.contentType.set('testimonios');
    } else if (url.includes('/beneficios/')) {
      this.contentType.set('beneficios');
    } else if (url.includes('/faqs/')) {
      this.contentType.set('faqs');
    } else if (url.includes('/banners/')) {
      this.contentType.set('banners');
    }

    this.initForm();

    // Verificar si es modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.itemId.set(parseInt(id, 10));
      this.loadItem();
    }
  }

  private initForm() {
    const formConfigs: Record<ContentType, () => FormGroup> = {
      testimonios: () => this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        ubicacion: ['', [Validators.required]],
        texto: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
        fotoUrl: [''],
        calificacion: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
        activo: [true],
        orden: [1, [Validators.required, Validators.min(1)]]
      }),
      beneficios: () => this.fb.group({
        icono: ['bi-star', [Validators.required]],
        titulo: ['', [Validators.required, Validators.minLength(2)]],
        descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
        orden: [1, [Validators.required, Validators.min(1)]],
        activo: [true]
      }),
      faqs: () => this.fb.group({
        pregunta: ['', [Validators.required, Validators.minLength(10)]],
        respuesta: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1000)]],
        categoria: ['General'],
        orden: [1, [Validators.required, Validators.min(1)]],
        activo: [true]
      }),
      banners: () => this.fb.group({
        titulo: ['', [Validators.required, Validators.minLength(2)]],
        subtitulo: [''],
        imagenUrl: ['', [Validators.required]],
        imagenMovilUrl: [''],
        enlace: [''],
        textoBoton: [''],
        posicion: ['hero', [Validators.required]],
        orden: [1, [Validators.required, Validators.min(1)]],
        activo: [true],
        fechaInicio: [''],
        fechaFin: ['']
      })
    };

    this.form = formConfigs[this.contentType()]();
  }

  private loadItem() {
    this.loading.set(true);
    const id = this.itemId()!;

    const handleLoad = (item: Testimonio | Beneficio | FAQ | Banner | null) => {
      if (item) {
        this.form.patchValue(item);
        if (this.contentType() === 'testimonios' && (item as Testimonio).fotoUrl) {
          this.photoPreview.set((item as Testimonio).fotoUrl);
        }
        if (this.contentType() === 'banners' && (item as Banner).imagenUrl) {
          this.photoPreview.set((item as Banner).imagenUrl);
        }
      }
      this.loading.set(false);
    };

    const handleError = () => {
      this.errorMessage.set('Error al cargar el contenido');
      this.loading.set(false);
    };

    const loaders: Record<ContentType, () => void> = {
      testimonios: () => this.contentService.getTestimonioById(id).subscribe({ next: handleLoad, error: handleError }),
      beneficios: () => this.contentService.getBeneficioById(id).subscribe({ next: handleLoad, error: handleError }),
      faqs: () => this.contentService.getFaqById(id).subscribe({ next: handleLoad, error: handleError }),
      banners: () => this.contentService.getBannerById(id).subscribe({ next: handleLoad, error: handleError })
    };

    loaders[this.contentType()]();
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const data = this.form.value;

    const handleSuccess = () => {
      this.saving.set(false);
      this.successMessage.set(this.isEditMode() ? 'Actualizado correctamente' : 'Creado correctamente');
      setTimeout(() => {
        this.router.navigate(['/member-area/contenido']);
      }, 1000);
    };

    const handleError = (err: Error) => {
      this.saving.set(false);
      this.errorMessage.set('Error al guardar: ' + (err.message || 'Error desconocido'));
    };

    const updateActions: Record<ContentType, (id: number, data: any) => void> = {
      testimonios: (id, d) => this.contentService.updateTestimonio(id, d).subscribe({ next: handleSuccess, error: handleError }),
      beneficios: (id, d) => this.contentService.updateBeneficio(id, d).subscribe({ next: handleSuccess, error: handleError }),
      faqs: (id, d) => this.contentService.updateFaq(id, d).subscribe({ next: handleSuccess, error: handleError }),
      banners: (id, d) => this.contentService.updateBanner(id, d).subscribe({ next: handleSuccess, error: handleError })
    };

    const createActions: Record<ContentType, (data: any) => void> = {
      testimonios: (d) => this.contentService.createTestimonio(d).subscribe({ next: handleSuccess, error: handleError }),
      beneficios: (d) => this.contentService.createBeneficio(d).subscribe({ next: handleSuccess, error: handleError }),
      faqs: (d) => this.contentService.createFaq(d).subscribe({ next: handleSuccess, error: handleError }),
      banners: (d) => this.contentService.createBanner(d).subscribe({ next: handleSuccess, error: handleError })
    };

    if (this.isEditMode()) {
      updateActions[this.contentType()](this.itemId()!, data);
    } else {
      createActions[this.contentType()](data);
    }
  }

  onCancel() {
    this.router.navigate(['/member-area/contenido']);
  }

  onPhotoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview.set(reader.result as string);
        // En producción, aquí subiríamos el archivo y guardaríamos la URL
        this.form.patchValue({ fotoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onImageUrlChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.photoPreview.set(input.value);
    }
  }

  getTitle(): string {
    const action = this.isEditMode() ? 'Editar' : 'Nuevo';
    const titles: Record<ContentType, string> = {
      testimonios: 'Testimonio',
      beneficios: 'Beneficio',
      faqs: 'FAQ',
      banners: 'Banner'
    };
    return `${action} ${titles[this.contentType()]}`;
  }

  getIcon(): string {
    const icons: Record<ContentType, string> = {
      testimonios: 'bi-chat-quote',
      beneficios: 'bi-star',
      faqs: 'bi-question-circle',
      banners: 'bi-image'
    };
    return icons[this.contentType()];
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getCharCount(field: string): number {
    return this.form.get(field)?.value?.length || 0;
  }
}
