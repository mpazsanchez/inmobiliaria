import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss'],
  imports: [RouterModule, CommonModule]
})
export class DashboardCardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() link: string | null = null;
  @Input() icon: string | null = null;
  @Input() buttonText: string | null = null;
  @Output() action = new EventEmitter<void>();
}
