import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente reutilizable para estado de carga
 * Muestra spinner animado con mensaje
 */
@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-state.component.html',
  styleUrls: ['./loading-state.component.scss']
})
export class LoadingStateComponent {
  /** Mensaje a mostrar (default: 'Cargando...') */
  message = input<string>('Cargando...');
}
