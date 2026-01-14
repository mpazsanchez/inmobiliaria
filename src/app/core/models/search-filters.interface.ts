import { TipoPropiedad, TipoOperacion, Moneda } from './property.interface';

// =============================================
// FILTROS DE BUSQUEDA DE PROPIEDADES
// =============================================
export interface FiltrosBusqueda {
  // Filtros basicos (search bar principal)
  operacion?: TipoOperacion;
  tipoPropiedad?: TipoPropiedad | TipoPropiedad[];
  ubicacion?: string;                    // texto libre: ciudad, barrio, zona
  provincia?: string;
  ciudad?: string;
  barrio?: string;

  // Filtros de precio
  precioMinimo?: number;
  precioMaximo?: number;
  moneda?: Moneda;
  incluyeExpensas?: boolean;

  // Filtros de caracteristicas
  ambientesMinimo?: number;
  ambientesMaximo?: number;
  dormitoriosMinimo?: number;
  dormitoriosMaximo?: number;
  banosMinimo?: number;
  superficieMinima?: number;             // m2
  superficieMaxima?: number;             // m2
  cocherasMinimo?: number;
  antiguedadMaxima?: number;             // anios

  // Filtros de amenidades
  amenidades?: string[];                 // ['pileta', 'parrilla', 'gym', etc]

  // Filtros de estado
  soloDestacadas?: boolean;
  soloDisponibles?: boolean;

  // Ordenamiento
  ordenarPor?: OrdenBusqueda;
  ordenDireccion?: 'asc' | 'desc';

  // Paginacion
  pagina?: number;
  porPagina?: number;
}

// =============================================
// OPCIONES DE ORDENAMIENTO
// =============================================
export type OrdenBusqueda =
  | 'precio'
  | 'fecha'
  | 'superficie'
  | 'relevancia';

// =============================================
// FILTROS DISPONIBLES (para UI dinamica)
// =============================================
export interface FiltrosDisponibles {
  provincias: OpcionFiltro[];
  ciudades: OpcionFiltro[];
  barrios: OpcionFiltro[];
  tiposPropiedad: OpcionFiltro[];
  amenidades: OpcionFiltro[];
  rangoPrecioVenta: RangoNumerico;
  rangoPrecioAlquiler: RangoNumerico;
  rangoSuperficie: RangoNumerico;
  rangoAmbientes: RangoNumerico;
}

export interface OpcionFiltro {
  valor: string;
  etiqueta: string;
  cantidad: number;                      // cuantas propiedades tienen este valor
}

export interface RangoNumerico {
  minimo: number;
  maximo: number;
}
