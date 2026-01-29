import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PropiedadesStats,
  PropiedadesPorTipo,
  ConsultasStats,
  ConsultasPorMes,
  AsesorStats,
  ResumenEstadisticas,
  PropiedadVisitas,
  FiltrosReporte,
  ExportConfig,
  ExportResult
} from '../models/statistics.interface';
import { PropertyService } from './property.service';
import { AgentService } from './agent.service';
import { LeadService } from './lead.service';

/**
 * Servicio de Estadísticas y Reportes para Fairway Inmobiliaria
 *
 * Este servicio proporciona:
 * - Estadísticas de propiedades (activas, vendidas, por tipo, etc.)
 * - Estadísticas de consultas/leads
 * - Métricas de desempeño de asesores
 * - Exportación de datos a CSV
 *
 * TODO: Conectar con API real cuando esté disponible
 * Por ahora calcula estadísticas a partir de los datos mock existentes
 */
@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private readonly apiUrl = `${environment.apiUrl}/estadisticas`;
  private readonly http = inject(HttpClient);
  private readonly propertyService = inject(PropertyService);
  private readonly agentService = inject(AgentService);
  private readonly leadService = inject(LeadService);

  // Flag para usar mock data (cambiar a false cuando la API esté lista)
  private readonly useMockData = true;

  // =============================================
  // ESTADÍSTICAS DE PROPIEDADES
  // =============================================

  /**
   * Obtiene estadísticas generales de propiedades
   */
  getPropiedadesStats(filtros?: FiltrosReporte): Observable<PropiedadesStats> {
    if (this.useMockData) {
      return this.calcularPropiedadesStatsMock();
    }
    return this.http.get<PropiedadesStats>(`${this.apiUrl}/propiedades`, { params: filtros as any });
  }

  /**
   * Obtiene propiedades agrupadas por tipo
   */
  getPropiedadesPorTipo(): Observable<PropiedadesPorTipo[]> {
    if (this.useMockData) {
      return this.calcularPropiedadesPorTipoMock();
    }
    return this.http.get<PropiedadesPorTipo[]>(`${this.apiUrl}/propiedades/por-tipo`);
  }

  /**
   * Obtiene las propiedades más vistas (requiere tracking implementado)
   */
  getPropiedadesMasVistas(limite: number = 10): Observable<PropiedadVisitas[]> {
    if (this.useMockData) {
      return this.getPropiedadesMasVistasMock(limite);
    }
    return this.http.get<PropiedadVisitas[]>(`${this.apiUrl}/propiedades/mas-vistas`, {
      params: { limite }
    });
  }

  // =============================================
  // ESTADÍSTICAS DE CONSULTAS/LEADS
  // =============================================

  /**
   * Obtiene estadísticas de consultas
   */
  getConsultasStats(filtros?: FiltrosReporte): Observable<ConsultasStats> {
    if (this.useMockData) {
      return this.calcularConsultasStatsMock();
    }
    return this.http.get<ConsultasStats>(`${this.apiUrl}/consultas`, { params: filtros as any });
  }

  /**
   * Obtiene consultas agrupadas por mes (últimos 12 meses)
   */
  getConsultasPorMes(): Observable<ConsultasPorMes[]> {
    if (this.useMockData) {
      return this.getConsultasPorMesMock();
    }
    return this.http.get<ConsultasPorMes[]>(`${this.apiUrl}/consultas/por-mes`);
  }

  // =============================================
  // ESTADÍSTICAS DE ASESORES
  // =============================================

  /**
   * Obtiene estadísticas de desempeño de asesores
   */
  getAsesoresStats(filtros?: FiltrosReporte): Observable<AsesorStats[]> {
    if (this.useMockData) {
      return this.calcularAsesoresStatsMock();
    }
    return this.http.get<AsesorStats[]>(`${this.apiUrl}/asesores`, { params: filtros as any });
  }

  /**
   * Obtiene estadísticas de un asesor específico
   */
  getAsesorStats(asesorId: number, filtros?: FiltrosReporte): Observable<AsesorStats | null> {
    if (this.useMockData) {
      return this.calcularAsesoresStatsMock().pipe(
        map(asesores => asesores.find(a => a.asesorId === asesorId) || null)
      );
    }
    return this.http.get<AsesorStats>(`${this.apiUrl}/asesores/${asesorId}`, { params: filtros as any });
  }

  // =============================================
  // RESUMEN EJECUTIVO
  // =============================================

  /**
   * Obtiene resumen completo de estadísticas para el dashboard
   */
  getResumenEstadisticas(): Observable<ResumenEstadisticas> {
    if (this.useMockData) {
      return forkJoin({
        propiedades: this.calcularPropiedadesStatsMock(),
        consultas: this.calcularConsultasStatsMock(),
        topAsesores: this.calcularAsesoresStatsMock().pipe(map(a => a.slice(0, 5))),
        propiedadesMasVistas: this.getPropiedadesMasVistasMock(5)
      }).pipe(
        map(data => ({
          ...data,
          ultimaActualizacion: new Date().toISOString()
        }))
      );
    }
    return this.http.get<ResumenEstadisticas>(`${this.apiUrl}/resumen`);
  }

  // =============================================
  // EXPORTACIÓN DE DATOS
  // =============================================

  /**
   * Exporta datos a CSV
   */
  exportarDatos(config: ExportConfig): Observable<ExportResult> {
    if (this.useMockData) {
      return this.exportarDatosMock(config);
    }
    return this.http.post<ExportResult>(`${this.apiUrl}/exportar`, config);
  }

  /**
   * Genera y descarga un archivo CSV
   */
  descargarCSV(datos: any[], nombreArchivo: string, columnas?: string[]): void {
    const headers = columnas || Object.keys(datos[0] || {});
    const csvContent = this.generarCSV(datos, headers);
    this.descargarArchivo(csvContent, `${nombreArchivo}.csv`, 'text/csv');
  }

  // =============================================
  // MÉTODOS MOCK (Para desarrollo sin API)
  // =============================================

  private calcularPropiedadesStatsMock(): Observable<PropiedadesStats> {
    return this.propertyService.getPropiedades({}).pipe(
      map(response => {
        const propiedades = response.datos;
        const mesActual = new Date().getMonth();
        const anioActual = new Date().getFullYear();

        const enVenta = propiedades.filter(p => p.operacion === 'venta' && p.estado === 'disponible').length;
        const enAlquiler = propiedades.filter(p => p.operacion === 'alquiler' && p.estado === 'disponible').length;
        const vendidas = propiedades.filter(p => p.estado === 'vendido').length;
        const alquiladas = propiedades.filter(p => p.estado === 'alquilado').length;
        const reservadas = propiedades.filter(p => p.estado === 'reservado').length;

        // Simulación de estadísticas mensuales
        const vendidasEsteMes = Math.floor(vendidas * 0.3);
        const alquiladasEsteMes = Math.floor(alquiladas * 0.4);
        const nuevasEsteMes = Math.floor(propiedades.length * 0.2);

        return {
          totalActivas: enVenta + enAlquiler,
          enVenta,
          enAlquiler,
          vendidas,
          alquiladas,
          reservadas,
          vendidasEsteMes,
          alquiladasEsteMes,
          nuevasEsteMes
        };
      })
    );
  }

  private calcularPropiedadesPorTipoMock(): Observable<PropiedadesPorTipo[]> {
    return this.propertyService.getPropiedades({}).pipe(
      map(response => {
        const propiedades = response.datos;
        const total = propiedades.length;
        const tiposMap = new Map<string, number>();

        propiedades.forEach(p => {
          const count = tiposMap.get(p.tipoPropiedad) || 0;
          tiposMap.set(p.tipoPropiedad, count + 1);
        });

        const tiposLabels: Record<string, string> = {
          'casa': 'Casa',
          'departamento': 'Departamento',
          'ph': 'PH',
          'oficina': 'Oficina',
          'local': 'Local Comercial',
          'terreno': 'Terreno'
        };

        return Array.from(tiposMap.entries()).map(([tipo, cantidad]) => ({
          tipo,
          label: tiposLabels[tipo] || tipo,
          cantidad,
          porcentaje: Math.round((cantidad / total) * 100)
        })).sort((a, b) => b.cantidad - a.cantidad);
      })
    );
  }

  private getPropiedadesMasVistasMock(limite: number): Observable<PropiedadVisitas[]> {
    return this.propertyService.getPropiedades({ limite }).pipe(
      map(response => {
        // Simulamos visitas aleatorias para demostración
        return response.datos.slice(0, limite).map((p, index) => ({
          propiedadId: p.id,
          titulo: p.titulo,
          visitas: Math.floor(Math.random() * 500) + 50,
          compartidos: Math.floor(Math.random() * 50) + 5,
          consultasGeneradas: Math.floor(Math.random() * 20) + 1,
          tasaConversion: Math.round(Math.random() * 15 + 3)
        })).sort((a, b) => b.visitas - a.visitas);
      })
    );
  }

  private calcularConsultasStatsMock(): Observable<ConsultasStats> {
    return this.leadService.getInquiries({}).pipe(
      map(response => {
        const leads = response.datos;
        const total = leads.length;
        const pendientes = leads.filter(l => !l.respondida).length;
        const respondidas = leads.filter(l => l.respondida).length;

        // Simulación de estadísticas
        const convertidas = Math.floor(respondidas * 0.35);
        const consultasEsteMes = Math.floor(total * 0.4);
        const consultasSemana = Math.floor(consultasEsteMes * 0.25);
        const consultasHoy = Math.floor(consultasSemana * 0.15);

        return {
          totalConsultas: total,
          consultasEsteMes,
          consultasSemana,
          consultasHoy,
          pendientes,
          respondidas,
          convertidas,
          tasaRespuesta: total > 0 ? Math.round((respondidas / total) * 100) : 0,
          tasaConversion: respondidas > 0 ? Math.round((convertidas / respondidas) * 100) : 0,
          tiempoPromedioRespuesta: '2.5 horas'
        };
      })
    );
  }

  private getConsultasPorMesMock(): Observable<ConsultasPorMes[]> {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const anioActual = new Date().getFullYear();
    const mesActual = new Date().getMonth();

    // Generar datos para los últimos 6 meses
    const resultado: ConsultasPorMes[] = [];
    for (let i = 5; i >= 0; i--) {
      const mesIndex = (mesActual - i + 12) % 12;
      const anio = mesActual - i < 0 ? anioActual - 1 : anioActual;
      const cantidad = Math.floor(Math.random() * 40) + 15;
      const respondidas = Math.floor(cantidad * (0.6 + Math.random() * 0.3));
      const convertidas = Math.floor(respondidas * (0.2 + Math.random() * 0.2));

      resultado.push({
        mes: meses[mesIndex],
        anio,
        cantidad,
        respondidas,
        convertidas
      });
    }

    return of(resultado);
  }

  private calcularAsesoresStatsMock(): Observable<AsesorStats[]> {
    return forkJoin({
      agentes: this.agentService.getAgentes(),
      propiedades: this.propertyService.getPropiedades({})
    }).pipe(
      map(({ agentes, propiedades }) => {
        return agentes.filter(a => a.activo).map((agente, index) => {
          const propiedadesAgente = propiedades.datos.filter(p => p.asesorId === agente.id);
          const activas = propiedadesAgente.filter(p => p.estado === 'disponible').length;
          const vendidas = propiedadesAgente.filter(p => p.estado === 'vendido').length;
          const alquiladas = propiedadesAgente.filter(p => p.estado === 'alquilado').length;

          // Simulación de métricas de consultas
          const consultasRecibidas = Math.floor(Math.random() * 30) + 10;
          const consultasRespondidas = Math.floor(consultasRecibidas * (0.7 + Math.random() * 0.25));
          const consultasConvertidas = Math.floor(consultasRespondidas * (0.2 + Math.random() * 0.2));
          const tasaConversion = consultasRespondidas > 0
            ? Math.round((consultasConvertidas / consultasRespondidas) * 100)
            : 0;

          // Determinar performance score
          let performanceScore: 'excelente' | 'bueno' | 'regular' | 'bajo';
          if (tasaConversion >= 30 || vendidas >= 3) {
            performanceScore = 'excelente';
          } else if (tasaConversion >= 20 || vendidas >= 2) {
            performanceScore = 'bueno';
          } else if (tasaConversion >= 10 || vendidas >= 1) {
            performanceScore = 'regular';
          } else {
            performanceScore = 'bajo';
          }

          return {
            asesorId: agente.id,
            nombre: `${agente.nombre} ${agente.apellido}`,
            fotoUrl: agente.fotoUrl,
            propiedadesActivas: activas,
            propiedadesVendidas: vendidas,
            propiedadesAlquiladas: alquiladas,
            consultasRecibidas,
            consultasRespondidas,
            consultasConvertidas,
            tasaConversion,
            tiempoPromedioRespuesta: `${Math.floor(Math.random() * 4) + 1} horas`,
            ranking: index + 1,
            performanceScore
          };
        }).sort((a, b) => {
          // Ordenar por ventas + alquileres, luego por tasa de conversión
          const scoreA = (a.propiedadesVendidas + a.propiedadesAlquiladas) * 10 + a.tasaConversion;
          const scoreB = (b.propiedadesVendidas + b.propiedadesAlquiladas) * 10 + b.tasaConversion;
          return scoreB - scoreA;
        }).map((a, index) => ({ ...a, ranking: index + 1 }));
      })
    );
  }

  private exportarDatosMock(config: ExportConfig): Observable<ExportResult> {
    return of({ success: true, totalRegistros: 0 }).pipe(
      map(() => {
        switch (config.tipo) {
          case 'propiedades':
            this.exportarPropiedades(config);
            break;
          case 'consultas':
            this.exportarConsultas(config);
            break;
          case 'asesores':
            this.exportarAsesores(config);
            break;
        }
        return {
          success: true,
          filename: `${config.tipo}_${new Date().toISOString().split('T')[0]}.csv`,
          totalRegistros: 0
        };
      })
    );
  }

  private exportarPropiedades(config: ExportConfig): void {
    this.propertyService.getPropiedades(config.filtros || {}).subscribe(response => {
      const datos = response.datos.map(p => ({
        'ID': p.id,
        'Título': p.titulo,
        'Tipo': p.tipoPropiedad,
        'Operación': p.operacion,
        'Precio': p.precio,
        'Moneda': p.moneda,
        'Estado': p.estado,
        'Ciudad': p.ubicacion.ciudad,
        'Dirección': p.ubicacion.direccion,
        'Ambientes': p.caracteristicas.ambientes,
        'Dormitorios': p.caracteristicas.dormitorios,
        'Baños': p.caracteristicas.banos,
        'Superficie Cubierta': p.caracteristicas.superficie_cubierta,
        'Superficie Total': p.caracteristicas.superficie_total,
        'Destacada': p.destacada ? 'Sí' : 'No',
        'Fecha Publicación': p.fechaPublicacion
      }));
      this.descargarCSV(datos, `propiedades_${new Date().toISOString().split('T')[0]}`);
    });
  }

  private exportarConsultas(config: ExportConfig): void {
    this.leadService.getInquiries({}).subscribe(response => {
      const datos = response.datos.map(l => ({
        'ID': l.id,
        'Nombre': l.nombreContacto,
        'Email': l.emailContacto,
        'Teléfono': l.telefonoContacto,
        'Propiedad ID': l.propiedadId,
        'Mensaje': l.mensaje.substring(0, 100) + (l.mensaje.length > 100 ? '...' : ''),
        'Fecha': l.fechaEnvio,
        'Respondida': l.respondida ? 'Sí' : 'No'
      }));
      this.descargarCSV(datos, `consultas_${new Date().toISOString().split('T')[0]}`);
    });
  }

  private exportarAsesores(config: ExportConfig): void {
    this.calcularAsesoresStatsMock().subscribe(asesores => {
      const datos = asesores.map(a => ({
        'ID': a.asesorId,
        'Nombre': a.nombre,
        'Propiedades Activas': a.propiedadesActivas,
        'Propiedades Vendidas': a.propiedadesVendidas,
        'Propiedades Alquiladas': a.propiedadesAlquiladas,
        'Consultas Recibidas': a.consultasRecibidas,
        'Consultas Respondidas': a.consultasRespondidas,
        'Consultas Convertidas': a.consultasConvertidas,
        'Tasa Conversión': `${a.tasaConversion}%`,
        'Tiempo Resp. Promedio': a.tiempoPromedioRespuesta,
        'Performance': a.performanceScore
      }));
      this.descargarCSV(datos, `asesores_${new Date().toISOString().split('T')[0]}`);
    });
  }

  // =============================================
  // UTILIDADES CSV
  // =============================================

  private generarCSV(datos: any[], headers: string[]): string {
    const lineas: string[] = [];

    // Header
    lineas.push(headers.join(','));

    // Datos
    datos.forEach(fila => {
      const valores = headers.map(h => {
        const valor = fila[h];
        // Escapar valores con comas o comillas
        if (typeof valor === 'string' && (valor.includes(',') || valor.includes('"') || valor.includes('\n'))) {
          return `"${valor.replace(/"/g, '""')}"`;
        }
        return valor ?? '';
      });
      lineas.push(valores.join(','));
    });

    return lineas.join('\n');
  }

  private descargarArchivo(contenido: string, nombreArchivo: string, tipo: string): void {
    const blob = new Blob(['\ufeff' + contenido], { type: `${tipo};charset=utf-8` });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
