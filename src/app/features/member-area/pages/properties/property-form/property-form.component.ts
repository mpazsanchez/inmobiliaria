import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertiesAdminService } from '../../../services/properties-admin.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../../../core/services/user.service';
import { GeocodingService } from '../../../../../core/services';
import { ImageUploadService, ImageUploadResult } from '../../../../../core/services/image-upload.service';
import { Propiedad, Imagen } from '../../../../../core/models/property.interface';
import { Usuario } from '../../../../../core/models/user.interface';
import { PropertyMapComponent } from '../../../../public-site/components/property-map/property-map.component';
import { ImageUploaderComponent } from '../../../../../shared/components/image-uploader/image-uploader.component';
import { CanComponentDeactivate } from '../../../../../core/guards/can-deactivate.guard';
import { UnsavedChangesService } from '../../../../../core/services/unsaved-changes.service';
import {
  FormHeaderComponent,
  FormTabsComponent,
  FormAlertComponent,
  LoadingStateComponent,
  ConfirmModalComponent,
  type TabConfig
} from '../../../../../shared/components/admin';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PropertyMapComponent,
    ImageUploaderComponent,
    FormHeaderComponent,
    FormTabsComponent,
    FormAlertComponent,
    LoadingStateComponent,
    ConfirmModalComponent
  ],
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss']
})
export class PropertyFormComponent implements OnInit, CanComponentDeactivate {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private propertiesService = inject(PropertiesAdminService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private geocodingService = inject(GeocodingService);
  private imageUploadService = inject(ImageUploadService);
  private unsavedChangesService = inject(UnsavedChangesService);

  // Exponer Math para el template
  Math = Math;

  // Estado
  isEditMode = signal(false);
  propertyId = signal<number | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);
  activeTab = signal<'basic' | 'location' | 'features' | 'images'>('basic');
  isGeocoding = signal(false);
  geocodingSuccess = signal(false);
  asesoresDisponibles = signal<Usuario[]>([]);

  // Estado del modal de eliminar imagen
  showDeleteModal = signal(false);
  imageToDeleteIndex = signal<number | null>(null);

  // Opciones
  tiposPropiedad = this.propertiesService.getTiposPropiedad();
  operaciones = this.propertiesService.getOperaciones();
  estados = this.propertiesService.getEstados();
  amenidadesDisponibles = this.propertiesService.getAmenidades();

  // Usuario
  currentUser = computed(() => this.authService.getUsuario());

