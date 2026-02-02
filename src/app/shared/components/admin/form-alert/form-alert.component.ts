import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertType = 'error' | 'success' | 'warning' | 'info';

/**
 * Componente reutilizable para alertas en formularios
 * Soporta diferentes tipos y es dismissible
 */
@Component({
  selector: 'app-form-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-alert.component.html',
  styleUrls: ['./form-alert.component.scss']
})
export class FormAlertComponent {
  /** Mensaje a mostrar */
  message = input<string | null>(null);
  
  /** Tipo de alerta */
  type = input<AlertType>('error');
  
  /** Si se puede cerrar */
  dismissible = input<boolean>(true);
  
  /** Evento al cerrar */
  dismiss = output<void>();
  
  getIcon(): string {
    const icons: Record<AlertType, string> = {
      error: 'exclamation-triangle',
      success: 'check-circle',
      warning: 'exclamation-circle',
      info: 'info-circle'
    };
    return icons[this.type()];
  }
}
