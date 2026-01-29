/**
 * Interfaces para el módulo de Estadísticas y Reportes
 * Basado en los requerimientos del documento de Fairway Inmobiliaria
 */

// =============================================
// ESTADÍSTICAS GENERALES DE PROPIEDADES
// =============================================

export interface PropiedadesStats {
  totalActivas: number;
  enVenta: number;
  enAlquiler: number;
  vendidas: number;
  alquiladas: number;
  reservadas: number;
  vendidasEsteMes: number;
  alquiladasEsteMes: number;
  nuevasEsteMes: number;
}

export interface PropiedadesPorTipo {
  tipo: string;
  label: string;
  cantidad: number;
  porcentaje: number;
}

export interface PropiedadesPorOperacion {
  operacion: 'venta' | 'alquiler';
  cantidad: number;
  porcentaje: number;
}

// =============================================
// ESTADÍSTICAS DE VISITAS (Para cuando esté el tracking)
// =============================================

export interface VisitasStats {
  totalVisitasMes: number;
  visitasHoy: number;
  visitasSemana: number;
  comparativoMesAnterior: number; // porcentaje de cambio
  paginasMasVistas: PaginaVisitada[];
}

export interface PaginaVisitada {
  pagina: string;
  url: string;
  visitas: number;
  porcentaje: number;
}

export interface PropiedadVisitas {
  propiedadId: number;
  titulo: string;
  visitas: number;
  compartidos: number;
  consultasGeneradas: number;
  tasaConversion: number; // porcentaje consultas/visitas
}

// =============================================
// ESTADÍSTICAS DE CONSULTAS/LEADS
// =============================================

export interface ConsultasStats {
  totalConsultas: number;
  consultasEsteMes: number;
  consultasSemana: number;
  consultasHoy: number;
  pendientes: number;
  respondidas: number;
  convertidas: number;
  tasaRespuesta: number; // porcentaje
  tasaConversion: number; // porcentaje
  tiempoPromedioRespuesta: string; // ej: "2 horas"
}

export interface ConsultasPorMes {
  mes: string;
  anio: number;
  cantidad: number;
  respondidas: number;
  convertidas: number;
}

export interface ConsultasPorTipo {
  tipo: 'venta' | 'alquiler' | 'general';
  cantidad: number;
  porcentaje: number;
}

// =============================================
// ESTADÍSTICAS DE ASESORES
// =============================================

export interface AsesorStats {
  asesorId: number;
  nombre: string;
  fotoUrl?: string;
  propiedadesActivas: number;
  propiedadesVendidas: number;
  propiedadesAlquiladas: number;
  consultasRecibidas: number;
  consultasRespondidas: number;
  consultasConvertidas: number;
  tasaConversion: number;
  tiempoPromedioRespuesta: string;
  ranking?: number;
  performanceScore: 'excelente' | 'bueno' | 'regular' | 'bajo';
}

export interface RankingAsesores {
  periodo: string; // ej: "Enero 2026"
  asesores: AsesorStats[];
}

// =============================================
// RESUMEN EJECUTIVO (DASHBOARD)
// =============================================

export interface ResumenEstadisticas {
  propiedades: PropiedadesStats;
  consultas: ConsultasStats;
  visitas?: VisitasStats; // Opcional hasta que se implemente tracking
  topAsesores: AsesorStats[];
  propiedadesMasVistas: PropiedadVisitas[];
  ultimaActualizacion: string;
}

// =============================================
// FILTROS PARA REPORTES
// =============================================

export interface FiltrosReporte {
  fechaInicio?: string;
  fechaFin?: string;
  asesorId?: number;
  operacion?: 'venta' | 'alquiler' | 'todas';
  tipoPropiedad?: string;
  estado?: string;
}

export type PeriodoReporte = 'hoy' | 'semana' | 'mes' | 'trimestre' | 'anio' | 'personalizado';

// =============================================
// EXPORTACIÓN DE DATOS
// =============================================

export interface ExportConfig {
  tipo: 'propiedades' | 'consultas' | 'asesores';
  formato: 'csv' | 'xlsx';
  filtros?: FiltrosReporte;
  columnas?: string[];
}

export interface ExportResult {
  success: boolean;
  filename?: string;
  error?: string;
  totalRegistros?: number;
}
