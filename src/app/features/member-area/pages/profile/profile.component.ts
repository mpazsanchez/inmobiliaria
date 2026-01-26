import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import type { Agente } from '../../../../core/models/agent.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);

  profileForm!: FormGroup;
  agente = signal<Agente | null>(null);
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
      // Informacion personal
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      cargo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],

      // Perfil profesional
      especialidad: [''],
      slogan: ['', Validators.maxLength(100)],
      biografia: ['', Validators.maxLength(1000)],
      experienciaAnios: [0, [Validators.min(0), Validators.max(50)]],

      // Redes sociales
      whatsapp: [''],
      linkedin: [''],
      instagram: [''],
      facebook: [''],

      // Arrays
      idiomas: this.fb.array([]),
      certificaciones: this.fb.array([]),
      premios: this.fb.array([])
    });
  }

  private loadProfile(): void {
    const usuario = this.authService.getUsuario();

    if (!usuario) {
      this.error.set('Debes iniciar sesion para ver tu perfil');
      this.isLoading.set(false);
      return;
    }

    this.profileService.getMyProfile(usuario.id).subscribe({
      next: (agente) => {
        if (agente) {
          this.agente.set(agente);
          this.populateForm(agente);
        } else {
          this.error.set('No se encontro tu perfil de asesor');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar el perfil: ' + err.message);
        this.isLoading.set(false);
      }
    });
  }

  private populateForm(agente: Agente): void {
    this.profileForm.patchValue({
      nombre: agente.nombre,
      apellido: agente.apellido,
      cargo: agente.cargo,
      email: agente.email,
      telefono: agente.telefono,
      especialidad: agente.especialidad || '',
      slogan: agente.slogan || '',
      biografia: agente.biografia || '',
      experienciaAnios: agente.experienciaAnios || 0,
      whatsapp: agente.whatsapp || '',
      linkedin: agente.linkedin || '',
      instagram: agente.instagram || '',
      facebook: agente.facebook || ''
    });

    // Limpiar y rellenar arrays
    this.clearFormArray(this.idiomas);
    this.clearFormArray(this.certificaciones);
    this.clearFormArray(this.premios);

    agente.idiomas?.forEach(idioma => this.idiomas.push(this.fb.control(idioma)));
    agente.certificaciones?.forEach(cert => this.certificaciones.push(this.fb.control(cert)));
    agente.premios?.forEach(premio => this.premios.push(this.fb.control(premio)));
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
    const updateData: Partial<Agente> = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      cargo: formData.cargo,
      email: formData.email,
      telefono: formData.telefono,
      especialidad: formData.especialidad || undefined,
      slogan: formData.slogan || undefined,
      biografia: formData.biografia || undefined,
      experienciaAnios: formData.experienciaAnios || undefined,
      whatsapp: formData.whatsapp || undefined,
      linkedin: formData.linkedin || undefined,
      instagram: formData.instagram || undefined,
      facebook: formData.facebook || undefined,
      idiomas: formData.idiomas.length > 0 ? formData.idiomas : undefined,
      certificaciones: formData.certificaciones.length > 0 ? formData.certificaciones : undefined,
      premios: formData.premios.length > 0 ? formData.premios : undefined
    };

    // Si hay foto nueva, primero subirla
    if (this.selectedPhotoFile) {
      this.profileService.uploadPhoto(this.selectedPhotoFile).subscribe({
        next: (result) => {
          updateData.fotoUrl = result.url;
          this.saveProfile(usuario.id, updateData);
        },
        error: (err) => {
          this.error.set('Error al subir la foto: ' + err.message);
          this.isSaving.set(false);
        }
      });
    } else {
      this.saveProfile(usuario.id, updateData);
    }
  }

  private saveProfile(userId: number, data: Partial<Agente>): void {
    this.profileService.updateProfile(userId, data).subscribe({
      next: (updatedAgente) => {
        this.agente.set(updatedAgente);
        this.successMessage.set('Perfil actualizado correctamente');
        this.isSaving.set(false);
        this.selectedPhotoFile = null;

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
    const agente = this.agente();
    if (!agente) return '';
    return `${agente.nombre} ${agente.apellido}`;
  }

  // Obtener URL de foto actual
  getCurrentPhotoUrl(): string {
    const preview = this.photoPreview();
    if (preview) return preview;

    const agente = this.agente();
    return agente?.fotoUrl || 'assets/images/agents/default-avatar.jpg';
  }
}
