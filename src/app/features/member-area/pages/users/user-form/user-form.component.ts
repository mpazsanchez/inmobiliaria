import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../../core/services/user.service';
import { AuthService } from '../../../services/auth.service';
import { ImageUploaderComponent } from '../../../../../shared/components/image-uploader/image-uploader.component';
import { ImageUploadResult } from '../../../../../core/services/image-upload.service';
import type { Usuario, CrearUsuarioDto, ActualizarUsuarioDto, RolUsuario } from '../../../../../core/models/user.interface';
import { CanComponentDeactivate } from '../../../../../core/guards/can-deactivate.guard';
import { 
  FormHeaderComponent, 
  FormTabsComponent, 
  FormAlertComponent, 
  LoadingStateComponent,
  ConfirmModalComponent,
  type TabConfig
} from '../../../../../shared/components/admin';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ImageUploaderComponent,
    FormHeaderComponent,
    FormTabsComponent,
    FormAlertComponent,
    LoadingStateComponent,
    ConfirmModalComponent
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, CanComponentDeactivate {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  // Estado
  isEditMode = signal(false);
  userId = signal<number | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  activeTab = signal<'basico' | 'perfil' | 'redes' | 'logros' | 'seguridad'>('basico');
  
  // Reset de contraseña
  sendingResetLink = signal(false);
  showResetConfirmModal = signal(false);
  
  // Modal de cambios no guardados
  showUnsavedChangesModal = signal(false);
  pendingNavigation: (() => void) | null = null;
  
  // Modal de confirmación para eliminar foto
  showDeletePhotoModal = signal(false);
  
  // Usuario actual
  usuario = signal<Usuario | null>(null);
  
  // Computed para saber si es asesor
  esAsesor = computed(() => this.form.get('rol')?.value === 'asesor');

  // Computed para saber si está editando su propio perfil
  isEditingOwnProfile = computed(() => {
    const currentUserId = this.authService.getCurrentUserId();
    return this.isEditMode() && this.userId() === currentUserId;
  });

  // Formulario
  form: FormGroup = this.fb.group({
    // Datos básicos (todos los usuarios)
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    fotoUrl: [''],
    rol: ['asesor' as RolUsuario, Validators.required],
    activo: [true],
    
    // Seguridad (solo al crear)
    password: [''],
    confirmarPassword: [''],
    
    // Perfil público (solo asesores) - estos campos se habilitan dinámicamente
    cargo: ['Asesor Inmobiliario'],
    especialidad: [''],
    slogan: ['', Validators.maxLength(100)],
    biografia: ['', Validators.maxLength(1000)],
    experienciaAnios: [0, [Validators.min(0), Validators.max(50)]],
    idiomas: [['Español']],
    
    // Redes sociales (solo asesores)
    whatsapp: [''],
    linkedin: [''],
    instagram: [''],
    facebook: [''],
    
    // Logros (solo asesores)
    propiedadesVendidas: [0, Validators.min(0)],
    clientesSatisfechos: [0, Validators.min(0)],
    certificaciones: this.fb.array([]),
    premios: this.fb.array([]),
    destacado: [false]
  });

  // Configuración de tabs
  tabsConfig: TabConfig[] = [
    { id: 'basico', label: 'Datos Básicos', icon: 'person' },
    { id: 'seguridad', label: 'Seguridad', icon: 'shield-lock' },
    { id: 'perfil', label: 'Perfil Público', icon: 'card-text', hideIf: () => !this.esAsesor() },
    { id: 'redes', label: 'Redes Sociales', icon: 'share', hideIf: () => !this.esAsesor() },
    { id: 'logros', label: 'Logros', icon: 'trophy', hideIf: () => !this.esAsesor() }
  ];

  // Opciones
  roles: { value: RolUsuario, label: string }[] = [
    { value: 'asesor', label: 'Asesor Inmobiliario' },
    { value: 'admin', label: 'Administrador' }
  ];
  
  cargos = ['Asesor Inmobiliario', 'Broker Asociado', 'Especialista en Propiedades de Lujo', 
           'Especialista en Propiedades Comerciales', 'Agente Senior'];
  
  especialidades = ['Propiedades de Lujo', 'Primera Vivienda', 'Inversiones', 
                   'Propiedades Comerciales', 'Alquileres Temporarios'];
  
  idiomasDisponibles = ['Español', 'Inglés', 'Portugués', 'Francés', 'Italiano', 'Alemán'];

  // Getters
  get certificacionesArray(): FormArray {
    return this.form.get('certificaciones') as FormArray;
  }

  get premiosArray(): FormArray {
    return this.form.get('premios') as FormArray;
  }

  get idiomasSeleccionados(): string[] {
    return this.form.get('idiomas')?.value || [];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.isEditMode.set(true);
      this.userId.set(+id);
      this.cargarUsuario(+id);
      
      // En modo edición, la contraseña no es obligatoria
      this.form.get('password')?.clearValidators();
      this.form.get('confirmarPassword')?.clearValidators();
    } else {
      // En modo creación, la contraseña es obligatoria
      this.form.get('password')?.setValidators([
        Validators.required, 
        Validators.minLength(8)
      ]);
      this.form.get('confirmarPassword')?.setValidators([
        Validators.required
      ]);
    }

    // Observar cambios en el rol para habilitar/deshabilitar campos
    this.form.get('rol')?.valueChanges.subscribe(() => {
      this.actualizarValidadoresSegunRol();
    });
  }

  cargarUsuario(id: number): void {
    this.isLoading.set(true);
    
    this.userService.getUsuarioPorId(id).subscribe({
      next: (usuario) => {
        if (usuario) {
          this.usuario.set(usuario);
          this.cargarDatosEnFormulario(usuario);
        } else {
          this.error.set('Usuario no encontrado');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
        this.error.set('Error al cargar el usuario');
        this.isLoading.set(false);
      }
    });
  }

  cargarDatosEnFormulario(usuario: Usuario): void {
    this.form.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      fotoUrl: usuario.fotoUrl,
      rol: usuario.rol,
      activo: usuario.activo
    });

    // 🔒 RESTRICCIÓN DE SEGURIDAD: No puede cambiar su propio rol/estado
    if (this.isEditingOwnProfile()) {
      this.form.get('rol')?.disable();
      this.form.get('activo')?.disable();
    }

    // Si es asesor y tiene perfil, cargar datos del perfil
    if (usuario.perfilAsesor) {
      const perfil = usuario.perfilAsesor;
      
      this.form.patchValue({
        cargo: perfil.cargo,
        especialidad: perfil.especialidad,
        slogan: perfil.slogan,
        biografia: perfil.biografia,
        experienciaAnios: perfil.experienciaAnios,
        idiomas: perfil.idiomas || ['Español'],
        whatsapp: perfil.whatsapp,
        linkedin: perfil.linkedin,
        instagram: perfil.instagram,
        facebook: perfil.facebook,
        propiedadesVendidas: perfil.propiedadesVendidas || 0,
        clientesSatisfechos: perfil.clientesSatisfechos || 0,
        destacado: perfil.destacado
      });

      // Cargar certificaciones
      if (perfil.certificaciones) {
        perfil.certificaciones.forEach(cert => this.agregarCertificacion(cert));
      }

      // Cargar premios
      if (perfil.premios) {
        perfil.premios.forEach(premio => this.agregarPremio(premio));
      }
    }
  }

  actualizarValidadoresSegunRol(): void {
    const esAsesor = this.form.get('rol')?.value === 'asesor';
    
    if (esAsesor) {
      // Hacer obligatorio el cargo para asesores
      this.form.get('cargo')?.setValidators([Validators.required]);
    } else {
      // Limpiar validadores de campos de perfil si es admin
      this.form.get('cargo')?.clearValidators();
    }
    
    this.form.get('cargo')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.marcarCamposComoTocados();
      this.error.set('Por favor completa todos los campos obligatorios');
      return;
    }

    // Validar contraseñas si se están cambiando
    const password = this.form.get('password')?.value;
    const confirmar = this.form.get('confirmarPassword')?.value;
    
    if (password || confirmar) {
      if (password !== confirmar) {
        this.error.set('Las contraseñas no coinciden');
        return;
      }
    }

    if (this.isEditMode()) {
      this.actualizarUsuario();
    } else {
      this.crearUsuario();
    }
  }

  crearUsuario(): void {
    this.isSaving.set(true);
    this.error.set(null);

    const dto: CrearUsuarioDto = {
      email: this.form.value.email,
      password: this.form.value.password,
      rol: this.form.value.rol,
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      telefono: this.form.value.telefono,
      fotoUrl: this.form.value.fotoUrl
    };

    // Si es asesor, agregar perfil
    if (dto.rol === 'asesor') {
      dto.perfilAsesor = {
        cargo: this.form.value.cargo,
        especialidad: this.form.value.especialidad,
        slogan: this.form.value.slogan,
        biografia: this.form.value.biografia,
        experienciaAnios: this.form.value.experienciaAnios,
        idiomas: this.form.value.idiomas,
        whatsapp: this.form.value.whatsapp,
        linkedin: this.form.value.linkedin,
        instagram: this.form.value.instagram,
        facebook: this.form.value.facebook,
        propiedadesVendidas: this.form.value.propiedadesVendidas,
        clientesSatisfechos: this.form.value.clientesSatisfechos,
        certificaciones: this.certificacionesArray.value,
        premios: this.premiosArray.value,
        destacado: this.form.value.destacado
      };
    }

    this.userService.crearUsuario(dto).subscribe({
      next: (usuario) => {
        this.success.set('Usuario creado exitosamente');
        this.isSaving.set(false);
        
        setTimeout(() => {
          this.router.navigate(['/member-area/usuarios']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        this.error.set(err.message || 'Error al crear el usuario');
        this.isSaving.set(false);
      }
    });
  }

  actualizarUsuario(): void {
    if (!this.userId()) return;

    this.isSaving.set(true);
    this.error.set(null);

    const dto: ActualizarUsuarioDto = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      telefono: this.form.value.telefono,
      fotoUrl: this.form.value.fotoUrl,
      activo: this.form.value.activo
    };

    // Si es asesor, actualizar perfil
    if (this.form.value.rol === 'asesor') {
      dto.perfilAsesor = {
        cargo: this.form.value.cargo,
        especialidad: this.form.value.especialidad,
        slogan: this.form.value.slogan,
        biografia: this.form.value.biografia,
        experienciaAnios: this.form.value.experienciaAnios,
        idiomas: this.form.value.idiomas,
        whatsapp: this.form.value.whatsapp,
        linkedin: this.form.value.linkedin,
        instagram: this.form.value.instagram,
        facebook: this.form.value.facebook,
        propiedadesVendidas: this.form.value.propiedadesVendidas,
        clientesSatisfechos: this.form.value.clientesSatisfechos,
        certificaciones: this.certificacionesArray.value,
        premios: this.premiosArray.value,
        destacado: this.form.value.destacado
      };
    }

    this.userService.actualizarUsuario(this.userId()!, dto).subscribe({
      next: (usuario) => {
        this.success.set('Usuario actualizado exitosamente');
        this.isSaving.set(false);
        this.form.markAsPristine();
        
        setTimeout(() => {
          this.router.navigate(['/member-area/usuarios']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        this.error.set(err.message || 'Error al actualizar el usuario');
        this.isSaving.set(false);
      }
    });
  }

  // Manejo de foto
  onImageUploaded(result: ImageUploadResult | ImageUploadResult[]): void {
    const resultArray = Array.isArray(result) ? result : [result];
    if (resultArray && resultArray.length > 0) {
      this.form.patchValue({ fotoUrl: resultArray[0].url });
      this.form.markAsDirty();
    }
  }

  onImageUploadError(error: string): void {
    this.error.set(`Error al subir imagen: ${error}`);
  }

  removePhoto(): void {
    this.showDeletePhotoModal.set(true);
  }

  confirmDeletePhoto(): void {
    this.form.patchValue({ fotoUrl: '' });
    this.form.markAsDirty();
    this.showDeletePhotoModal.set(false);
  }

  cancelDeletePhoto(): void {
    this.showDeletePhotoModal.set(false);
  }

  getPhotoPreview(): string {
    return this.form.get('fotoUrl')?.value || '/assets/images/default-avatar.png';
  }

  // Manejo de idiomas
  toggleIdioma(idioma: string): void {
    const idiomas = [...this.idiomasSeleccionados];
    const index = idiomas.indexOf(idioma);
    
    if (index > -1) {
      idiomas.splice(index, 1);
    } else {
      idiomas.push(idioma);
    }
    
    this.form.patchValue({ idiomas });
    this.form.markAsDirty();
  }

  isIdiomaSeleccionado(idioma: string): boolean {
    return this.idiomasSeleccionados.includes(idioma);
  }

  // Manejo de certificaciones
  agregarCertificacion(valor: string = ''): void {
    this.certificacionesArray.push(this.fb.control(valor, Validators.required));
    this.form.markAsDirty();
  }

  eliminarCertificacion(index: number): void {
    this.certificacionesArray.removeAt(index);
    this.form.markAsDirty();
  }

  // Manejo de premios
  agregarPremio(valor: string = ''): void {
    this.premiosArray.push(this.fb.control(valor, Validators.required));
    this.form.markAsDirty();
  }

  eliminarPremio(index: number): void {
    this.premiosArray.removeAt(index);
    this.form.markAsDirty();
  }

  // =============================================
  // PASSWORD RESET
  // =============================================
  
  /**
   * Envía un link de restablecimiento de contraseña al email del usuario
   */
  openResetConfirmModal(): void {
    const email = this.usuario()?.email;
    if (!email) {
      this.error.set('No se pudo obtener el email del usuario');
      return;
    }
    this.showResetConfirmModal.set(true);
  }

  sendPasswordResetLink(): void {
    const email = this.usuario()?.email;
    
    if (!email) {
      this.error.set('No se pudo obtener el email del usuario');
      return;
    }

    this.showResetConfirmModal.set(false);

    this.sendingResetLink.set(true);
    this.error.set(null);
    this.success.set(null);

    this.authService.sendPasswordResetEmail(email).subscribe({
      next: () => {
        this.success.set(
          `✅ Link de restablecimiento enviado a ${email}. ` +
          `El usuario recibirá un email con instrucciones para establecer una nueva contraseña.`
        );
        this.sendingResetLink.set(false);
        
        // Scroll al mensaje de éxito
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error('Error al enviar link de reset:', err);
        this.error.set('Error al enviar el link de restablecimiento. Por favor, intenta nuevamente.');
        this.sendingResetLink.set(false);
      }
    });
  }

  // Helpers
  private marcarCamposComoTocados(): void {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
  }

  // Guard de navegación
  canDeactivate(): boolean | Promise<boolean> {
    if (!this.form.dirty) {
      return true;
    }
    
    // Mostrar modal y retornar promesa
    return new Promise<boolean>((resolve) => {
      this.pendingNavigation = () => resolve(true);
      this.showUnsavedChangesModal.set(true);
      
      // Si el usuario cancela el modal, resolver con false
      const originalCancel = () => resolve(false);
      // Guardar referencia para poder cancelar
      (this as any)._cancelNavigation = originalCancel;
    });
  }

  confirmLeave(): void {
    this.showUnsavedChangesModal.set(false);
    if (this.pendingNavigation) {
      this.pendingNavigation();
      this.pendingNavigation = null;
    }
  }

  cancelLeave(): void {
    this.showUnsavedChangesModal.set(false);
    if ((this as any)._cancelNavigation) {
      (this as any)._cancelNavigation();
    }
    this.pendingNavigation = null;
  }

  cancelar(): void {
    if (!this.form.dirty) {
      this.router.navigate(['/member-area/usuarios']);
      return;
    }
    
    // Usar el mismo modal
    this.pendingNavigation = () => {
      this.router.navigate(['/member-area/usuarios']);
    };
    this.showUnsavedChangesModal.set(true);
  }
}
