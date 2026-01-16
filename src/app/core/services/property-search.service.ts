import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyService } from './property.service';
import { FiltrosBusqueda, RespuestaPaginada } from '../models/search-filters.interface';
import { Propiedad } from '../models/property.interface';
import { Observable, catchError, tap, finalize, of } from 'rxjs';

/**
 * PropertySearchService
 *
 * Manages the search state and coordinates between UI components and PropertyService.
 * This service handles:
 * - Current filter state (using Angular signals)
 * - URL query params synchronization
 * - Loading and error states
 * - Navigation to results page
 */
@Injectable({ providedIn: 'root' })
export class PropertySearchService {
  private router = inject(Router);
  private propertyService = inject(PropertyService);

  // =============================================
  // REACTIVE STATE (SIGNALS)
  // =============================================

  /** Current search filters */
  private _filters = signal<FiltrosBusqueda>(this.getDefaultFilters());

  /** Loading state */
  private _loading = signal<boolean>(false);

  /** Error message (if any) */
  private _error = signal<string | null>(null);

  /** Last search results */
  private _results = signal<RespuestaPaginada<Propiedad> | null>(null);

  // Public readonly access for components
  readonly filters = this._filters.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly results = this._results.asReadonly();

  // Computed signals for derived data
  readonly properties = computed(() => this._results()?.datos ?? []);
  readonly totalResults = computed(() => this._results()?.paginacion.totalItems ?? 0);
  readonly pagination = computed(() => this._results()?.paginacion ?? null);
  readonly hasResults = computed(() => this.properties().length > 0);

  // =============================================
  // PUBLIC METHODS - FILTER MANAGEMENT
  // =============================================

  /**
   * Returns default filter values
   */
  private getDefaultFilters(): FiltrosBusqueda {
    return {
      operacion: 'venta',
      pagina: 1,
      porPagina: 12
    };
  }

  /**
   * Updates one or more filters
   * @param newFilters - Partial filters to update
   */
  updateFilters(newFilters: Partial<FiltrosBusqueda>): void {
    this._filters.update(currentFilters => ({
      ...currentFilters,
      ...newFilters,
      // Reset page to 1 when filters change (except when page is explicitly changed)
      pagina: newFilters.pagina ?? 1
    }));
  }

  /**
   * Sets a single filter
   * @param key - Filter name
   * @param value - Filter value
   */
  setFilter<K extends keyof FiltrosBusqueda>(key: K, value: FiltrosBusqueda[K]): void {
    this.updateFilters({ [key]: value } as Partial<FiltrosBusqueda>);
  }

  /**
   * Clears all filters and resets to defaults
   */
  clearFilters(): void {
    this._filters.set(this.getDefaultFilters());
  }

  /**
   * Clears specific filters
   * @param keys - Filter names to clear
   */
  clearSpecificFilters(...keys: (keyof FiltrosBusqueda)[]): void {
    this._filters.update(currentFilters => {
      const newFilters = { ...currentFilters };
      keys.forEach(key => {
        delete newFilters[key];
      });
      return newFilters;
    });
  }

  // =============================================
  // PUBLIC METHODS - SEARCH
  // =============================================

  /**
   * Executes search with current filters
   * Calls PropertyService and updates state
   */
  search(): Observable<RespuestaPaginada<Propiedad>> {
    this._loading.set(true);
    this._error.set(null);

    const currentFilters = this._filters();

    return this.propertyService.getPropiedades(currentFilters).pipe(
      tap(response => {
        this._results.set(response);
      }),
      catchError(error => {
        console.error('Search error:', error);
        this._error.set('Error searching properties. Please try again.');
        this._results.set(null);
        return of({
          datos: [],
          paginacion: {
            paginaActual: 1,
            porPagina: 12,
            totalItems: 0,
            totalPaginas: 0,
            tieneSiguiente: false,
            tieneAnterior: false
          }
        } as RespuestaPaginada<Propiedad>);
      }),
      finalize(() => {
        this._loading.set(false);
      })
    );
  }

  /**
   * Updates filters and executes search in one step
   * @param newFilters - Filters to apply
   */
  searchWithFilters(newFilters: Partial<FiltrosBusqueda>): Observable<RespuestaPaginada<Propiedad>> {
    this.updateFilters(newFilters);
    return this.search();
  }

  // =============================================
  // PUBLIC METHODS - NAVIGATION
  // =============================================

  /**
   * Navigates to results page with current filters as query params
   * Use this when search bar is on another page (e.g., home)
   */
  navigateToResults(): void {
    const queryParams = this.filtersToQueryParams(this._filters());
    this.router.navigate(['/propiedades'], { queryParams });
  }

