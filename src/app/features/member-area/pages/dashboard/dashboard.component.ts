import { Component, Input, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

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

interface Lead {
  id: number;
  nombre: string;
  propiedad: string;
  tipo: string;
  fecha: string;
  estado: 'pendiente' | 'respondido' | 'convertido';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() user: any;
  private authService = inject(AuthService);
  showInstallerForm = false;

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
  recentLeads = signal<Lead[]>([
    { id: 1, nombre: 'Juan Pérez', propiedad: 'Depto 2 amb - Palermo', tipo: 'Consulta', fecha: 'Hoy 14:30', estado: 'pendiente' },
    { id: 2, nombre: 'Ana García', propiedad: 'Casa 3 amb - Belgrano', tipo: 'Visita', fecha: 'Hoy 10:15', estado: 'pendiente' },
    { id: 3, nombre: 'Carlos López', propiedad: 'Depto 1 amb - Recoleta', tipo: 'Consulta', fecha: 'Ayer 18:00', estado: 'respondido' },
  ]);

  // Leads sin asignar (Admin)
  unassignedLeads = signal<Lead[]>([
    { id: 10, nombre: 'Martín Rojas', propiedad: 'Casa 4 amb - San Isidro', tipo: 'Consulta', fecha: 'Hace 2 horas', estado: 'pendiente' },
    { id: 11, nombre: 'Laura Mendoza', propiedad: 'Depto 2 amb - Puerto Madero', tipo: 'Visita', fecha: 'Hace 4 horas', estado: 'pendiente' },
    { id: 12, nombre: 'Diego Silva', propiedad: 'PH 3 amb - Villa Crespo', tipo: 'Consulta', fecha: 'Hoy 09:00', estado: 'pendiente' },
  ]);

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
}
