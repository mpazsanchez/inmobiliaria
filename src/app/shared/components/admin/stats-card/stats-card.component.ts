import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatCardConfig {
  value: number | string;
  label: string;
  icon: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  subInfo?: string;
  active?: boolean;
  clickable?: boolean;
}

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent {
  @Input() value: number | string = 0;
  @Input() label = '';
  @Input() icon = 'bi-bar-chart';
  @Input() variant: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default' = 'primary';
  @Input() trend?: { value: number; direction: 'up' | 'down' | 'neutral' };
  @Input() subInfo?: string;
  @Input() active = false;
  @Input() clickable = false;
  @Output() cardClick = new EventEmitter<void>();

  onClick(): void {
    if (this.clickable) {
      this.cardClick.emit();
    }
  }

  getTrendIcon(): string {
    switch (this.trend?.direction) {
      case 'up': return 'bi-arrow-up';
      case 'down': return 'bi-arrow-down';
      default: return 'bi-dash';
    }
  }
}
