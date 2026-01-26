import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface HeaderAction {
  label: string;
  icon?: string;
  route?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() badge = '';
  @Input() badgeVariant: 'admin' | 'asesor' | 'info' = 'info';
  @Input() showBackButton = false;
  @Input() backRoute = '';
  @Input() primaryAction: HeaderAction | null = null;
  @Input() secondaryActions: HeaderAction[] = [];

  @Output() primaryClick = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<HeaderAction>();
}
