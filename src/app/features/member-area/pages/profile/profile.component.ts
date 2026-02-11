import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { CanComponentDeactivate } from '../../../../core/guards/can-deactivate.guard';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import type { Usuario, PerfilAsesor, ActualizarUsuarioDto } from '../../../../core/models/user.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, CanComponentDeactivate {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private unsavedChangesService = inject(UnsavedChangesService);

  profileForm!: FormGroup;
  usuario = signal<Usuario | null>(null);
  esAsesor = computed(() => this.usuario()?.rol === 'asesor');
  perfilAsesor = computed(() => this.usuario()?.perfilAsesor);
  
  isLoading = signal(true);
  isSaving = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  photoPreview = signal<string | null>(null);
  selectedPhotoFile: File | null = null;

  // Para agregar nuevos items a arrays
  newIdioma = signal('');
  newCertificacion = signal('');
  newPremio = signal('');

  ngOnInit(): void {
    this.initForm();
    this.loadProfile();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      // Informacion personal (obligatoria para todos)
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],

      // Cargo (obligatorio solo para asesores, opcional para admin)
      cargo: [''],
      
      // Perfil profesional (opcional, solo para asesores)
      especialidad: [''],
      slogan: ['', Validators.maxLength(100)],
      biografia: ['', Validators.maxLength(1000)],
      experienciaAnios: [0, [Validators.min(0), Validators.max(50)]],

      // Redes sociales (opcional)
      whatsapp: [''],
      linkedin: [''],
      instagram: [''],
      facebook: [''],

      // Arrays (solo para asesores)
      idiomas: this.fb.array([]),
      certificaciones: this.fb.array([]),
      premios: this.fb.array([])
    });
  }

  private loadProfile(): void {
    this.profileService.getMyProfile().subscribe({
      next: (usuario) => {
        if (usuario) {
          this.usuario.set(usuario);
          this.populateForm(usuario);
        } else {
          this.error.set('No se encontró tu perfil. Por favor, inicia sesión nuevamente.');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar perfil:', err);
        this.error.set('Error al cargar el perfil: ' + err.message);
        this.isLoading.set(false);
      }
    });
  }

  private populateForm(usuario: Usuario): void {
    const perfil = usuario.perfilAsesor;
    const esAsesor = usuario.rol === 'asesor';
    
    // Datos básicos (todos los usuarios)
    this.profileForm.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono || ''
    });

    // Cargo: para admin mostrar su rol, para asesor su cargo profesional
    const cargoDefault = esAsesor ? 'Asesor Inmobiliario' : 'Administrador';
    this.profileForm.patchValue({
      cargo: perfil?.cargo || cargoDefault
    });
    
    // Campos de PerfilAsesor (solo para asesores)
    if (esAsesor && perfil) {
      this.profileForm.patchValue({
        especialidad: perfil.especialidad || '',
        slogan: perfil.slogan || '',
        biografia: perfil.biografia || '',
        experienciaAnios: perfil.experienciaAnios || 0,
        whatsapp: perfil.whatsapp || '',
        linkedin: perfil.linkedin || '',
        instagram: perfil.instagram || '',
        facebook: perfil.facebook || ''
      });

      // Limpiar y rellenar arrays
      this.clearFormArray(this.idiomas);
      this.clearFormArray(this.certificaciones);
      this.clearFormArray(this.premios);

      perfil.idiomas?.forEach(idioma => this.idiomas.push(this.fb.control(idioma)));
      perfil.certificaciones?.forEach(cert => this.certificaciones.push(this.fb.control(cert)));
      perfil.premios?.forEach(premio => this.premios.push(this.fb.control(premio)));
    } else {
      // Admin: limpiar arrays pero no llenarlos
      this.clearFormArray(this.idiomas);
      this.clearFormArray(this.certificaciones);
      this.clearFormArray(this.premios);
    }
  }

  private clearFormArray(formArray: FormArray): void {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  // Getters para FormArrays
  get idiomas(): FormArray {
    return this.profileForm.get('idiomas') as FormArray;
  }

  get certificaciones(): FormArray {
    return this.profileForm.get('certificaciones') as FormArray;
  }

  get premios(): FormArray {
    return this.profileForm.get('premios') as FormArray;
  }

  // Metodos para agregar items a arrays
  addIdioma(): void {
    const value = this.newIdioma().trim();
    if (value) {
      this.idiomas.push(this.fb.control(value));
      this.newIdioma.set('');
    }
  }

  removeIdioma(index: number): void {
    this.idiomas.removeAt(index);
  }

  addCertificacion(): void {
    const value = this.newCertificacion().trim();
    if (value) {
      this.certificaciones.push(this.fb.control(value));
      this.newCertificacion.set('');
    }
  }

  removeCertificacion(index: number): void {
    this.certificaciones.removeAt(index);
  }

  addPremio(): void {
    const value = this.newPremio().trim();
    if (value) {
      this.premios.push(this.fb.control(value));
      this.newPremio.set('');
    }
  }

  removePremio(index: number): void {
    this.premios.removeAt(index);
  }

  // Manejo de foto
  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.error.set('Por favor selecciona una imagen valida');
        return;
      }

      // Validar tamanio (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error.set('La imagen no debe superar los 5MB');
        return;
      }

      this.selectedPhotoFile = file;

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.photoPreview.set(null);
    this.selectedPhotoFile = null;
  }

  // Guardar perfil
  onSave(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.error.set('Por favor corrige los errores del formulario');
      return;
    }

    const usuario = this.authService.getUsuario();
    if (!usuario) {
      this.error.set('Sesion expirada');
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);
    this.successMessage.set(null);

    const formData = this.profileForm.value;

    // Preparar datos para guardar
    const updateData: ActualizarUsuarioDto = {
      nombre: formData.nombre!,
      apellido: formData.apellido!,
      email: formData.email!,
      telefono: formData.telefono || undefined
    };

    // Si es asesor, agregar perfilAsesor
    if (usuario.rol === 'asesor') {
      updateData.perfilAsesor = {
        cargo: formData.cargo || '',
        especialidad: formData.especialidad || '',
        slogan: formData.slogan || '',
        biografia: formData.biografia || '',
        experienciaAnios: formData.experienciaAnios || 0,
        whatsapp: formData.whatsapp || '',
        linkedin: formData.linkedin || '',
        instagram: formData.instagram || '',
        facebook: formData.facebook || '',
        idiomas: formData.idiomas?.filter((val: string) => val?.trim()) || [],
        certificaciones: formData.certificaciones?.filter((val: string) => val?.trim()) || [],
        premios: formData.premios?.filter((val: string) => val?.trim()) || []
      };
    }

    // Si hay foto nueva, primero subirla
    if (this.selectedPhotoFile) {
      this.profileService.uploadPhoto(this.selectedPhotoFile).subscribe({
        next: (result) => {
          updateData.fotoUrl = result.url;
          this.saveProfile(updateData);
        },
        error: (err) => {
          this.error.set('Error al subir la foto: ' + err.message);
          this.isSaving.set(false);
        }
      });
    } else {
      this.saveProfile(updateData);
    }
  }

  private saveProfile(data: ActualizarUsuarioDto): void {
    this.profileService.updateMyProfile(data).subscribe({
      next: (updatedUsuario) => {
        this.usuario.set(updatedUsuario);
        this.successMessage.set('Perfil actualizado correctamente');
        this.isSaving.set(false);
        this.selectedPhotoFile = null;
        
        // Marcar formulario como pristine para que el guard permita salir
        this.profileForm.markAsPristine();

        // Limpiar mensaje de exito despues de 3 segundos
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        this.error.set('Error al guardar: ' + err.message);
        this.isSaving.set(false);
      }
    });
  }

  // Helper para mostrar errores de campos
  getFieldError(fieldName: string): string | null {
    const field = this.profileForm.get(fieldName);
    if (field?.touched && field?.invalid) {
      if (field.errors?.['required']) return 'Este campo es requerido';
      if (field.errors?.['email']) return 'Email invalido';
      if (field.errors?.['minlength']) return `Minimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors?.['maxlength']) return `Maximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors?.['min']) return `Valor minimo: ${field.errors['min'].min}`;
      if (field.errors?.['max']) return `Valor maximo: ${field.errors['max'].max}`;
    }
    return null;
  }

  // Obtener nombre completo para mostrar
  getNombreCompleto(): string {
    const usuario = this.usuario();
    if (!usuario) return '';
    return `${usuario.nombre} ${usuario.apellido}`;
  }

  // Obtener URL de foto actual
  getCurrentPhotoUrl(): string {
    const preview = this.photoPreview();
    if (preview) return preview;

    const usuario = this.usuario();
    return usuario?.fotoUrl || 'assets/images/agents/default-avatar.svg';
  }

  // Implementación del guard CanComponentDeactivate
  canDeactivate(): boolean | Promise<boolean> {
    if (this.isSaving()) {
      return false; // No permitir salir mientras se está guardando
    }
    
    if (this.profileForm.pristine) {
      return true; // Permitir salir si no hay cambios
    }
    
    // Mostrar modal de confirmación si hay cambios sin guardar
    return this.unsavedChangesService.confirmLeave();
  }
}
