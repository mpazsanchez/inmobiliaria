import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
  isValid?: () => boolean;
  hideIf?: () => boolean;
}

/**
 * Componente reutilizable para navegación de tabs en formularios
 * Muestra tabs con validación visual
 */
@Component({
  selector: 'app-form-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-tabs.component.html',
  styleUrls: ['./form-tabs.component.scss']
})
export class FormTabsComponent {
  /** Configuración de tabs */
  tabs = input.required<TabConfig[]>();
  
  /** Tab actualmente seleccionado */
  activeTab = input.required<string>();
  
  /** Evento al cambiar de tab */
  tabChange = output<string>();
}
