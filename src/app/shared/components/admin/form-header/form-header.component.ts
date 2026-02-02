import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Componente reutilizable para header de formularios del admin
 * Muestra título, ícono y link de retorno
 */
@Component({
  selector: 'app-form-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss']
})
export class FormHeaderComponent {
  /** Ruta a la que debe volver el botón atrás */
  backLink = input.required<string>();
  
  /** Texto del botón atrás (default: 'Volver') */
  backText = input<string>('Volver');
  
  /** Título del formulario */
  title = input.required<string>();
  
  /** Ícono de Bootstrap Icons (sin prefijo 'bi-') */
  icon = input.required<string>();
}