  /**
   * Updates filters and navigates to results
   * @param newFilters - Filters to apply before navigating
   */
  searchAndNavigate(newFilters?: Partial<FiltrosBusqueda>): void {
    if (newFilters) {
      this.updateFilters(newFilters);
    }
    this.navigateToResults();
  }

  /**
   * Syncs filters from URL query params
   * Call this in the listing component on init
   * @param queryParams - Query params from ActivatedRoute
   */
  syncFromQueryParams(queryParams: Record<string, string>): void {
    const filters = this.queryParamsToFilters(queryParams);
    this._filters.set({
      ...this.getDefaultFilters(),
      ...filters
    });
  }

  // =============================================
  // PUBLIC METHODS - PAGINATION
  // =============================================

  /**
   * Goes to a specific page
   * @param page - Page number
   */
  goToPage(page: number): Observable<RespuestaPaginada<Propiedad>> {
    return this.searchWithFilters({ pagina: page });
  }

  /**
   * Goes to next page (if exists)
   */
  nextPage(): Observable<RespuestaPaginada<Propiedad>> | null {
    const currentPagination = this._results()?.paginacion;
    if (currentPagination?.tieneSiguiente) {
      return this.goToPage(currentPagination.paginaActual + 1);
    }
    return null;
  }

  /**
   * Goes to previous page (if exists)
   */
  previousPage(): Observable<RespuestaPaginada<Propiedad>> | null {
    const currentPagination = this._results()?.paginacion;
    if (currentPagination?.tieneAnterior) {
      return this.goToPage(currentPagination.paginaActual - 1);
    }
    return null;
  }

  // =============================================
  // PRIVATE METHODS - CONVERSION
  // =============================================

  /**
   * Converts filters to query params (removes empty values)
   */
  private filtersToQueryParams(filters: FiltrosBusqueda): Record<string, string> {
    const params: Record<string, string> = {};

    Object.entries(filters).forEach(([key, value]) => {
      // Exclude empty, undefined, null values
      if (value === undefined || value === null || value === '') {
        return;
      }
      // Exclude default values that don't add information
      if (key === 'pagina' && value === 1) return;
      if (key === 'porPagina' && value === 12) return;

      // Convert arrays to comma-separated string
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params[key] = value.join(',');
        }
      } else {
        params[key] = String(value);
      }
    });

    return params;
  }

  /**
   * Converts query params to filters (with correct typing)
   */
  private queryParamsToFilters(queryParams: Record<string, string>): Partial<FiltrosBusqueda> {
    const filters: Partial<FiltrosBusqueda> = {};

    // Conversion map for each filter type
    const conversions: Record<string, (value: string) => unknown> = {
      // Direct strings
      operacion: (v) => v,
      ubicacion: (v) => v,
      provincia: (v) => v,
      ciudad: (v) => v,
      barrio: (v) => v,
      moneda: (v) => v,
      estado: (v) => v,
      ordenarPor: (v) => v,
      ordenDireccion: (v) => v as 'asc' | 'desc',

      // Numbers
      precioMinimo: (v) => parseInt(v, 10) || undefined,
      precioMaximo: (v) => parseInt(v, 10) || undefined,
      ambientes: (v) => parseInt(v, 10) || undefined,
      ambientesMinimo: (v) => parseInt(v, 10) || undefined,
      ambientesMaximo: (v) => parseInt(v, 10) || undefined,
      dormitorios: (v) => parseInt(v, 10) || undefined,
      dormitoriosMinimo: (v) => parseInt(v, 10) || undefined,
      dormitoriosMaximo: (v) => parseInt(v, 10) || undefined,
      banos: (v) => parseInt(v, 10) || undefined,
      banosMinimo: (v) => parseInt(v, 10) || undefined,
      superficieMinima: (v) => parseInt(v, 10) || undefined,
      superficieMaxima: (v) => parseInt(v, 10) || undefined,
      garageMinimo: (v) => parseInt(v, 10) || undefined,
      antiguedadMaxima: (v) => parseInt(v, 10) || undefined,
      pagina: (v) => parseInt(v, 10) || 1,
      porPagina: (v) => parseInt(v, 10) || 12,
      limite: (v) => parseInt(v, 10) || undefined,

      // Booleans
      soloDestacadas: (v) => v === 'true',

      // Arrays (comma-separated)
      tipoPropiedad: (v) => v.includes(',') ? v.split(',') : v,
      amenidades: (v) => v.split(',').filter(Boolean),
    };

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value && conversions[key]) {
        const convertedValue = conversions[key](value);
        if (convertedValue !== undefined) {
          (filters as Record<string, unknown>)[key] = convertedValue;
        }
      }
    });

    return filters;
  }
}
