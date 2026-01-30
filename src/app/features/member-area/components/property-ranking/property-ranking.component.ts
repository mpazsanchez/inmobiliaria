import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface RankingItem {
  titulo: string;
  visitas: number;
  compartidos: number;
  tasaConversion: number;
}

@Component({
  selector: 'app-property-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-ranking.component.html',
  styleUrls: ['./property-ranking.component.scss']
})
export class PropertyRankingComponent {
  title = input.required<string>();
  icon = input<string>('eye');
  items = input.required<RankingItem[]>();
}