  // Formulario
  form: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(10)]],
    descripcion: ['', [Validators.required, Validators.minLength(50)]],
    tipoPropiedad: ['departamento', Validators.required],
    operacion: ['venta', Validators.required],
    precio: [0, [Validators.required, Validators.min(1)]],
    moneda: ['USD', Validators.required],
    estado: ['disponible'],
    destacada: [false],
    visible: [true], // Por defecto visible
    asesorId: [null, Validators.required],
    
    // Campos de solo lectura (no se envían al backend)
    fechaPublicacion: [{ value: '', disabled: true }],
    ultimaActualizacion: [{ value: '', disabled: true }],

    // Ubicacion
    ubicacion: this.fb.group({
      direccion: ['', Validators.required],
      barrio: [''],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      pais: ['Argentina'],
      coordenadas: this.fb.group({
        lat: [-34.6037],
        lng: [-58.3816]
      })
    }),

    // Caracteristicas
    caracteristicas: this.fb.group({
      ambientes: [1, [Validators.required, Validators.min(0)]],
      dormitorios: [0, [Validators.min(0)]],
      banos: [1, [Validators.required, Validators.min(0)]],
      superficie_cubierta: [0, [Validators.required, Validators.min(1)]],
      superficie_total: [0, [Validators.required, Validators.min(1)]],
      antiguedad: [0, [Validators.min(0)]],
      garage: [0, [Validators.min(0)]],
      amenidades: [[]]
    }),

    // Imagenes
    imagenes: this.fb.array([])
  });

  // Getters
  get imagenesArray(): FormArray {
    return this.form.get('imagenes') as FormArray;
  }

  get amenidadesSeleccionadas(): string[] {
    return this.form.get('caracteristicas.amenidades')?.value || [];
  }

  // Propiedad para vista previa del mapa
  get propiedadParaMapa(): Propiedad[] {
    const coords = this.form.get('ubicacion.coordenadas')?.value;
    
    // Si no hay coordenadas válidas, retornar array vacío
    if (!coords || coords.lat === 0 || coords.lng === 0) {
      return [];
    }

    // Crear objeto de propiedad parcial para el mapa
    return [{
      id: this.propertyId() || 0,
      titulo: this.form.get('titulo')?.value || 'Vista previa de ubicación',
      descripcion: '',
      tipoPropiedad: this.form.get('tipoPropiedad')?.value || '',
      operacion: this.form.get('operacion')?.value || 'venta',
      precio: this.form.get('precio')?.value || 0,
      moneda: this.form.get('moneda')?.value || 'USD',
      ubicacion: {
        direccion: this.form.get('ubicacion.direccion')?.value || '',
        barrio: this.form.get('ubicacion.barrio')?.value,
        ciudad: this.form.get('ubicacion.ciudad')?.value || '',
        provincia: this.form.get('ubicacion.provincia')?.value || '',
        pais: this.form.get('ubicacion.pais')?.value || '',
        coordenadas: coords
      },
      caracteristicas: {
        ambientes: 0,
        dormitorios: 0,
        banos: 0,
        superficie_cubierta: 0,
        superficie_total: 0,
        antiguedad: 0,
        garage: 0,
        amenidades: []
      },
      imagenes: [],
      estado: 'disponible',
      destacada: false,
      visible: true,
      asesorId: 0,
      fechaPublicacion: new Date().toISOString(),
      ultimaActualizacion: new Date().toISOString()
    }];
  }

  ngOnInit(): void {
    // Cargar lista de asesores disponibles
    this.loadAsesores();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.propertyId.set(+id);
      this.loadProperty(+id);
    } else {
      // En modo creación, asignar asesor por defecto
      this.setDefaultAsesor();
    }
  }

  loadAsesores(): void {
    this.userService.getUsuarios({ rol: 'asesor', activo: true }).subscribe({
      next: (response) => {
        const asesores = response.items || response.datos || [];
        this.asesoresDisponibles.set(asesores);
      },
      error: (err) => {
        console.error('Error cargando asesores:', err);
        this.asesoresDisponibles.set([]);
      }
    });
  }

  setDefaultAsesor(): void {
    const currentUser = this.currentUser();
    if (currentUser) {
      // Si es asesor, asignarse a sí mismo
      if (currentUser.rol === 'asesor') {
        this.form.patchValue({ asesorId: currentUser.id });
      }
      // Si es admin, dejar el campo vacío para que seleccione
    }
  }

  loadProperty(id: number): void {
    this.isLoading.set(true);
    this.propertiesService.getPropertyById(id).subscribe({
      next: (property) => {
        if (property) {
          this.patchForm(property);
          // Marcar como pristine después de cargar datos
          this.form.markAsPristine();
        } else {
          this.error.set('Propiedad no encontrada');
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar la propiedad');
        this.isLoading.set(false);
      }
    });
  }

  patchForm(property: Propiedad): void {
    this.form.patchValue({
      titulo: property.titulo,
      descripcion: property.descripcion,
      tipoPropiedad: property.tipoPropiedad,
      operacion: property.operacion,
      precio: property.precio,
      moneda: property.moneda,
      estado: property.estado,
      destacada: property.destacada,
      visible: property.visible ?? true,
      asesorId: property.asesorId,
      ubicacion: property.ubicacion,
      caracteristicas: {
        ...property.caracteristicas,
        amenidades: property.caracteristicas.amenidades || []
      }
    });

    // Cargar fechas (campos disabled - solo lectura)
    this.form.patchValue({
      fechaPublicacion: property.fechaPublicacion,
      ultimaActualizacion: property.ultimaActualizacion
    });

    // Cargar imagenes
    this.imagenesArray.clear();
    property.imagenes?.forEach(img => {
      this.imagenesArray.push(this.fb.group({
        url: [img.url, Validators.required],
        descripcion: [img.descripcion || '']
      }));
    });
  }

  // Método para cambiar de tab (usado desde el template)
  onTabChange(tabId: string): void {
    const validTabs = ['basic', 'location', 'features', 'images'];
    if (validTabs.includes(tabId)) {
      this.activeTab.set(tabId as 'basic' | 'location' | 'features' | 'images');
    }
  }

  // Métodos de validación estables (no recreados en cada render)
  isBasicValid = (): boolean => {
    const form = this.form;
    return !!(form.get('titulo')?.valid && form.get('descripcion')?.valid && form.get('precio')?.valid);
  };

  isLocationValid = (): boolean => {
    return !!this.form.get('ubicacion')?.valid;
  };

  isFeaturesValid = (): boolean => {
    return !!this.form.get('caracteristicas')?.valid;
  };

  isImagesValid = (): boolean => {
    return this.imagenesArray.length > 0;
  };

  // Configuración de tabs - array estático con referencias estables a las funciones
  readonly tabsConfig: TabConfig[] = [
    {
      id: 'basic',
      label: 'Información Básica',
      icon: 'info-circle',
      isValid: this.isBasicValid
    },
    {
      id: 'location',
      label: 'Ubicación',
      icon: 'geo-alt',
      isValid: this.isLocationValid
    },
    {
      id: 'features',
      label: 'Características',
      icon: 'list-check',
      isValid: this.isFeaturesValid
    },
    {
      id: 'images',
      label: 'Imágenes',
      icon: 'images',
      isValid: this.isImagesValid
    }
  ];

  // Amenidades
  toggleAmenidad(amenidad: string): void {
    const current = this.amenidadesSeleccionadas;
    const updated = current.includes(amenidad)
      ? current.filter(a => a !== amenidad)
      : [...current, amenidad];
    this.form.get('caracteristicas.amenidades')?.setValue(updated);
  }

  isAmenidadSelected(amenidad: string): boolean {
    return this.amenidadesSeleccionadas.includes(amenidad);
  }

  getAmenidadLabel(amenidad: string): string {
    const labels: Record<string, string> = {
      'balcon': 'Balcón',
      'terraza': 'Terraza',
      'jardin': 'Jardín',
      'patio': 'Patio',
      'pileta': 'Pileta',
      'gym': 'Gimnasio',
      'sum': 'SUM',
      'parrilla': 'Parrilla',
      'cochera': 'Cochera',
      'lavadero': 'Lavadero',
      'baulera': 'Baulera',
      'seguridad-24hs': 'Seguridad 24hs',
      'aire-acondicionado': 'Aire Acond.',
      'calefaccion': 'Calefacción',
      'laundry': 'Laundry',
      'solarium': 'Solarium',
      'spa': 'Spa',
      'recepcion': 'Recepción'
    };
    return labels[amenidad] || amenidad;
  }

  // Imagenes
  addImage(): void {
    this.imagenesArray.push(this.fb.group({
      url: ['', Validators.required],
      descripcion: ['']
    }));
  }

  removeImage(index: number): void {
    this.imagenesArray.removeAt(index);
  }

  // Marcar imagen como principal (moverla a la primera posición)
  setAsPrincipal(index: number): void {
    if (index <= 0 || index >= this.imagenesArray.length) return;

    const imageToMove = this.imagenesArray.at(index);
    const imageData = {
      url: imageToMove.get('url')?.value,
      descripcion: imageToMove.get('descripcion')?.value
    };

    // Remover de la posición actual
    this.imagenesArray.removeAt(index);

    // Insertar en la primera posición
    this.imagenesArray.insert(0, this.fb.group({
      url: [imageData.url, Validators.required],
      descripcion: [imageData.descripcion || '']
    }));
  }

  // Manejo de uploads desde el componente ImageUploader
  onImageUploaded(result: ImageUploadResult): void {
    // Agregar la imagen cargada al formulario
    this.imagenesArray.push(this.fb.group({
      url: [result.url, Validators.required],
      descripcion: ['']
    }));
  }

  onImageUploadError(error: string): void {
    console.error('Error al subir imagen:', error);
    this.error.set(error);
    // Limpiar error después de 5 segundos
    setTimeout(() => {
      if (this.error() === error) {
        this.error.set(null);
      }
    }, 5000);
  }

  // Abrir modal de confirmación para eliminar imagen
  openDeleteModal(index: number): void {
    this.imageToDeleteIndex.set(index);
    this.showDeleteModal.set(true);
  }

  // Confirmar eliminación de imagen
  confirmDeleteImage(): void {
    const index = this.imageToDeleteIndex();
    if (index !== null) {
      this.removeImage(index);
    }
    this.closeDeleteModal();
  }

  // Cancelar eliminación de imagen
  cancelDeleteImage(): void {
    this.closeDeleteModal();
  }

  // Cerrar modal
  private closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.imageToDeleteIndex.set(null);
  }

  // Obtener versiones optimizadas de una imagen
  getImageVersions(url: string) {
    return this.imageUploadService.getImageVersions(url);
  }

  // Manejo de error cuando una imagen no carga
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Mostrar placeholder cuando la imagen no carga
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"%3E%3Crect fill="%23f3f4f6" width="150" height="150"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="12" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
  }

  // Geocoding
  geocodificarDireccion(): void {
    const ubicacion = this.form.get('ubicacion')?.value;
    
    if (!ubicacion.direccion || !ubicacion.ciudad) {
      this.error.set('Ingresa dirección y ciudad para geocodificar');
      return;
    }

    this.isGeocoding.set(true);
    this.geocodingSuccess.set(false);
    this.error.set(null);

    // Construir dirección completa
    const direccionCompleta = `${ubicacion.direccion}, ${ubicacion.ciudad}, ${ubicacion.provincia || ''}, ${ubicacion.pais}`.trim();

    this.geocodingService.geocodificar(direccionCompleta).subscribe({
      next: (resultado) => {
        this.isGeocoding.set(false);
        
        if (resultado && resultado.coordenadas) {
          // Actualizar coordenadas en el formulario
          this.form.get('ubicacion.coordenadas')?.patchValue({
            lat: resultado.coordenadas.lat,
            lng: resultado.coordenadas.lng
          });

          // Opcional: Actualizar campos de ubicación con la info geocodificada
          if (resultado.ciudad && !ubicacion.ciudad) {
            this.form.get('ubicacion.ciudad')?.setValue(resultado.ciudad);
          }
          if (resultado.departamento && !ubicacion.provincia) {
            this.form.get('ubicacion.provincia')?.setValue(resultado.departamento);
          }

          this.geocodingSuccess.set(true);
          setTimeout(() => this.geocodingSuccess.set(false), 3000);
        } else {
          this.error.set('No se pudo geocodificar la dirección. Verifica que sea correcta.');
        }
      },
      error: (err) => {
        this.isGeocoding.set(false);
        this.error.set('Error al geocodificar la dirección');
        console.error('Error geocoding:', err);
      }
    });
  }

  // Submit
  onSubmit(): void {
    if (this.form.invalid) {
      this.markAllAsTouched();
      this.error.set('Por favor completa todos los campos requeridos');
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    const data = this.form.value;

    const request = this.isEditMode()
      ? this.propertiesService.updateProperty(this.propertyId()!, data)
      : this.propertiesService.createProperty(data);

    request.subscribe({
      next: () => {
        this.form.markAsPristine(); // Marcar como sin cambios después de guardar
        this.router.navigate(['/member-area/propiedades']);
      },
      error: (err) => {
        this.error.set('Error al guardar la propiedad');
        this.isSaving.set(false);
      }
    });
  }

  markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(k => {
          control.get(k)?.markAsTouched();
        });
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/member-area/propiedades']);
  }

  // Helpers
  getTipoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      'departamento': 'Departamento',
      'casa': 'Casa',
      'ph': 'PH',
      'oficina': 'Oficina',
      'local': 'Local',
      'terreno': 'Terreno'
    };
    return labels[tipo] || tipo;
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
