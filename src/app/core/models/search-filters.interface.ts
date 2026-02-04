// =============================================
// FILTROS DE BUSQUEDA DE PROPIEDADES
// =============================================
export interface FiltrosBusqueda {
  // Filtros basicos (search bar principal)
  operacion?: string;                    // 'venta' | 'alquiler'
  tipoPropiedad?: string | string[];     // 'casa' | 'departamento' | 'ph' | 'oficina' | 'terreno'
  ubicacion?: string;                    // texto libre: ciudad, barrio, zona
  provincia?: string;
  ciudad?: string;
  barrio?: string;

  // Filtros de precio
  precioMinimo?: number;
  precioMaximo?: number;
  moneda?: string;                       // 'USD' | 'ARS'

  // Filtros de caracteristicas
  ambientes?: number;
  ambientesMinimo?: number;
  ambientesMaximo?: number;
  dormitorios?: number;
  dormitoriosMinimo?: number;
  dormitoriosMaximo?: number;
  banos?: number;
  banosMinimo?: number;
  superficieMinima?: number;             // m2
  superficieMaxima?: number;             // m2
  garageMinimo?: number;
  antiguedadMaxima?: number;             // años

  // Filtros de amenidades
  amenidades?: string[];                 // ['pileta', 'parrilla', 'gym', etc]

  // Filtros de estado
  soloDestacadas?: boolean;
  estado?: string;                       // 'disponible' | 'reservado' | 'vendido'

  // Ordenamiento
  ordenarPor?: OrdenBusqueda;
  ordenDireccion?: 'asc' | 'desc';

  // Paginacion
  pagina?: number;
  porPagina?: number;
  limite?: number; // alias para porPagina
}

// =============================================
// OPCIONES DE ORDENAMIENTO
// =============================================
export type OrdenBusqueda =
  | 'reciente'
  | 'precio_menor'
  | 'precio_mayor'
  | 'superficie_mayor'
  | 'precio'
  | 'fecha'
  | 'superficie'
  | 'relevancia';

// =============================================
// RESPUESTA PAGINADA
// =============================================
export interface RespuestaPaginada<T> {
  datos: T[];
  items?: T[]; // alias para compatibilidad
  total?: number; // alias para mantener compatibilidad
  paginacion: InfoPaginacion;
}

export interface InfoPaginacion {
  paginaActual: number;
  porPagina: number;
  totalItems: number;
  totalPaginas: number;
  tieneSiguiente: boolean;
  total?: number; // alias para totalItems
  tieneAnterior: boolean;
}

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

// =============================================
// FILTROS DE USUARIOS
// =============================================
export interface FiltrosUsuarios {
  // Búsqueda por texto
  search?: string;                       // nombre, apellido, email
  busqueda?: string;                     // alias para search
  
  // Filtros de rol
  rol?: 'admin' | 'asesor';
  
  // Filtros de estado
  activo?: boolean;
  destacado?: boolean;
  
  // Ordenamiento
  ordenarPor?: 'nombre' | 'email' | 'fechaRegistro' | 'ultimoAcceso';
  ordenDireccion?: 'asc' | 'desc';
  
  // Paginación
  pagina?: number;
  limite?: number;
  porPagina?: number;
}
