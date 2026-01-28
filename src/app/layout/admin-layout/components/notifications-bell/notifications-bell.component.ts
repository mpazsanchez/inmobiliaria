import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificacionesService } from '../../../../core/services/notificaciones.service';
import { Notificacion } from '../../../../core/models/notificacion.interface';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-notifications-bell',
  standalone: true,
  imports: [CommonModule, RouterModule, ClickOutsideDirective],
  templateUrl: './notifications-bell.component.html',
  styleUrl: './notifications-bell.component.scss'
})
export class NotificationsBellComponent implements OnInit {
  private notificacionesService = inject(NotificacionesService);

  // Estado
  dropdownOpen = signal(false);
  notificaciones = this.notificacionesService.notificaciones;
  resumen = this.notificacionesService.resumen;

  // Computed
  notificacionesRecientes = computed(() => 
    this.notificaciones().slice(0, 5)
  );

  noLeidas = computed(() => 
    this.notificaciones().filter(n => !n.leida)
  );

  hayNoLeidas = computed(() => 
    this.noLeidas().length > 0
  );

  ngOnInit(): void {
    // Las notificaciones se cargan automáticamente por el servicio
  }

  toggleDropdown(): void {
    this.dropdownOpen.update(v => !v);
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  onNotificacionClick(notificacion: Notificacion): void {
    // Marcar como leída si no lo está
    if (!notificacion.leida) {
      this.notificacionesService.marcarComoLeida(notificacion.id).subscribe();
    }
    
    // Cerrar dropdown
    this.closeDropdown();
    
    // La navegación se hace por routerLink en el template
  }

  marcarTodasLeidas(): void {
    this.notificacionesService.marcarTodasComoLeidas().subscribe();
  }

  eliminarNotificacion(event: Event, id: number): void {
    event.stopPropagation(); // Evitar que se dispare el click de la notificación
    this.notificacionesService.eliminarNotificacion(id).subscribe();
  }

  getIconoClase(notificacion: Notificacion): string {
    return notificacion.icono || this.getIconoPorTipo(notificacion.tipo);
  }

  private getIconoPorTipo(tipo: string): string {
    const iconos: { [key: string]: string } = {
      nueva_consulta: 'bi-envelope',
      propiedad_vendida: 'bi-house-check',
      propiedad_alquilada: 'bi-key',
      nuevo_usuario: 'bi-person-plus',
      usuario_pendiente: 'bi-person-exclamation',
      asignacion_lead: 'bi-person-check',
      mensaje_nuevo: 'bi-chat-dots',
      propiedad_destacada: 'bi-star',
      vencimiento_propiedad: 'bi-clock-history',
      sistema: 'bi-info-circle'
    };
    return iconos[tipo] || 'bi-bell';
  }

  getColorPrioridad(prioridad: string): string {
    const colores: { [key: string]: string } = {
      urgente: 'priority-urgent',
      alta: 'priority-high',
      media: 'priority-medium',
      baja: 'priority-low'
    };
    return colores[prioridad] || 'priority-low';
  }

  getTiempoTranscurrido(fecha: string): string {
    const now = new Date();
    const notifDate = new Date(fecha);
    const diff = now.getTime() - notifDate.getTime();
    
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);
    
    if (minutos < 1) return 'Ahora';
    if (minutos < 60) return `${minutos} min`;
    if (horas < 24) return `${horas}h`;
    if (dias === 1) return 'Ayer';
    if (dias < 7) return `${dias} días`;
    return notifDate.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  }
}
