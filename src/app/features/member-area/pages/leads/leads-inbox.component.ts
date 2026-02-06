import { Component, OnInit, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadsAdminService, LeadFilters, LeadStats } from '../../services/leads-admin.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { ToastService } from '../../../../core/services/toast.service';
import type { Contacto } from '../../../../core/models/lead.interface';
import type { Usuario } from '../../../../core/models/user.interface';
import type { InfoPaginacion } from '../../../../core/models/search-filters.interface';
import {
  PageHeaderComponent,
  StatsGridComponent,
  StatCardConfig,
  EmptyStateComponent,
  ConfirmModalComponent
} from '../../../../shared/components/admin';

@Component({
  selector: 'app-leads-inbox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderComponent,
    StatsGridComponent,
    EmptyStateComponent,
    ConfirmModalComponent
  ],
  templateUrl: './leads-inbox.component.html',
  styleUrls: ['./leads-inbox.component.scss']
})
export class LeadsInboxComponent implements OnInit {
  private leadsService = inject(LeadsAdminService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private toastService = inject(ToastService);

  // Exponer Math para el template
  Math = Math;

  // Estado
  leads = signal<Contacto[]>([]);
  paginacion = signal<InfoPaginacion | null>(null);
  stats = signal<LeadStats | null>(null);
  isLoading = signal(true);
  filters = signal<LeadFilters>({ pagina: 1, limite: 10 });

  // Lead seleccionado para ver detalle
  selectedLead = signal<Contacto | null>(null);

  // Modal de confirmacion para eliminar
  leadToDelete = signal<Contacto | null>(null);
  isDeleting = signal(false);

  // Asesores disponibles (para admin)
  asesoresDisponibles = signal<Usuario[]>([]);
  asesoresMap = computed(() => {
    const map = new Map<number, Usuario>();
    this.asesoresDisponibles().forEach(a => map.set(a.id, a));
    return map;
  });

  // Modal de asignación de lead
  showAssignModal = signal(false);
  leadToAssign = signal<Contacto | null>(null);
  selectedAsesorId = signal<number | null>(null);
  isAssigning = signal(false);

  // Usuario actual
  currentUser = computed(() => this.authService.getUsuario());
  isAdmin = computed(() => this.currentUser()?.rol === 'admin');

  // Título dinámico según rol
  pageTitle = computed(() => this.isAdmin() ? 'Consultas' : 'Mis Consultas');

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showAssignModal()) {
      this.closeAssignModal();
    }
  }

  // Stats cards computadas
  statsCards = computed<StatCardConfig[]>(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      { value: s.total, label: 'Total', icon: 'bi-envelope', variant: 'primary' },
      { value: s.pendientes, label: 'Pendientes', icon: 'bi-envelope-exclamation', variant: 'warning' },
      { value: s.respondidas, label: 'Respondidas', icon: 'bi-envelope-check', variant: 'success' },
      { value: s.estaSemana, label: 'Esta semana', icon: 'bi-calendar-week', variant: 'info' }
    ];
  });

  // Nombre del lead a eliminar para el modal
  leadToDeleteName = computed(() => this.leadToDelete()?.nombreContacto || '');

  ngOnInit(): void {
    // Si es asesor, filtrar solo sus consultas
    if (!this.isAdmin()) {
      const userId = this.currentUser()?.id;
      if (userId) {
        this.filters.set({ asesorId: userId });
      }
    } else {
      // Admin: cargar lista de asesores
      this.loadAsesores();
    }
    this.loadLeads();
    this.loadStats();
  }

  loadLeads(): void {
    console.log('📊 LeadsInbox.loadLeads() - Filtros actuales:', this.filters());
    this.isLoading.set(true);
    this.leadsService.getLeads(this.filters()).subscribe({
      next: (response) => {
        console.log('📊 LeadsInbox.loadLeads() - Respuesta recibida:', {
          leads: response.datos.length,
          paginacion: response.paginacion
        });
        this.leads.set(response.datos);
        this.paginacion.set(response.paginacion);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Error cargando leads:', err);
        this.isLoading.set(false);
      }
    });
  }

  loadStats(): void {
    const asesorId = this.isAdmin() ? undefined : this.currentUser()?.id;
    this.leadsService.getStats(asesorId).subscribe({
      next: (stats) => this.stats.set(stats)
    });
  }

  onFilterChange(key: keyof LeadFilters, value: any): void {
    const current = this.filters();

    // Preservar filtro de asesor si no es admin
    if (!this.isAdmin() && key !== 'asesorId') {
      const asesorId = this.currentUser()?.id;
      if (value === '' || value === null || value === undefined) {
        const { [key]: _, ...rest } = current;
        this.filters.set({ ...rest, asesorId, pagina: 1, limite: 10 });
      } else {
        this.filters.set({ ...current, [key]: value, asesorId, pagina: 1, limite: 10 });
      }
    } else {
      if (value === '' || value === null || value === undefined) {
        const { [key]: _, ...rest } = current;
        this.filters.set({ ...rest, pagina: 1, limite: 10 });
      } else {
        this.filters.set({ ...current, [key]: value, pagina: 1, limite: 10 });
      }
    }

    this.loadLeads();
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onFilterChange('busqueda', value || undefined);
  }

  onRespondidaFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === '') {
      this.onFilterChange('respondida', undefined);
    } else {
      this.onFilterChange('respondida', value === 'true');
    }
  }

  // Seleccionar lead para ver detalle
  selectLead(lead: Contacto): void {
    this.selectedLead.set(lead);
  }

  closeLead(): void {
    this.selectedLead.set(null);
  }

  // Marcar como respondida
  markAsResponded(lead: Contacto): void {
    this.leadsService.markAsResponded(lead.id).subscribe({
      next: () => {
        this.loadLeads();
        this.loadStats();
        // Actualizar lead seleccionado si es el mismo
        if (this.selectedLead()?.id === lead.id) {
          this.selectedLead.set({ ...lead, respondida: true });
        }
      }
    });
  }

  // Marcar como pendiente
  markAsPending(lead: Contacto): void {
    this.leadsService.markAsPending(lead.id).subscribe({
      next: () => {
        this.loadLeads();
        this.loadStats();
        if (this.selectedLead()?.id === lead.id) {
          this.selectedLead.set({ ...lead, respondida: false });
        }
      }
    });
  }

  // Eliminar
  confirmDelete(lead: Contacto): void {
    this.leadToDelete.set(lead);
  }

  cancelDelete(): void {
    this.leadToDelete.set(null);
  }

  deleteLead(): void {
    const lead = this.leadToDelete();
    if (!lead) return;

    this.isDeleting.set(true);
    this.leadsService.deleteLead(lead.id).subscribe({
      next: () => {
        this.leadToDelete.set(null);
        this.isDeleting.set(false);
        this.loadLeads();
        this.loadStats();
        // Cerrar detalle si es el mismo
        if (this.selectedLead()?.id === lead.id) {
          this.selectedLead.set(null);
        }
      },
      error: () => {
        this.isDeleting.set(false);
      }
    });
  }

  // Helpers
  getTimeAgo(fecha: string): string {
    return this.leadsService.getTimeAgo(fecha);
  }

  formatDate(fecha: string): string {
    return this.leadsService.formatDate(fecha);
  }

  getInitials(nombre: string): string {
    return nombre
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  clearFilters(): void {
    if (this.isAdmin()) {
      this.filters.set({});
    } else {
      this.filters.set({ asesorId: this.currentUser()?.id });
    }
    this.loadLeads();
  }

  hasActiveFilters(): boolean {
    const f = this.filters();
    // Para admin, asesorId es un filtro activo; para asesor, es fijo
    const hasAsesorFilter = this.isAdmin() && (f.asesorId !== undefined);
    return !!(f.busqueda || f.respondida !== undefined || hasAsesorFilter);
  }

  // Mensaje específico cuando el filtro es "sin asignar"
  emptyStateMessage = computed(() => {
    const f = this.filters();
    
    // Si hay filtro de "sin asignar" activo
    if (f.asesorId === null) {
      return {
        title: 'Sin consultas nuevas',
        message: 'No hay consultas sin asignar en este momento. Todas las consultas tienen un asesor asignado.'
      };
    }
    
    // Si hay otros filtros activos
    if (this.hasActiveFilters()) {
      return {
        title: 'Sin resultados',
        message: 'No se encontraron consultas con los filtros aplicados'
      };
    }
    
    // Estado vacío por defecto
    return {
      title: 'Sin consultas',
      message: 'No hay consultas pendientes por el momento'
    };
  });

  // Acciones de contacto
  sendEmail(email: string): void {
    window.location.href = `mailto:${email}`;
  }

  sendWhatsApp(telefono: string): void {
    const numero = telefono.replace(/\D/g, '');
    window.open(`https://wa.me/${numero}`, '_blank');
  }

  callPhone(telefono: string): void {
    window.location.href = `tel:${telefono}`;
  }

  // ========== Métodos para admin: asesores y asignación ==========

  loadAsesores(): void {
    this.userService.getUsuarios({ rol: 'asesor', activo: true, limite: 100 }).subscribe({
      next: (response) => {
        this.asesoresDisponibles.set(response.datos);
      },
      error: (err) => {
        console.error('Error al cargar asesores:', err);
      }
    });
  }

  getAsesorName(asesorId: number | null): string {
    if (!asesorId) return 'Sin asignar';
    const asesor = this.asesoresMap().get(asesorId);
    return asesor ? `${asesor.nombre} ${asesor.apellido}` : 'Sin asignar';  
  }

  // Verifica si el lead realmente tiene un asesor válido asignado
  hasValidAsesor(asesorId: number | null): boolean {
    if (!asesorId) return false;
    return this.asesoresMap().has(asesorId);
  }

  onAsesorFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === '') {
      this.onFilterChange('asesorId', undefined);
    } else if (value === 'null') {
      // Filtrar sin asignar - valor especial
      this.onFilterChange('asesorId', null);
    } else {
      this.onFilterChange('asesorId', +value);
    }
  }

  // Modal de asignación
  openAssignModal(lead: Contacto): void {
    this.leadToAssign.set(lead);
    this.selectedAsesorId.set(null);
    this.showAssignModal.set(true);
  }

  closeAssignModal(): void {
    this.showAssignModal.set(false);
    this.leadToAssign.set(null);
    this.selectedAsesorId.set(null);
  }

  onBackdropClick(event: MouseEvent): void {
    // Solo cerrar si el click fue directamente en el backdrop
    if (event.target === event.currentTarget) {
      this.closeAssignModal();
    }
  }

  assignLead(): void {
    const lead = this.leadToAssign();
    const asesorId = this.selectedAsesorId();

    if (!lead || !asesorId) return;

    this.isAssigning.set(true);

    this.leadsService.assignToAgent(lead.id, asesorId).subscribe({
      next: (updatedLead) => {
        // Mostrar mensaje de éxito
        const asesor = this.asesoresDisponibles().find(a => a.id === asesorId);
        const asesorName = asesor ? `${asesor.nombre} ${asesor.apellido}` : 'el asesor';
        this.toastService.success(`Consulta asignada a ${asesorName} correctamente`);
        
        this.closeAssignModal();
        this.isAssigning.set(false);
        
        // Recargar la lista para reflejar cambios
        this.loadLeads();
        this.loadStats();
        
        // Limpiar selección si el lead asignado era el seleccionado
        if (this.selectedLead()?.id === lead.id) {
          this.selectedLead.set(null);
        }
      },
      error: (err) => {
        console.error('Error al asignar lead:', err);
        this.toastService.error('Error al asignar la consulta. Por favor, intenta nuevamente.');
        this.isAssigning.set(false);
      }
    });
  }

  onSelectAsesor(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedAsesorId.set(value ? +value : null);
  }

  // ========== Paginación ==========

  onPaginaChange(pagina: number): void {
    console.log('📄 Cambiando a página:', pagina);
    const current = this.filters();
    this.filters.set({ ...current, pagina });
    this.loadLeads();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get totalPaginas(): number {
    const total = this.paginacion()?.totalPaginas || 0;
    console.log('📊 totalPaginas getter:', total, 'paginacion:', this.paginacion());
    return total;
  }

  get paginaActual(): number {
    const actual = this.paginacion()?.paginaActual || 1;
    console.log('📊 paginaActual getter:', actual);
    return actual;
  }

  get paginasArray(): number[] {
    const total = this.totalPaginas;
    const actual = this.paginaActual;
    const rango = 2;
    const paginas: number[] = [];

    for (let i = Math.max(1, actual - rango); i <= Math.min(total, actual + rango); i++) {
      paginas.push(i);
    }

    console.log('📊 paginasArray:', paginas);
    return paginas;
  }
}
