import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AdvisorStats {
  asesorId: string | number;
  nombre: string;
  fotoUrl?: string;
  ranking?: number;
  propiedadesActivas: number;
  propiedadesVendidas: number;
  propiedadesAlquiladas: number;
  consultasRecibidas: number;
  consultasRespondidas: number;
  consultasConvertidas: number;
  tasaConversion: number;
  tiempoPromedioRespuesta: string;
  performanceScore: 'excelente' | 'bueno' | 'regular' | 'bajo';
}

const PERFORMANCE_CONFIG = {
  excelente: { label: 'Excelente', class: 'excellent' },
  bueno: { label: 'Bueno', class: 'good' },
  regular: { label: 'Promedio', class: 'average' },
  bajo: { label: 'Bajo', class: 'poor' }
} as const;

@Component({
  selector: 'app-advisors-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advisors-table.component.html',
  styleUrls: ['./advisors-table.component.scss']
})
export class AdvisorsTableComponent {
  advisors = input.required<AdvisorStats[]>();

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getPerformanceConfig(score: 'excelente' | 'bueno' | 'regular' | 'bajo') {
    return PERFORMANCE_CONFIG[score];
  }
}
