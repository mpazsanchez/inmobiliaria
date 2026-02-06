import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService, UserService } from '../../../../core/services';
import type { Usuario } from '../../../../core/models';
import type { Propiedad } from '../../../../core/models/property.interface';

/**
 * Representa una asignación de propiedad a un asesor
 */
export interface AsignacionPropiedad {
  propiedadId: number;
  nuevoAsesorId: number;
}

/**
 * Datos de reasignación múltiple para enviar al backend
 */
export interface ReasignacionMultipleData {
  usuarioOrigenId: number;
  asignaciones: AsignacionPropiedad[];
}

@Component({
  selector: 'app-reassign-properties-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reassign-properties-dialog.component.html',
  styleUrls: ['./reassign-properties-dialog.component.scss']
})
export class ReassignPropertiesDialogComponent implements OnInit, OnChanges {
  private userService = inject(UserService);
  private propertyService = inject(PropertyService);

  @Input() isOpen = false;
  @Input() usuarioId: number | null = null;
  @Input() usuarioNombre: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<ReasignacionMultipleData>();

  // Estado
  propiedades = signal<Propiedad[]>([]);
  asesoresDisponibles = signal<Usuario[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Map de propiedadId -> asesorId asignado
  asignaciones = signal<Map<number, number>>(new Map());

  // Asesor para "asignar todas"
  asesorGlobal = signal<number | null>(null);

  // Computed: cantidad de propiedades asignadas
  propiedadesAsignadas = computed(() => {
    return Array.from(this.asignaciones().values()).filter(id => id > 0).length;
  });

  // Computed: todas las propiedades tienen asesor asignado
  todasAsignadas = computed(() => {
    const asig = this.asignaciones();
    const props = this.propiedades();
    if (props.length === 0) return false;
    return props.every(p => asig.has(p.id) && asig.get(p.id)! > 0);
  });

  private dataLoaded = false;

  ngOnInit(): void {
    if (this.isOpen && this.usuarioId) {
      this.loadData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Solo cargar datos cuando isOpen cambia a true o cuando cambia usuarioId mientras está abierto
    const isOpenChange = changes['isOpen'];
    const usuarioIdChange = changes['usuarioId'];

    if (isOpenChange?.currentValue === true && !isOpenChange.previousValue) {
      // Modal se está abriendo
      this.dataLoaded = false;
      if (this.usuarioId) {
        this.loadData();
      }
    } else if (usuarioIdChange && this.isOpen && !this.dataLoaded) {
      // Usuario cambió mientras el modal está abierto
      this.loadData();
    }

    // Reset cuando se cierra el modal
    if (isOpenChange?.currentValue === false && isOpenChange.previousValue === true) {
      this.resetState();
    }
  }

  /**
   * Cierra el modal al presionar Escape
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen) {
      this.onCancel();
    }
  }

  /**
   * Resetea el estado del componente
   */
  private resetState(): void {
    this.propiedades.set([]);
    this.asesoresDisponibles.set([]);
    this.asignaciones.set(new Map());
    this.asesorGlobal.set(null);
    this.error.set(null);
    this.dataLoaded = false;
  }

  loadData(): void {
    if (!this.usuarioId || this.dataLoaded) return;

    this.isLoading.set(true);
    this.error.set(null);
    this.asignaciones.set(new Map());
    this.asesorGlobal.set(null);
    this.dataLoaded = true;

    // Cargar propiedades del asesor
    this.propertyService.getPropiedades().subscribe({
      next: (response) => {
        const allProps = response.datos;
        const userProps = allProps.filter((p: Propiedad) => p.asesorId === this.usuarioId);
        this.propiedades.set(userProps);

        // Inicializar asignaciones vacías (0 = sin asignar)
        const initialMap = new Map<number, number>();
        userProps.forEach((p: Propiedad) => initialMap.set(p.id, 0));
        this.asignaciones.set(initialMap);
      },
      error: (err: any) => {
        this.error.set('Error al cargar propiedades');
        console.error(err);
        this.dataLoaded = false;
      }
    });

    // Cargar asesores disponibles (activos, rol asesor, excepto el actual)
    this.userService.getUsuarios({ rol: 'asesor', activo: true, limite: 1000 }).subscribe({
      next: (respuesta) => {
        const asesores = respuesta.datos.filter(u => u.id !== this.usuarioId);
        this.asesoresDisponibles.set(asesores);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.error.set('Error al cargar asesores');
        console.error(err);
        this.isLoading.set(false);
        this.dataLoaded = false;
      }
    });
  }

  /**
   * Maneja el click en el backdrop para cerrar el modal
   */
  onBackdropClick(event: MouseEvent): void {
    // Solo cerrar si el click fue directamente en el backdrop, no en sus hijos
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  /**
   * Previene la propagación del evento para elementos interactivos
   */
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  /**
   * Asigna un asesor a una propiedad específica
   */
  asignarPropiedad(propiedadId: number, asesorId: number, event?: Event): void {
    event?.stopPropagation();
    const current = new Map(this.asignaciones());
    current.set(propiedadId, asesorId);
    this.asignaciones.set(current);
  }

  /**
   * Maneja el cambio del select de asesor global
   */
  onAsesorGlobalChange(event: Event): void {
    event.stopPropagation();
    const target = event.target as HTMLSelectElement;
    const value = +target.value;
    this.asesorGlobal.set(value || null);
  }

  /**
   * Asigna todas las propiedades al asesor global seleccionado
   */
  asignarTodas(): void {
    const asesorId = this.asesorGlobal();
    if (!asesorId) return;

    const newMap = new Map<number, number>();
    this.propiedades().forEach(p => newMap.set(p.id, asesorId));
    this.asignaciones.set(newMap);
  }

  /**
   * Limpia todas las asignaciones
   */
  limpiarAsignaciones(): void {
    const newMap = new Map<number, number>();
    this.propiedades().forEach(p => newMap.set(p.id, 0));
    this.asignaciones.set(newMap);
    this.asesorGlobal.set(null);
  }

  /**
   * Obtiene el asesor asignado a una propiedad
   */
  getAsesorAsignado(propiedadId: number): number {
    return this.asignaciones().get(propiedadId) || 0;
  }

  /**
   * Verifica si una propiedad tiene asesor asignado
   */
  tieneAsignacion(propiedadId: number): boolean {
    const asesorId = this.asignaciones().get(propiedadId);
    return asesorId !== undefined && asesorId > 0;
  }

  onConfirm(): void {
    // Validar que al menos una propiedad esté asignada
    const asignacionesValidas = Array.from(this.asignaciones().entries())
      .filter(([_, asesorId]) => asesorId > 0)
      .map(([propiedadId, nuevoAsesorId]) => ({ propiedadId, nuevoAsesorId }));

    if (asignacionesValidas.length === 0) {
      this.error.set('Debe asignar al menos una propiedad a un asesor');
      return;
    }

    if (!this.usuarioId) return;

    const data = {
      usuarioOrigenId: this.usuarioId,
      asignaciones: asignacionesValidas
    };
    
    this.confirm.emit(data);
  }

  onCancel(): void {
    this.close.emit();
  }

  getFullName(user: Usuario): string {
    return `${user.nombre} ${user.apellido}`;
  }

  getAsesorNombre(asesorId: number): string {
    if (!asesorId) return '';
    const asesor = this.asesoresDisponibles().find(a => a.id === asesorId);
    return asesor ? this.getFullName(asesor) : '';
  }

  getTotalCount(): number {
    return this.propiedades().length;
  }

  getAssignedCount(): number {
    return this.propiedadesAsignadas();
  }

  /**
   * Cuenta cuántas propiedades están asignadas a un asesor específico
   */
  getCountByAsesor(asesorId: number): number {
    return Array.from(this.asignaciones().values()).filter(id => id === asesorId).length;
  }
}
