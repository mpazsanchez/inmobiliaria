import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { StatsGridComponent } from '../../../../shared/components/admin/stats-grid/stats-grid.component';
import { StatCardConfig } from '../../../../shared/components/admin/stats-card/stats-card.component';
import { ChartBarComponent, ChartBarData } from '../../components/chart-bar/chart-bar.component';
import { PropertyRankingComponent } from '../../components/property-ranking/property-ranking.component';
import { AdvisorsTableComponent } from '../../components/advisors-table/advisors-table.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatsGridComponent,
    ChartBarComponent,
    PropertyRankingComponent,
    AdvisorsTableComponent
  ],
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
  isAdmin = computed(() => this.currentUser()?.rol === 'admin');

  // Computed para formato StatsGridComponent - Propiedades
  propiedadesCardsFormatted = computed((): StatCardConfig[] => {
    const stats = this.propiedadesStats();
    if (!stats) return [];

    const total = stats.totalActivas + stats.vendidas + stats.alquiladas + stats.reservadas;
    const porcentajeActivas = total > 0 ? Math.round((stats.totalActivas / total) * 100) : 0;

    return [
      {
        value: stats.totalActivas || 0,
        label: 'Activas',
        icon: 'bi-house-check',
        variant: 'primary',
        subInfo: `${porcentajeActivas}% del total`
      },
      {
        value: stats.enVenta || 0,
        label: 'En Venta',
        icon: 'bi-tag',
        variant: 'success'
      },
      {
        value: stats.enAlquiler || 0,
        label: 'En Alquiler',
        icon: 'bi-key',
        variant: 'info'
      },
      {
        value: stats.vendidas || 0,
        label: 'Vendidas',
        icon: 'bi-check-circle',
        variant: 'success',
        trend: {
          value: stats.vendidasEsteMes || 0,
          direction: 'up'
        },
        subInfo: `${stats.vendidasEsteMes || 0} este mes`
      },
      {
        value: stats.alquiladas || 0,
        label: 'Alquiladas',
        icon: 'bi-check-square',
        variant: 'info',
        trend: {
          value: stats.alquiladasEsteMes || 0,
          direction: 'up'
        },
        subInfo: `${stats.alquiladasEsteMes || 0} este mes`
      },
      {
        value: stats.reservadas || 0,
        label: 'Reservadas',
        icon: 'bi-bookmark',
        variant: 'warning'
      }
    ];
  });

  // Computed para formato StatsGridComponent - Consultas
  consultasCardsFormatted = computed((): StatCardConfig[] => {
    const stats = this.consultasStats();
    if (!stats) return [];

    return [
      {
        value: stats.totalConsultas || 0,
        label: 'Total Consultas',
        icon: 'bi-chat-square-text',
        variant: 'primary',
        subInfo: `${stats.consultasEsteMes || 0} este mes`
      },
      {
        value: stats.pendientes || 0,
        label: 'Pendientes',
        icon: 'bi-clock-history',
        variant: 'warning'
      },
      {
        value: stats.respondidas || 0,
        label: 'Respondidas',
        icon: 'bi-check2-all',
        variant: 'success',
        subInfo: `${stats.tasaRespuesta || 0}% tasa`
      },
      {
        value: stats.convertidas || 0,
        label: 'Convertidas',
        icon: 'bi-trophy',
        variant: 'success',
        trend: {
          value: stats.tasaConversion || 0,
          direction: 'up'
        },
        subInfo: `${stats.tasaConversion || 0}% conversión`
      },
      {
        value: stats.tiempoPromedioRespuesta || '0h',
        label: 'Tiempo Resp.',
        icon: 'bi-stopwatch',
        variant: 'info'
      }
    ];
  });

  // Computed para chart de consultas por mes
  consultasPorMesChart = computed((): ChartBarData[] => {
    return this.consultasPorMes().map(mes => ({
      label: mes.mes,
      value: mes.cantidad,
      color: '#5b9a8b' // Verde suave
    }));
  });

  // Computed para chart de propiedades por tipo
  propiedadesPorTipoChart = computed((): ChartBarData[] => {
    // Paleta de colores suaves y armoniosos
    const colors: Record<string, string> = {
      'Casa': '#5b9a8b',        // Verde suave
      'Departamento': '#7eb8a8', // Verde menta
      'Terreno': '#7cafc4',      // Azul suave
      'Local Comercial': '#d4a574', // Naranja suave
      'Oficina': '#a8a4ce'       // Lavanda suave
    };

    return this.propiedadesPorTipo().map(tipo => ({
      label: tipo.tipo,
      value: tipo.cantidad,
      color: colors[tipo.tipo] || '#5b9a8b'
    }));
  });

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
}
