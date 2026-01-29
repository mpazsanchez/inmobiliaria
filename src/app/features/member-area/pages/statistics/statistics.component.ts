import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StatisticsService } from '../../../../core/services/statistics.service';
import { AuthService } from '../../services/auth.service';
import {
  PropiedadesStats,
  PropiedadesPorTipo,
  ConsultasStats,
  ConsultasPorMes,
  AsesorStats,
  PropiedadVisitas,
  PeriodoReporte,
  ExportConfig
} from '../../../../core/models';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent implements OnInit {
  private readonly statisticsService = inject(StatisticsService);
  private readonly authService = inject(AuthService);

  // Estado de carga
  isLoading = signal(true);
  exportando = signal(false);

  // Datos
  propiedadesStats = signal<PropiedadesStats | null>(null);
  propiedadesPorTipo = signal<PropiedadesPorTipo[]>([]);
  consultasStats = signal<ConsultasStats | null>(null);
  consultasPorMes = signal<ConsultasPorMes[]>([]);
  asesoresStats = signal<AsesorStats[]>([]);
  propiedadesMasVistas = signal<PropiedadVisitas[]>([]);

  // Filtros
  periodoSeleccionado = signal<PeriodoReporte>('mes');

  // Computed
  currentUser = computed(() => this.authService.getUsuario());
  isAdmin = computed(() => this.currentUser()?.rol === 'administrador');

  // Opciones de período
  periodos: { value: PeriodoReporte; label: string }[] = [
    { value: 'hoy', label: 'Hoy' },
    { value: 'semana', label: 'Esta Semana' },
    { value: 'mes', label: 'Este Mes' },
    { value: 'trimestre', label: 'Trimestre' },
    { value: 'anio', label: 'Este Año' }
  ];

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.isLoading.set(true);

    // Cargar todas las estadísticas en paralelo
    this.statisticsService.getPropiedadesStats().subscribe({
      next: (stats) => this.propiedadesStats.set(stats),
      error: (err) => console.error('Error cargando stats propiedades:', err)
    });

    this.statisticsService.getPropiedadesPorTipo().subscribe({
      next: (tipos) => this.propiedadesPorTipo.set(tipos),
      error: (err) => console.error('Error cargando tipos:', err)
    });

    this.statisticsService.getConsultasStats().subscribe({
      next: (stats) => this.consultasStats.set(stats),
      error: (err) => console.error('Error cargando stats consultas:', err)
    });

    this.statisticsService.getConsultasPorMes().subscribe({
      next: (meses) => this.consultasPorMes.set(meses),
      error: (err) => console.error('Error cargando consultas por mes:', err)
    });

    this.statisticsService.getAsesoresStats().subscribe({
      next: (asesores) => {
        this.asesoresStats.set(asesores);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando stats asesores:', err);
        this.isLoading.set(false);
      }
    });

    this.statisticsService.getPropiedadesMasVistas(5).subscribe({
      next: (props) => this.propiedadesMasVistas.set(props),
      error: (err) => console.error('Error cargando propiedades más vistas:', err)
    });
  }

  onPeriodoChange(periodo: PeriodoReporte): void {
    this.periodoSeleccionado.set(periodo);
    this.cargarEstadisticas();
  }

  // =============================================
  // EXPORTACIÓN
  // =============================================

  exportarPropiedades(): void {
    this.exportando.set(true);
    const config: ExportConfig = {
      tipo: 'propiedades',
      formato: 'csv'
    };
    this.statisticsService.exportarDatos(config).subscribe({
      next: () => this.exportando.set(false),
      error: () => this.exportando.set(false)
    });
  }

  exportarConsultas(): void {
    this.exportando.set(true);
    const config: ExportConfig = {
      tipo: 'consultas',
      formato: 'csv'
    };
    this.statisticsService.exportarDatos(config).subscribe({
      next: () => this.exportando.set(false),
      error: () => this.exportando.set(false)
    });
  }

  exportarAsesores(): void {
    this.exportando.set(true);
    const config: ExportConfig = {
      tipo: 'asesores',
      formato: 'csv'
    };
    this.statisticsService.exportarDatos(config).subscribe({
      next: () => this.exportando.set(false),
      error: () => this.exportando.set(false)
    });
  }

  // =============================================
  // HELPERS
  // =============================================

  getPerformanceClass(score: string): string {
    const classes: Record<string, string> = {
      'excelente': 'performance-excelente',
      'bueno': 'performance-bueno',
      'regular': 'performance-regular',
      'bajo': 'performance-bajo'
    };
    return classes[score] || '';
  }

  getPerformanceLabel(score: string): string {
    const labels: Record<string, string> = {
      'excelente': 'Excelente',
      'bueno': 'Bueno',
      'regular': 'Regular',
      'bajo': 'Necesita Mejorar'
    };
    return labels[score] || score;
  }

  getInitials(nombre: string): string {
    return nombre
      .split(' ')
      .map(n => n.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  // Calcular el máximo para la barra de progreso
  getMaxConsultas(): number {
    const meses = this.consultasPorMes();
    if (meses.length === 0) return 100;
    return Math.max(...meses.map(m => m.cantidad));
  }

  getBarWidth(cantidad: number): number {
    const max = this.getMaxConsultas();
    return max > 0 ? (cantidad / max) * 100 : 0;
  }
}
