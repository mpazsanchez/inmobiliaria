import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  @Input() icon = 'bi-inbox';
  @Input() title = 'Sin datos';
  @Input() message = '';
  @Input() compact = false;

  // Acción primaria
  @Input() primaryActionText = '';
  @Input() primaryActionIcon = 'bi-plus-lg';
  @Input() primaryActionRoute: string | null = null;
  @Output() primaryAction = new EventEmitter<void>();

  // Limpiar filtros
  @Input() showClearFilters = false;
  @Input() clearFiltersText = 'Limpiar filtros';
  @Output() clearFilters = new EventEmitter<void>();
}
