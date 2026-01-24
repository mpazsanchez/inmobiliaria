import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardComponent, StatCardConfig } from '../stats-card/stats-card.component';

@Component({
  selector: 'app-stats-grid',
  standalone: true,
  imports: [CommonModule, StatsCardComponent],
  templateUrl: './stats-grid.component.html',
  styleUrls: ['./stats-grid.component.scss']
})
export class StatsGridComponent {
  @Input() stats: StatCardConfig[] = [];
  @Input() minCardWidth = '200px';
  @Input() onStatClick: (stat: StatCardConfig) => void = () => {};
}
