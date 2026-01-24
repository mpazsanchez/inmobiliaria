import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadsAdminService, LeadFilters, LeadStats } from '../../services/leads-admin.service';
import { AuthService } from '../../services/auth.service';
import type { Contacto } from '../../../../core/models/lead.interface';
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

  // Estado
  leads = signal<Contacto[]>([]);
  stats = signal<LeadStats | null>(null);
  isLoading = signal(true);
  filters = signal<LeadFilters>({});

  // Lead seleccionado para ver detalle
  selectedLead = signal<Contacto | null>(null);

  // Modal de confirmacion para eliminar
  leadToDelete = signal<Contacto | null>(null);
  isDeleting = signal(false);

  // Usuario actual
  currentUser = computed(() => this.authService.getUsuario());
  isAdmin = computed(() => this.currentUser()?.rol === 'administrador');

  // Título dinámico según rol
  pageTitle = computed(() => this.isAdmin() ? 'Consultas' : 'Mis Consultas');

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
    }
    this.loadLeads();
    this.loadStats();
  }

  loadLeads(): void {
    this.isLoading.set(true);
    this.leadsService.getLeads(this.filters()).subscribe({
      next: (leads) => {
        this.leads.set(leads);
        this.isLoading.set(false);
      },
      error: () => {
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
        this.filters.set({ ...rest, asesorId });
      } else {
        this.filters.set({ ...current, [key]: value, asesorId });
      }
    } else {
      if (value === '' || value === null || value === undefined) {
        const { [key]: _, ...rest } = current;
        this.filters.set(rest);
      } else {
        this.filters.set({ ...current, [key]: value });
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
    return !!(f.busqueda || f.respondida !== undefined);
  }

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
}
