import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChartBarData {
  label: string;
  value: number;
  color?: string;
}

@Component({
  selector: 'app-chart-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss']
})
export class ChartBarComponent {
  title = input.required<string>();
  icon = input<string>('bar-chart');
  data = input.required<ChartBarData[]>();
  maxValue = computed(() => {
    const values = this.data().map(d => d.value);
    return Math.max(...values, 1);
  });

  getBarWidth(value: number): number {
    return (value / this.maxValue()) * 100;
  }

  getColor(item: ChartBarData): string {
    return item.color || '#1a4d2e';
  }
}
