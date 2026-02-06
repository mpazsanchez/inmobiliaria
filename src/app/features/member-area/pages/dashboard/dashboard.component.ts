import { Component, Input, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LeadsAdminService } from '../../services/leads-admin.service';
import { UserService } from '../../../../core/services/user.service';
import { ToastService } from '../../../../core/services/toast.service';
import { DashboardSkeletonComponent } from './dashboard-skeleton.component';
import type { Contacto } from '../../../../core/models/lead.interface';
import type { Usuario } from '../../../../core/models/user.interface';

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

interface RecentActivity {
  icon: string;
  title: string;
  description: string;
  time: string;
  color: string;
}

// Ya no usamos una interfaz local, usamos Contacto del modelo

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    DashboardSkeletonComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() user: any;
  private authService = inject(AuthService);
  private leadsService = inject(LeadsAdminService);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  showInstallerForm = false;

  // Estado de carga general
  isLoading = signal(true);

  // Modal de asignación de lead
  showAssignModal = signal(false);
  leadToAssign = signal<Contacto | null>(null);
  asesoresDisponibles = signal<Usuario[]>([]);
  selectedAsesorId = signal<number | null>(null);
  isAssigning = signal(false);

  // Computed para determinar el rol
  currentUser = computed(() => this.authService.getUsuario());
  isAdmin = computed(() => this.currentUser()?.rol === 'admin');
  isAsesor = computed(() => this.currentUser()?.rol === 'asesor');

  // Estadísticas para Asesor
  asesorStats = signal<StatCard[]>([]);

  // Estadísticas para Admin
  adminStats = signal<StatCard[]>([]);

  // Leads recientes (Asesor)
  recentLeads = signal<Contacto[]>([]);

  // Leads sin asignar (Admin)
  unassignedLeads = signal<Contacto[]>([]);

  // Actividad reciente
  recentActivity = signal<RecentActivity[]>([
    { icon: 'bi-person-check', title: 'Nuevo lead asignado', description: 'Juan Pérez - Depto Palermo', time: 'Hace 15 min', color: '#2b8b52' },
    { icon: 'bi-house-check', title: 'Propiedad actualizada', description: 'Fotos agregadas - Casa Belgrano', time: 'Hace 1 hora', color: '#1a4d2e' },
    { icon: 'bi-calendar-check', title: 'Visita programada', description: 'Mañana 10:00 AM - Recoleta', time: 'Hace 2 horas', color: '#e6962e' },
  ]);

  ngOnInit() {
    // Cargar datos del usuario actual
    const user = this.currentUser();
    if (user) {
      this.user = user;
      this.loadDashboardData();
    }
  }

  loadDashboardData() {
    const user = this.currentUser();
    if (!user) return;

    this.isLoading.set(true);

    if (this.isAdmin()) {
      this.loadAdminData();
    } else if (this.isAsesor()) {
      this.loadAsesorData();
    }
  }

  async loadAdminData() {
    try {
      // Cargar leads y stats en paralelo
      const [leadsResponse, stats] = await Promise.all([
        firstValueFrom(this.leadsService.getLeads({ 
          respondida: false,
          asesorId: undefined,
          pagina: 1,
          limite: 5
        })),
        firstValueFrom(this.leadsService.getStats())
      ]);

      // Procesar leads
      const sinAsignar = leadsResponse.datos.filter(lead => !lead.asesorId);
      this.unassignedLeads.set(sinAsignar);

      // Procesar stats
      this.adminStats.set([
        { title: 'Total Propiedades', value: 47, icon: 'bi-building', color: '#1a4d2e', trend: '+5 este mes' },
        { title: 'Leads del Mes', value: stats.total, icon: 'bi-people', color: '#e6962e', trend: `${stats.pendientes} pendientes` },
        { title: 'Asesores Activos', value: 8, icon: 'bi-person-badge', color: '#2b8b52', trend: '100% activos' },
        { title: 'Leads Respondidos', value: stats.respondidas, icon: 'bi-check-circle', color: '#1a4d2e', trend: stats.total > 0 ? `${Math.round((stats.respondidas / stats.total) * 100)}%` : '0%' }
      ]);

      this.isLoading.set(false);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      this.isLoading.set(false);
    }
  }

  async loadAsesorData() {
    const user = this.currentUser();
    if (!user) {
      this.isLoading.set(false);
      return;
    }

    try {
      // Cargar leads y stats del asesor en paralelo
      const [leadsResponse, stats] = await Promise.all([
        firstValueFrom(this.leadsService.getLeads({ 
          respondida: false,
          asesorId: user.id,
          pagina: 1,
          limite: 5
        })),
        firstValueFrom(this.leadsService.getStats(user.id))
      ]);

      // Procesar leads
      this.recentLeads.set(leadsResponse.datos);

      // Procesar stats
      this.asesorStats.set([
        { title: 'Mis Propiedades', value: 12, icon: 'bi-building', color: '#1a4d2e', trend: '+2 este mes' },
        { title: 'Leads Pendientes', value: stats.pendientes, icon: 'bi-person-lines-fill', color: '#e6962e', trend: `${stats.hoy} nuevos hoy` },
        { title: 'Leads Respondidos', value: stats.respondidas, icon: 'bi-check-circle', color: '#2b8b52', trend: 'Este mes' },
        { title: 'Total Consultas', value: stats.total, icon: 'bi-envelope', color: '#1a4d2e', trend: `${stats.estaSemana} esta semana` }
      ]);

      this.isLoading.set(false);
    } catch (error) {
      console.error('Error cargando datos del asesor:', error);
      this.isLoading.set(false);
    }
  }

  upgradeToInstaller(motivo: string) {
    // TODO: Implementar llamada al servicio para actualizar rol
    console.log('Solicitud de upgrade a instalador:', motivo);
    this.showInstallerForm = false;
  }

  getLeadStatusClass(estado: string): string {
    const classes: Record<string, string> = {
      'pendiente': 'status-pending',
      'respondido': 'status-responded',
      'convertido': 'status-converted'
    };
    return classes[estado] || '';
  }

  getLeadStatusText(estado: string): string {
    const texts: Record<string, string> = {
      'pendiente': 'Pendiente',
      'respondido': 'Respondido',
      'convertido': 'Convertido'
    };
    return texts[estado] || estado;
  }

  // Métodos para formatear datos de leads
  getTimeAgo(fecha: string): string {
    return this.leadsService.getTimeAgo(fecha);
  }

  getPropertyTitle(propiedadId: number): string {
    // Por ahora retornamos un placeholder
    // Cuando tengas el servicio de propiedades, lo puedes integrar aquí
    return `Propiedad #${propiedadId}`;
  }

  // ========== Modal de asignación ==========

  openAssignModal(lead: Contacto): void {
    this.leadToAssign.set(lead);
    this.selectedAsesorId.set(null);
    this.loadAsesores();
    this.showAssignModal.set(true);
  }

  closeAssignModal(): void {
    this.showAssignModal.set(false);
    this.leadToAssign.set(null);
    this.selectedAsesorId.set(null);
  }

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

  assignLead(): void {
    const lead = this.leadToAssign();
    const asesorId = this.selectedAsesorId();

    if (!lead || !asesorId) return;

    this.isAssigning.set(true);

    this.leadsService.assignToAgent(lead.id, asesorId).subscribe({
      next: () => {
        // Remover el lead de la lista de sin asignar
        const currentLeads = this.unassignedLeads();
        this.unassignedLeads.set(currentLeads.filter(l => l.id !== lead.id));
        
        // Obtener nombre del asesor
        const asesor = this.asesoresDisponibles().find(a => a.id === asesorId);
        const asesorName = asesor ? `${asesor.nombre} ${asesor.apellido}` : 'el asesor';
        
        this.toastService.success(`Consulta asignada a ${asesorName} correctamente`);
        this.closeAssignModal();
        this.isAssigning.set(false);
      },
      error: (err: unknown) => {
        console.error('Error al asignar lead:', err);
        this.toastService.error('Error al asignar la consulta. Por favor, intenta nuevamente.');
        this.isAssigning.set(false);
      }
    });
  }

  getAsesorFullName(asesor: Usuario): string {
    return `${asesor.nombre} ${asesor.apellido}`;
  }
}
