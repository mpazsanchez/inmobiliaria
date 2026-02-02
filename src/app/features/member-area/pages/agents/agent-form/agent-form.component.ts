import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgentsAdminService } from '../../../services/agents-admin.service';
import { ImageUploaderComponent } from '../../../../../shared/components/image-uploader/image-uploader.component';
import { ImageUploadResult } from '../../../../../core/services/image-upload.service';
import type { Agente } from '../../../../../core/models/agent.interface';
import { CanComponentDeactivate } from '../../../../../core/guards/can-deactivate.guard';
import { UnsavedChangesService } from '../../../../../core/services/unsaved-changes.service';
import { 
  FormHeaderComponent, 
  FormTabsComponent, 
  FormAlertComponent, 
  LoadingStateComponent,
  type TabConfig
} from '../../../../../shared/components/admin';

@Component({
  selector: 'app-agent-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ImageUploaderComponent,
    FormHeaderComponent,
    FormTabsComponent,
    FormAlertComponent,
    LoadingStateComponent
  ],
  templateUrl: './agent-form.component.html',
  styleUrls: ['./agent-form.component.scss']
})
export class AgentFormComponent implements OnInit, CanComponentDeactivate {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private agentsService = inject(AgentsAdminService);
  private unsavedChangesService = inject(UnsavedChangesService);

  // Estado
  isEditMode = signal(false);
  agentId = signal<number | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);
  activeTab = signal<'personal' | 'professional' | 'contact' | 'achievements'>('personal');

  // Opciones
  cargos = this.agentsService.getCargos();
  especialidades = this.agentsService.getEspecialidades();
  idiomasDisponibles = this.agentsService.getIdiomasDisponibles();

  // Formulario
  form: FormGroup = this.fb.group({
    // Personal
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    cargo: ['Agente Inmobiliario', Validators.required],
    fotoUrl: [''],
    activo: [true],
    destacado: [false],

    // Profesional
    especialidad: [''],
    slogan: ['', Validators.maxLength(100)],
    biografia: ['', Validators.maxLength(1000)],
    experienciaAnios: [0, [Validators.min(0), Validators.max(50)]],
    idiomas: [['Español']],

    // Contacto
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    whatsapp: [''],
    linkedin: [''],
    instagram: [''],
    facebook: [''],

    // Logros
    certificaciones: this.fb.array([]),
    premios: this.fb.array([])
  });

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
      this.agentId.set(+id);
      this.loadAgent(+id);
    }
  }

  loadAgent(id: number): void {
    this.isLoading.set(true);
    this.agentsService.getAgentById(id).subscribe({
      next: (agent) => {
        if (agent) {
          this.patchForm(agent);
          // Marcar como pristine después de cargar datos
          this.form.markAsPristine();
        } else {
          this.error.set('Asesor no encontrado');
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar el asesor');
        this.isLoading.set(false);
      }
    });
  }

  patchForm(agent: Agente): void {
    this.form.patchValue({
      nombre: agent.nombre,
      apellido: agent.apellido,
      cargo: agent.cargo,
      fotoUrl: agent.fotoUrl,
      activo: agent.activo,
      destacado: agent.destacado,
      especialidad: agent.especialidad,
      slogan: agent.slogan,
      biografia: agent.biografia,
      experienciaAnios: agent.experienciaAnios || 0,
      idiomas: agent.idiomas || ['Español'],
      email: agent.email,
      telefono: agent.telefono,
      whatsapp: agent.whatsapp,
      linkedin: agent.linkedin,
      instagram: agent.instagram,
      facebook: agent.facebook
    });

    // Cargar certificaciones
    this.certificacionesArray.clear();
    agent.certificaciones?.forEach(cert => {
      this.certificacionesArray.push(this.fb.control(cert));
    });

    // Cargar premios
    this.premiosArray.clear();
    agent.premios?.forEach(premio => {
      this.premiosArray.push(this.fb.control(premio));
    });
  }

  // Tabs
  setTab(tab: 'personal' | 'professional' | 'contact' | 'achievements'): void {
    this.activeTab.set(tab);
  }

  private readonly tabValidators: Record<string, () => boolean> = {
    personal: () => !!(this.form.get('nombre')?.valid && this.form.get('apellido')?.valid),
    professional: () => true,
    contact: () => !!(this.form.get('email')?.valid && this.form.get('telefono')?.valid),
    achievements: () => true
  };

  isTabValid(tab: string): boolean {
    return this.tabValidators[tab]?.() ?? true;
  }

  // Configuración de tabs para el componente reutilizable
  tabsConfig: TabConfig[] = [
    { id: 'personal', label: 'Datos Personales', icon: 'person', isValid: () => this.isTabValid('personal') },
    { id: 'professional', label: 'Perfil Profesional', icon: 'briefcase', isValid: () => this.isTabValid('professional') },
    { id: 'contact', label: 'Contacto', icon: 'telephone', isValid: () => this.isTabValid('contact') },
    { id: 'achievements', label: 'Logros', icon: 'award', isValid: () => this.isTabValid('achievements') }
  ];

  // Idiomas
  toggleIdioma(idioma: string): void {
    const current = this.idiomasSeleccionados;
    const updated = current.includes(idioma)
      ? current.filter(i => i !== idioma)
      : [...current, idioma];
    this.form.get('idiomas')?.setValue(updated);
  }

  isIdiomaSelected(idioma: string): boolean {
    return this.idiomasSeleccionados.includes(idioma);
  }

  // Certificaciones
  addCertificacion(): void {
    this.certificacionesArray.push(this.fb.control(''));
  }

  removeCertificacion(index: number): void {
    this.certificacionesArray.removeAt(index);
  }

  // Premios
  addPremio(): void {
    this.premiosArray.push(this.fb.control(''));
  }

  removePremio(index: number): void {
    this.premiosArray.removeAt(index);
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

    // Limpiar certificaciones y premios vacios
    data.certificaciones = this.certificacionesArray.value.filter((c: string) => c.trim());
    data.premios = this.premiosArray.value.filter((p: string) => p.trim());

    const request = this.isEditMode()
      ? this.agentsService.updateAgent(this.agentId()!, data)
      : this.agentsService.createAgent(data);

    request.subscribe({
      next: () => {
        this.form.markAsPristine(); // Marcar como sin cambios después de guardar
        this.router.navigate(['/member-area/asesores']);
      },
      error: () => {
        this.error.set('Error al guardar el asesor');
        this.isSaving.set(false);
      }
    });
  }

  markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  cancel(): void {
    this.router.navigate(['/member-area/asesores']);
  }

  // Photo preview
  getPhotoPreview(): string {
    return this.form.get('fotoUrl')?.value || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face';
  }

  // Manejo de subida de imagen
  onImageUploaded(result: ImageUploadResult): void {
    this.form.get('fotoUrl')?.setValue(result.url);
  }

  onImageUploadError(errorMessage: string): void {
    this.error.set(errorMessage);
  }

  removePhoto(): void {
    this.form.get('fotoUrl')?.setValue('');
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
