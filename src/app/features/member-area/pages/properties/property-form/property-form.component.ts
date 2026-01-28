import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertiesAdminService } from '../../../services/properties-admin.service';
import { AuthService } from '../../../services/auth.service';
import { GeocodingService } from '../../../../../core/services';
import { ImageUploadService, ImageUploadResult } from '../../../../../core/services/image-upload.service';
import { Propiedad, Imagen } from '../../../../../core/models/property.interface';
import { PropertyMapComponent } from '../../../../public-site/components/property-map/property-map.component';
import { ImageUploaderComponent } from '../../../../../shared/components/image-uploader/image-uploader.component';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PropertyMapComponent, ImageUploaderComponent],
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss']
})
export class PropertyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private propertiesService = inject(PropertiesAdminService);
  private authService = inject(AuthService);
  private geocodingService = inject(GeocodingService);
  private imageUploadService = inject(ImageUploadService);

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
      asesorId: 0,
      fechaPublicacion: new Date().toISOString(),
      ultimaActualizacion: new Date().toISOString()
    }];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.propertyId.set(+id);
      this.loadProperty(+id);
    }
  }

  loadProperty(id: number): void {
    this.isLoading.set(true);
    this.propertiesService.getPropertyById(id).subscribe({
      next: (property) => {
        if (property) {
          this.patchForm(property);
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
      ubicacion: property.ubicacion,
      caracteristicas: {
        ...property.caracteristicas,
        amenidades: property.caracteristicas.amenidades || []
      }
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

  // Tabs
  setTab(tab: 'basic' | 'location' | 'features' | 'images'): void {
    this.activeTab.set(tab);
  }

  isTabValid(tab: string): boolean {
    switch (tab) {
      case 'basic':
        return !!(this.form.get('titulo')?.valid &&
               this.form.get('descripcion')?.valid &&
               this.form.get('precio')?.valid);
      case 'location':
        return !!this.form.get('ubicacion')?.valid;
      case 'features':
        return !!this.form.get('caracteristicas')?.valid;
      case 'images':
        return this.imagenesArray.length > 0;
      default:
        return true;
    }
  }

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

  // Método para agregar imagen manualmente por URL (mantener compatibilidad)
  addImageByUrl(): void {
    this.imagenesArray.push(this.fb.group({
      url: ['', Validators.required],
      descripcion: ['']
    }));
  }

  // Obtener versiones optimizadas de una imagen
  getImageVersions(url: string) {
    return this.imageUploadService.getImageVersions(url);
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
    data.asesorId = this.currentUser()?.id || 1;

    const request = this.isEditMode()
      ? this.propertiesService.updateProperty(this.propertyId()!, data)
      : this.propertiesService.createProperty(data);

    request.subscribe({
      next: () => {
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
}
