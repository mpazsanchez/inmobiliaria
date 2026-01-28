import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificacionesService } from '../../../../core/services/notificaciones.service';
import { Notificacion, TipoNotificacion, PrioridadNotificacion } from '../../../../core/models/notificacion.interface';
import { 
  PageHeaderComponent, 
  StatsGridComponent, 
  StatCardConfig, 
  NotificationCardComponent 
} from '../../../../shared/components/admin';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    PageHeaderComponent, 
    StatsGridComponent,
    NotificationCardComponent
  ],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss'
})
export class NotificationsPageComponent implements OnInit {
  private notificacionesService = inject(NotificacionesService);

  // Estado
  notificaciones = this.notificacionesService.notificaciones;
  resumen = this.notificacionesService.resumen;
  
  filtroTipo = signal<TipoNotificacion | 'todas'>('todas');
  filtroLeida = signal<boolean | 'todas'>('todas');
  filtroPrioridad = signal<PrioridadNotificacion | 'todas'>('todas');

  // Computed para stats
  private totalNotificaciones = computed(() => this.resumen().total);
  private noLeidasNotificaciones = computed(() => this.resumen().noLeidas);
  private leidasNotificaciones = computed(() => this.resumen().total - this.resumen().noLeidas);

  // Configuración de stats cards
  get stats(): StatCardConfig[] {
    return [
      {
        value: this.totalNotificaciones(),
        label: 'Total',
        icon: 'bi-bell',
        variant: 'primary'
      },
      {
        value: this.noLeidasNotificaciones(),
        label: 'Sin Leer',
        icon: 'bi-bell-fill',
        variant: 'warning'
      },
      {
        value: this.leidasNotificaciones(),
        label: 'Leídas',
        icon: 'bi-check-all',
        variant: 'success'
      }
    ];
  }

  // Configuración de filtros
  filters = [
    {
      model: 'tipo',
      getValue: () => this.filtroTipo(),
      setValue: (value: any) => this.filtroTipo.set(value),
      options: [
        { value: 'todas', label: 'Todos los tipos' },
        { value: 'nueva_consulta', label: 'Nuevas Consultas' },
        { value: 'asignacion_lead', label: 'Asignaciones' },
        { value: 'propiedad_vendida', label: 'Propiedades Vendidas' },
        { value: 'propiedad_alquilada', label: 'Propiedades Alquiladas' },
        { value: 'nuevo_usuario', label: 'Nuevos Usuarios' },
        { value: 'vencimiento_propiedad', label: 'Vencimientos' }
      ]
    },
    {
      model: 'leida',
      getValue: () => this.filtroLeida(),
      setValue: (value: any) => this.filtroLeida.set(value),
      options: [
        { value: 'todas', label: 'Todas' },
        { value: false, label: 'Sin leer' },
        { value: true, label: 'Leídas' }
      ]
    },
    {
      model: 'prioridad',
      getValue: () => this.filtroPrioridad(),
      setValue: (value: any) => this.filtroPrioridad.set(value),
      options: [
        { value: 'todas', label: 'Todas las prioridades' },
        { value: 'urgente', label: 'Urgente' },
        { value: 'alta', label: 'Alta' },
        { value: 'media', label: 'Media' },
        { value: 'baja', label: 'Baja' }
      ]
    }
  ];

  // Computed
  notificacionesFiltradas = computed(() => {
    let resultado = this.notificaciones();

    if (this.filtroTipo() !== 'todas') {
      resultado = resultado.filter(n => n.tipo === this.filtroTipo());
    }

    if (this.filtroLeida() !== 'todas') {
      resultado = resultado.filter(n => n.leida === this.filtroLeida());
    }

    if (this.filtroPrioridad() !== 'todas') {
      resultado = resultado.filter(n => n.prioridad === this.filtroPrioridad());
    }

    return resultado;
  });

  ngOnInit(): void {
    // Las notificaciones se cargan automáticamente por el servicio
  }

  onNotificacionClick(notificacion: Notificacion): void {
    if (!notificacion.leida) {
      this.notificacionesService.marcarComoLeida(notificacion.id).subscribe();
    }
  }

  marcarTodasLeidas(): void {
    this.notificacionesService.marcarTodasComoLeidas().subscribe();
  }

  eliminarNotificacion(id: number): void {
    this.notificacionesService.eliminarNotificacion(id).subscribe();
  }

  limpiarFiltros(): void {
    this.filtroTipo.set('todas');
    this.filtroLeida.set('todas');
    this.filtroPrioridad.set('todas');
  }
}
