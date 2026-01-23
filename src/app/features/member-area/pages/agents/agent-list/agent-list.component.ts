import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgentsAdminService, AgentFilters, AgentStats } from '../../../services/agents-admin.service';
import type { Agente } from '../../../../../core/models/agent.interface';
import {
  PageHeaderComponent,
  HeaderAction,
  StatsGridComponent,
  StatCardConfig,
  EmptyStateComponent,
  ConfirmModalComponent
} from '../../../../../shared/components/admin';

@Component({
  selector: 'app-agent-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    PageHeaderComponent,
    StatsGridComponent,
    EmptyStateComponent,
    ConfirmModalComponent
  ],
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.scss']
})
export class AgentListComponent implements OnInit {
  private agentsService = inject(AgentsAdminService);

  // Estado
  agents = signal<Agente[]>([]);
  stats = signal<AgentStats | null>(null);
  isLoading = signal(true);
  filters = signal<AgentFilters>({});

  // Para el modal de confirmacion
  agentToDelete = signal<Agente | null>(null);
  isDeleting = signal(false);

  // Configuración del header
  primaryAction: HeaderAction = {
    label: 'Nuevo Asesor',
    icon: 'bi-plus-lg',
    route: '/member-area/asesores/nuevo',
    variant: 'primary'
  };

  // Stats cards computadas
  statsCards = computed<StatCardConfig[]>(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      { value: s.total, label: 'Total', icon: 'bi-people', variant: 'primary' },
      { value: s.activos, label: 'Activos', icon: 'bi-person-check', variant: 'success' },
      { value: s.inactivos, label: 'Inactivos', icon: 'bi-person-x', variant: 'default' },
      { value: s.destacados, label: 'Destacados', icon: 'bi-star', variant: 'warning' }
    ];
  });

  // Nombre del agente a eliminar para el modal
  agentToDeleteName = computed(() => {
    const agent = this.agentToDelete();
    return agent ? this.getFullName(agent) : '';
  });

  ngOnInit(): void {
    this.loadAgents();
    this.loadStats();
  }

  loadAgents(): void {
    this.isLoading.set(true);
    this.agentsService.getAgents(this.filters()).subscribe({
      next: (agents) => {
        this.agents.set(agents);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  loadStats(): void {
    this.agentsService.getStats().subscribe({
      next: (stats) => this.stats.set(stats)
    });
  }

  onFilterChange(key: keyof AgentFilters, value: any): void {
    const current = this.filters();
    if (value === '' || value === null || value === undefined) {
      const { [key]: _, ...rest } = current;
      this.filters.set(rest);
    } else {
      this.filters.set({ ...current, [key]: value });
    }
    this.loadAgents();
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onFilterChange('busqueda', value || undefined);
  }

  onActivoFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === '') {
      this.onFilterChange('activo', undefined);
    } else {
      this.onFilterChange('activo', value === 'true');
    }
  }

  toggleActivo(agent: Agente): void {
    this.agentsService.toggleActivo(agent.id).subscribe({
      next: () => {
        this.loadAgents();
        this.loadStats();
      }
    });
  }

  toggleDestacado(agent: Agente): void {
    this.agentsService.toggleDestacado(agent.id).subscribe({
      next: () => {
        this.loadAgents();
        this.loadStats();
      }
    });
  }

  confirmDelete(agent: Agente): void {
    this.agentToDelete.set(agent);
  }

  cancelDelete(): void {
    this.agentToDelete.set(null);
  }

  deleteAgent(): void {
    const agent = this.agentToDelete();
    if (!agent) return;

    this.isDeleting.set(true);
    this.agentsService.deleteAgent(agent.id).subscribe({
      next: () => {
        this.agentToDelete.set(null);
        this.isDeleting.set(false);
        this.loadAgents();
        this.loadStats();
      },
      error: () => {
        this.isDeleting.set(false);
      }
    });
  }

  getFullName(agent: Agente): string {
    return `${agent.nombre} ${agent.apellido}`;
  }

  clearFilters(): void {
    this.filters.set({});
    this.loadAgents();
  }

  hasActiveFilters(): boolean {
    const f = this.filters();
    return !!(f.busqueda || f.activo !== undefined || f.destacado !== undefined);
  }
}
