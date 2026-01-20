import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { Propiedad } from '../models/property.interface';
import { FiltrosBusqueda, RespuestaPaginada } from '../models/search-filters.interface';
import { MOCK_PROPIEDADES } from './mock-data/properties.mock';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/propiedades`;
  
  // Flag para usar datos mock o API real
  private useMockData = true;

  // =============================================
  // OBTENER PROPIEDADES CON FILTROS
  // =============================================
  
  /**
   * Obtiene propiedades con filtros y paginación
   * @param filtros - Filtros de búsqueda opcionales
   * @returns Observable con respuesta paginada de propiedades
   */
  getPropiedades(filtros?: FiltrosBusqueda): Observable<RespuestaPaginada<Propiedad>> {
    if (this.useMockData) {
      return this.getPropiedadesMock(filtros);
    }
    
    // Preparar parámetros para el backend
    const params = this.construirParamsHttp(filtros);
    
    return this.http.get<RespuestaPaginada<Propiedad>>(this.apiUrl, { params });
  }

  // =============================================
  // OBTENER PROPIEDAD POR ID O SLUG
  // =============================================
  
  /**
   * Obtiene una propiedad específica por ID
   * @param id - ID de la propiedad
   * @returns Observable con la propiedad
   */
  getPropiedadPorId(id: number): Observable<Propiedad | null> {
    if (this.useMockData) {
      return this.getPropiedadPorIdMock(id);
    }
    
    return this.http.get<Propiedad>(`${this.apiUrl}/${id}`);
  }

  // =============================================
  // PROPIEDADES DESTACADAS
  // =============================================
  
  /**
   * Obtiene las propiedades destacadas
   * @param limite - Número máximo de propiedades a retornar
   * @returns Observable con array de propiedades destacadas
   */
  getPropiedadesDestacadas(limite: number = 6): Observable<Propiedad[]> {
    if (this.useMockData) {
      return this.getPropiedadesDestacadasMock(limite);
    }
    
    // Usar endpoint con filtros
    return this.getPropiedades({ 
      soloDestacadas: true,
      ordenarPor: 'relevancia',
      limite 
    }).pipe(
      map(response => response.datos.slice(0, limite))
    );
  }

  // =============================================
  // PROPIEDADES RECIENTES
  // =============================================
  
  /**
   * Obtiene las propiedades más recientes
   * @param limite - Número máximo de propiedades a retornar
   * @returns Observable con array de propiedades recientes
   */
  getPropiedadesRecientes(limite: number = 6): Observable<Propiedad[]> {
    if (this.useMockData) {
      return this.getPropiedadesRecientesMock(limite);
    }
    
    // Usar endpoint con filtros
    return this.getPropiedades({ 
      ordenarPor: 'reciente',
      ordenDireccion: 'desc',
      limite 
    }).pipe(
      map(response => response.datos.slice(0, limite))
    );
  }

  // =============================================
  // PROPIEDADES RELACIONADAS
  // =============================================
  
  /**
   * Obtiene propiedades similares a una propiedad dada
   * @param propiedadId - ID de la propiedad de referencia
   * @param limite - Número máximo de propiedades a retornar
   * @returns Observable con array de propiedades relacionadas
   */
  getPropiedadesRelacionadas(propiedadId: number, limite: number = 4): Observable<Propiedad[]> {
    if (this.useMockData) {
      return this.getPropiedadesRelacionadasMock(propiedadId, limite);
    }
    
    const params = new HttpParams().set('limite', limite.toString());
    return this.http.get<Propiedad[]>(`${this.apiUrl}/${propiedadId}/relacionadas`, { params });
  }

  // =============================================
  // CONTADORES RAPIDOS
  // =============================================
  
  /**
   * Obtiene el total de propiedades según filtros
   * @param filtros - Filtros opcionales
   * @returns Observable con el número total
   */
  contarPropiedades(filtros?: FiltrosBusqueda): Observable<number> {
    if (this.useMockData) {
      return this.contarPropiedadesMock(filtros);
    }
    
    const params = this.construirParamsHttp(filtros);
    return this.http.get<number>(`${this.apiUrl}/contar`, { params });
  }

  // =============================================
  // MÉTODOS PRIVADOS - MOCK DATA
  // =============================================
  
  private getPropiedadesMock(filtros?: FiltrosBusqueda): Observable<RespuestaPaginada<Propiedad>> {
    // Simular delay de red
    return of(this.filtrarYPaginarPropiedades(MOCK_PROPIEDADES, filtros)).pipe(delay(300));
  }

  private getPropiedadPorIdMock(id: number): Observable<Propiedad | null> {
    const propiedad = MOCK_PROPIEDADES.find(p => p.id === id) || null;
    return of(propiedad).pipe(delay(200));
  }

  private getPropiedadesDestacadasMock(limite: number): Observable<Propiedad[]> {
    const destacadas = MOCK_PROPIEDADES
      .filter(p => p.destacada && p.estado === 'disponible')
      .slice(0, limite);
    return of(destacadas).pipe(delay(200));
  }

  private getPropiedadesRecientesMock(limite: number): Observable<Propiedad[]> {
    const recientes = [...MOCK_PROPIEDADES]
      .sort((a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime())
      .slice(0, limite);
    return of(recientes).pipe(delay(200));
  }

  private getPropiedadesRelacionadasMock(propiedadId: number, limite: number): Observable<Propiedad[]> {
    const propiedadBase = MOCK_PROPIEDADES.find(p => p.id === propiedadId);
    if (!propiedadBase) {
      return of([]);
    }

    // Buscar propiedades similares (mismo tipo y operación, diferente id)
    const relacionadas = MOCK_PROPIEDADES
      .filter(p => 
        p.id !== propiedadId &&
        p.tipoPropiedad === propiedadBase.tipoPropiedad &&
        p.operacion === propiedadBase.operacion &&
        p.estado === 'disponible'
      )
      .slice(0, limite);

    return of(relacionadas).pipe(delay(200));
  }

  private contarPropiedadesMock(filtros?: FiltrosBusqueda): Observable<number> {
    const propiedadesFiltradas = this.aplicarFiltros(MOCK_PROPIEDADES, filtros);
    return of(propiedadesFiltradas.length).pipe(delay(100));
  }

  // =============================================
  // MÉTODOS AUXILIARES
  // =============================================
  
  private filtrarYPaginarPropiedades(
    propiedades: Propiedad[],
    filtros?: FiltrosBusqueda
  ): RespuestaPaginada<Propiedad> {
    // Aplicar filtros
    let resultado = this.aplicarFiltros(propiedades, filtros);

    // Aplicar ordenamiento
    resultado = this.aplicarOrdenamiento(resultado, filtros);

    // Calcular paginación
    const pagina = filtros?.pagina || 1;
    const porPagina = filtros?.porPagina || 10;
    const totalItems = resultado.length;
    const totalPaginas = Math.ceil(totalItems / porPagina);
    const inicio = (pagina - 1) * porPagina;
    const fin = inicio + porPagina;

    // Paginar resultados
    const datosPaginados = resultado.slice(inicio, fin);

    return {
      datos: datosPaginados,
      paginacion: {
        paginaActual: pagina,
        porPagina,
        totalItems,
        totalPaginas,
        tieneSiguiente: pagina < totalPaginas,
        tieneAnterior: pagina > 1
      }
    };
  }

  private aplicarFiltros(propiedades: Propiedad[], filtros?: FiltrosBusqueda): Propiedad[] {
    if (!filtros) return propiedades;

    return propiedades.filter(propiedad => {
      // Filtro por operación
      if (filtros.operacion && propiedad.operacion !== filtros.operacion) {
        return false;
      }

      // Filtro por tipo de propiedad
      if (filtros.tipoPropiedad) {
        const tipos = Array.isArray(filtros.tipoPropiedad) 
          ? filtros.tipoPropiedad 
          : [filtros.tipoPropiedad];
        if (!tipos.includes(propiedad.tipoPropiedad)) {
          return false;
        }
      }

      // Filtro por ubicación (texto libre)
      if (filtros.ubicacion) {
        const ubicacionLower = filtros.ubicacion.toLowerCase();
        const coincide = 
          propiedad.ubicacion.ciudad.toLowerCase().includes(ubicacionLower) ||
          propiedad.ubicacion.provincia.toLowerCase().includes(ubicacionLower) ||
          propiedad.ubicacion.direccion.toLowerCase().includes(ubicacionLower);
        if (!coincide) return false;
      }

      // Filtro por ciudad
      if (filtros.ciudad && propiedad.ubicacion.ciudad !== filtros.ciudad) {
        return false;
      }

      // Filtro por provincia
      if (filtros.provincia && propiedad.ubicacion.provincia !== filtros.provincia) {
        return false;
      }

      // Filtro por precio
      if (filtros.precioMinimo && propiedad.precio < filtros.precioMinimo) {
        return false;
      }
      if (filtros.precioMaximo && propiedad.precio > filtros.precioMaximo) {
        return false;
      }

      // Filtro por moneda
      if (filtros.moneda && propiedad.moneda !== filtros.moneda) {
        return false;
      }

      // Filtro por ambientes (singular = mínimo, o rango min/max)
      const ambientesMin = filtros.ambientes || filtros.ambientesMinimo;
      if (ambientesMin && propiedad.caracteristicas.ambientes < ambientesMin) {
        return false;
      }
      if (filtros.ambientesMaximo && propiedad.caracteristicas.ambientes > filtros.ambientesMaximo) {
        return false;
      }

      // Filtro por dormitorios (singular = mínimo, o rango min/max)
      const dormitoriosMin = filtros.dormitorios || filtros.dormitoriosMinimo;
      if (dormitoriosMin && propiedad.caracteristicas.dormitorios < dormitoriosMin) {
        return false;
      }
      if (filtros.dormitoriosMaximo && propiedad.caracteristicas.dormitorios > filtros.dormitoriosMaximo) {
        return false;
      }

      // Filtro por baños (singular = mínimo)
      const banosMin = filtros.banos || filtros.banosMinimo;
      if (banosMin && propiedad.caracteristicas.banos < banosMin) {
        return false;
      }

      // Filtro por superficie
      if (filtros.superficieMinima && propiedad.caracteristicas.superficie_total < filtros.superficieMinima) {
        return false;
      }
      if (filtros.superficieMaxima && propiedad.caracteristicas.superficie_total > filtros.superficieMaxima) {
        return false;
      }

      // Filtro por garage
      if (filtros.garageMinimo && propiedad.caracteristicas.garage < filtros.garageMinimo) {
        return false;
      }

      // Filtro por antigüedad
      if (filtros.antiguedadMaxima && propiedad.caracteristicas.antiguedad > filtros.antiguedadMaxima) {
        return false;
      }

      // Filtro por amenidades
      if (filtros.amenidades && filtros.amenidades.length > 0) {
        const tieneAmenidades = filtros.amenidades.every(amenidad =>
          propiedad.caracteristicas.amenidades.includes(amenidad)
        );
        if (!tieneAmenidades) return false;
      }

      // Filtro destacadas
      if (filtros.soloDestacadas && !propiedad.destacada) {
        return false;
      }

      // Filtro por estado
      if (filtros.estado && propiedad.estado !== filtros.estado) {
        return false;
      }

      return true;
    });
  }

  private aplicarOrdenamiento(propiedades: Propiedad[], filtros?: FiltrosBusqueda): Propiedad[] {
    if (!filtros?.ordenarPor) return propiedades;

    const resultado = [...propiedades];
    let direccion = filtros.ordenDireccion === 'desc' ? -1 : 1;

    resultado.sort((a, b) => {
      let comparacion = 0;

      switch (filtros.ordenarPor) {
        case 'precio':
          comparacion = a.precio - b.precio;
          break;
        case 'fecha':
          comparacion = new Date(a.fechaPublicacion).getTime() - new Date(b.fechaPublicacion).getTime();
          break;
        case 'superficie':
          comparacion = a.caracteristicas.superficie_total - b.caracteristicas.superficie_total;
          break;
        case 'relevancia':
          // Ordenar por destacadas primero, luego por fecha
          if (a.destacada !== b.destacada) {
            return a.destacada ? -1 : 1;
          }
          comparacion = new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime();
          break;
        case 'reciente':
          // Más recientes primero (descendente por defecto)
          comparacion = new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime();
          break;
        case 'precio_menor':
          // Siempre ascendente (más baratos primero)
          comparacion = a.precio - b.precio;
          direccion = 1; // Forzar ascendente independiente del parámetro
          break;
        case 'precio_mayor':
          // Siempre descendente (más caros primero)
          comparacion = b.precio - a.precio;
          direccion = 1; // Ya está invertido en la comparación
          break;
        case 'superficie_mayor':
          // Siempre descendente (más grandes primero)
          comparacion = b.caracteristicas.superficie_total - a.caracteristicas.superficie_total;
          direccion = 1; // Ya está invertido
          break;
      }

      return comparacion * direccion;
    });

    return resultado;
  }

  private construirParamsHttp(filtros?: FiltrosBusqueda): HttpParams {
    let params = new HttpParams();

    if (!filtros) return params;

    // Agregar cada filtro como parámetro
    Object.keys(filtros).forEach(key => {
      const valor = (filtros as any)[key];
      if (valor !== undefined && valor !== null) {
        if (Array.isArray(valor)) {
          // Para arrays, enviar como múltiples parámetros o como string separado por comas
          params = params.set(key, valor.join(','));
        } else {
          params = params.set(key, valor.toString());
        }
      }
    });

    return params;
  }

  // =============================================
  // CONFIGURACIÓN
  // =============================================
  
  /**
   * Cambia entre usar datos mock o API real
   * @param useMock - true para usar mock, false para API real
   */
  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
  }
}
