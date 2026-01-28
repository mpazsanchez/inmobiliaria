import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Notificacion } from '../../../../core/models/notificacion.interface';

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.scss'
})
export class NotificationCardComponent {
  @Input({ required: true }) notification!: Notificacion;
  @Input() clickable: boolean = true;
  @Input() showActions: boolean = true;
  
  @Output() notificationClick = new EventEmitter<Notificacion>();
  @Output() deleteClick = new EventEmitter<number>();

  onCardClick(): void {
    if (this.clickable) {
      this.notificationClick.emit(this.notification);
    }
  }

  onDeleteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.deleteClick.emit(this.notification.id);
  }

  getColorPrioridad(prioridad: string): string {
    const colores: { [key: string]: string } = {
      urgente: 'urgente',
      alta: 'alta',
      media: 'media',
      baja: 'baja'
    };
    return colores[prioridad] || 'media';
  }

  getIconoClase(): string {
    if (this.notification.icono) {
      return this.notification.icono;
    }
    return this.getIconoPorTipo(this.notification.tipo);
  }

  private getIconoPorTipo(tipo: string): string {
    const iconos: { [key: string]: string } = {
      nueva_consulta: 'bi-envelope',
      propiedad_vendida: 'bi-house-check',
      propiedad_alquilada: 'bi-key',
      nuevo_usuario: 'bi-person-plus',
      usuario_pendiente: 'bi-person-exclamation',
      asignacion_lead: 'bi-person-check',
      vencimiento_propiedad: 'bi-clock-history',
      sistema: 'bi-gear'
    };
    return iconos[tipo] || 'bi-bell';
  }

  getTiempoTranscurrido(fecha: string): string {
    const ahora = new Date();
    const fechaNotif = new Date(fecha);
    const diff = ahora.getTime() - fechaNotif.getTime();
    
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 1) return 'Ahora';
    if (minutos < 60) return `Hace ${minutos}m`;
    if (horas < 24) return `Hace ${horas}h`;
    if (dias === 1) return 'Ayer';
    if (dias < 7) return `Hace ${dias}d`;
    return fechaNotif.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }

  getFechaCompleta(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
