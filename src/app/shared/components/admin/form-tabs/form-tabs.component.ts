import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
  isValid?: () => boolean;
}

/**
 * Componente reutilizable para navegación de tabs en formularios
 * Muestra tabs con validación visual
 */
@Component({
  selector: 'app-form-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="form-tabs">
      @for (tab of tabs(); track tab.id) {
        <button
          type="button"
          [class.active]="activeTab() === tab.id"
          [class.valid]="tab.isValid ? tab.isValid() : false"
          (click)="tabChange.emit(tab.id)">
          <i [class]="'bi bi-' + tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      }
    </nav>
  `,
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
