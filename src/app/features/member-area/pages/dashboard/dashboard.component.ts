import { Component, Input, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LeadsAdminService } from '../../services/leads-admin.service';
import { UserService } from '../../../../core/services/user.service';
import { ToastService } from '../../../../core/services/toast.service';
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
    FormsModule
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
  asesorStats = signal<StatCard[]>([
    { title: 'Mis Propiedades', value: 12, icon: 'bi-building', color: '#1a4d2e', trend: '+2 este mes' },
    { title: 'Leads Pendientes', value: 8, icon: 'bi-person-lines-fill', color: '#e6962e', trend: '3 nuevos hoy' },
    { title: 'Visitas Programadas', value: 5, icon: 'bi-calendar-check', color: '#2b8b52', trend: 'Esta semana' },
    { title: 'Conversión', value: '68%', icon: 'bi-graph-up-arrow', color: '#1a4d2e', trend: '+5%', trendUp: true }
  ]);

  // Estadísticas para Admin
  adminStats = signal<StatCard[]>([
    { title: 'Total Propiedades', value: 47, icon: 'bi-building', color: '#1a4d2e', trend: '+5 este mes' },
    { title: 'Leads del Mes', value: 124, icon: 'bi-people', color: '#e6962e', trend: '89 respondidos' },
    { title: 'Asesores Activos', value: 8, icon: 'bi-person-badge', color: '#2b8b52', trend: '100% activos' },
    { title: 'Conversión Global', value: '64%', icon: 'bi-graph-up', color: '#1a4d2e', trend: '+3%', trendUp: true }
  ]);

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
      this.loadLeads();
    }
  }

  loadLeads() {
    const user = this.currentUser();
    if (!user) return;

    if (this.isAdmin()) {
      // Admin: Cargar últimas 5 consultas sin asignar para preview
      this.leadsService.getLeads({ 
        respondida: false,
        asesorId: undefined,
        pagina: 1,
        limite: 5 // Preview de 5 más recientes
      }).subscribe({
        next: (response) => {
          // Filtrar solo los que no tienen asesor
          const sinAsignar = response.datos.filter(lead => !lead.asesorId);
          this.unassignedLeads.set(sinAsignar);
        },
        error: (error) => {
          console.error('Error cargando leads sin asignar:', error);
        }
      });
    } else if (this.isAsesor()) {
      // Asesor: Cargar sus últimas 5 consultas pendientes
      this.leadsService.getLeads({ 
        respondida: false,
        asesorId: user.id,
        pagina: 1,
        limite: 5 // Preview de 5 más recientes
      }).subscribe({
        next: (response) => {
          this.recentLeads.set(response.datos);
        },
        error: (error) => {
          console.error('Error cargando leads del asesor:', error);
        }
      });
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
