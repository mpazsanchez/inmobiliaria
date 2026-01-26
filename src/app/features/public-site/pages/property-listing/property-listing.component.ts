import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PropertyService } from '../../../../core/services';
import { Propiedad, FiltrosBusqueda, RespuestaPaginada, OrdenBusqueda } from '../../../../core/models';
import { PropertyCardComponent } from '../../components/property-card/property-card.component';
import { PropertyFiltersComponent } from '../../components/property-filters/property-filters.component';
import { PropertyMapComponent } from '../../components/property-map/property-map.component';
import { PropertySkeletonComponent } from '../../components/property-skeleton/property-skeleton.component';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { ShareModalComponent } from '../../../../shared/components/share-modal/share-modal.component';

@Component({
  selector: 'app-property-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyCardComponent, PropertyFiltersComponent, PropertyMapComponent, PropertySkeletonComponent, BreadcrumbsComponent, ShareModalComponent],
  templateUrl: './property-listing.component.html',
  styleUrl: './property-listing.component.scss'
})
export class PropertyListingComponent implements OnInit, OnDestroy {
  propiedades: Propiedad[] = [];
  totalResultados = 0;
  isLoading = true;
  showFilters = false;
  showMapView = false;
  skeletonItems = Array(6).fill(0); // Para mostrar 6 skeletons durante la carga
  breadcrumbs: BreadcrumbItem[] = [];
  
  // Modal de compartir
  showShareModal = false;
  selectedPropertyToShare: Propiedad | null = null;
  
  // Suscripciones
  private subscriptions = new Subscription();
  
  filtros: FiltrosBusqueda = {
    pagina: 1,
    limite: 12,
    ordenarPor: 'reciente'
  };

  ordenOpciones: { value: OrdenBusqueda; label: string }[] = [
    { value: 'reciente', label: 'Más recientes' },
    { value: 'precio_menor', label: 'Menor precio' },
    { value: 'precio_mayor', label: 'Mayor precio' },
    { value: 'superficie_mayor', label: 'Mayor superficie' }
  ];

  constructor(
    private propertyService: PropertyService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios en queryParams - única fuente de verdad
    this.subscriptions.add(
      this.route.queryParams.subscribe(params => {
        // Construir filtros desde queryParams
        this.filtros = this.buildFiltrosFromParams(params);
        
        // Configurar breadcrumbs según operación
        this.setupBreadcrumbs(this.filtros.operacion);
        
        // Cargar propiedades con los nuevos filtros
        this.cargarPropiedades();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Construye objeto FiltrosBusqueda desde queryParams
   * Resetea completamente los filtros en cada llamada (no preserva estado previo)
   */
  private buildFiltrosFromParams(params: any): FiltrosBusqueda {
    return {
      pagina: params['pagina'] ? +params['pagina'] : 1,
      limite: 12,
      ordenarPor: (params['ordenarPor'] as OrdenBusqueda) || 'reciente',
      operacion: params['operacion'] || undefined,
      tipoPropiedad: params['tipoPropiedad'] || undefined,
      ubicacion: params['ubicacion'] || undefined,
      precioMinimo: params['precioMinimo'] ? +params['precioMinimo'] : undefined,
      precioMaximo: params['precioMaximo'] ? +params['precioMaximo'] : undefined,
      moneda: (params['moneda'] as 'USD' | 'ARS') || undefined,
      ambientes: params['ambientes'] ? +params['ambientes'] : undefined,
      dormitorios: params['dormitorios'] ? +params['dormitorios'] : undefined,
      banos: params['banos'] ? +params['banos'] : undefined,
      superficieMinima: params['superficieMinima'] ? +params['superficieMinima'] : undefined,
      superficieMaxima: params['superficieMaxima'] ? +params['superficieMaxima'] : undefined,
      garageMinimo: params['garageMinimo'] ? +params['garageMinimo'] : undefined,
      amenidades: params['amenidades'] ? params['amenidades'].split(',') : undefined
    };
  }

  private setupBreadcrumbs(operacion?: string): void {
    this.breadcrumbs = [
      { label: 'Inicio', link: '/' },
      { 
        label: operacion === 'venta' ? 'Comprar' : operacion === 'alquiler' ? 'Alquilar' : 'Propiedades',
        active: true
      }
    ];
  }

  cargarPropiedades(): void {
    this.isLoading = true;
    
    this.propertyService.getPropiedades(this.filtros).subscribe({
      next: (respuesta: RespuestaPaginada<Propiedad>) => {
        this.propiedades = respuesta.datos;
        this.totalResultados = respuesta.paginacion.total || respuesta.paginacion.totalItems;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar propiedades:', error);
        this.isLoading = false;
      }
    });
  }

  onFiltrosChange(nuevosFiltros: FiltrosBusqueda): void {
    // NO mergear con filtros anteriores - usar directamente los nuevos
    // Solo preservar operacion si no viene en nuevosFiltros
    const operacion = nuevosFiltros.operacion || this.filtros.operacion;
    
    this.filtros = {
      ...nuevosFiltros,
      operacion,
      pagina: 1, // Siempre resetear página
      limite: 12,
      ordenarPor: nuevosFiltros.ordenarPor || 'reciente'
    };
    
    // Actualizar URL - esto triggereará queryParams.subscribe que cargará las propiedades
    this.actualizarURL();
  }

  onOrdenChange(orden: OrdenBusqueda): void {
    this.filtros = {
      ...this.filtros,
      ordenarPor: orden,
      pagina: 1
    };
    // Actualizar URL - esto triggereará queryParams.subscribe que cargará las propiedades
    this.actualizarURL();
  }

  onPaginaChange(pagina: number): void {
    this.filtros.pagina = pagina;
    // Actualizar URL - esto triggereará queryParams.subscribe que cargará las propiedades
    this.actualizarURL();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  limpiarFiltros(): void {
    // Preservar solo la operación actual
    const operacion = this.filtros.operacion;
    
    // Resetear filtros a valores por defecto
    this.filtros = {
      pagina: 1,
      limite: 12,
      ordenarPor: 'reciente',
      operacion: operacion
    };
    
    // Actualizar URL - esto triggereará queryParams.subscribe que cargará las propiedades
    this.actualizarURL();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleMapView(): void {
    this.showMapView = !this.showMapView;
  }

  onFavoriteToggle(propertyId: string): void {
    // TODO: Implementar lógica de favoritos (requiere autenticación)
  }

  onShare(data: { propertyId: string, platform: string }): void {
    const propertyId = parseInt(data.propertyId, 10);
    const property = this.propiedades.find(p => p.id === propertyId);
    if (!property) return;

    // Si es teléfono, llamar directamente
    if (data.platform === 'phone' && property.agente?.telefono) {
      window.location.href = `tel:${property.agente.telefono}`;
      return;
    }

    // Para otras plataformas, abrir el modal de compartir
    this.selectedPropertyToShare = property;
    this.showShareModal = true;
  }

  closeShareModal(): void {
    this.showShareModal = false;
    this.selectedPropertyToShare = null;
  }

  /**
   * Actualiza la URL con los filtros actuales
   * Omite valores por defecto para mantener URLs limpias
   */
  private actualizarURL(): void {
    const queryParams = this.filtrosToQueryParams(this.filtros);
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true
    });
  }

  /**
   * Convierte filtros a queryParams, omitiendo valores vacíos y por defecto
   */
  private filtrosToQueryParams(filtros: FiltrosBusqueda): Record<string, string | number> {
    const params: Record<string, string | number> = {};

    if (filtros.operacion) params['operacion'] = filtros.operacion;
    
    if (filtros.tipoPropiedad) {
      params['tipoPropiedad'] = Array.isArray(filtros.tipoPropiedad)
        ? filtros.tipoPropiedad.join(',')
        : filtros.tipoPropiedad;
    }
    
    if (filtros.ubicacion) params['ubicacion'] = filtros.ubicacion;
    if (filtros.precioMinimo) params['precioMinimo'] = filtros.precioMinimo;
    if (filtros.precioMaximo) params['precioMaximo'] = filtros.precioMaximo;
    if (filtros.moneda) params['moneda'] = filtros.moneda;
    if (filtros.ambientes) params['ambientes'] = filtros.ambientes;
    if (filtros.dormitorios) params['dormitorios'] = filtros.dormitorios;
    if (filtros.banos) params['banos'] = filtros.banos;
    if (filtros.superficieMinima) params['superficieMinima'] = filtros.superficieMinima;
    if (filtros.superficieMaxima) params['superficieMaxima'] = filtros.superficieMaxima;
    if (filtros.garageMinimo) params['garageMinimo'] = filtros.garageMinimo;
    if (filtros.amenidades?.length) params['amenidades'] = filtros.amenidades.join(',');
    
    // Solo incluir ordenarPor si no es el valor por defecto
    if (filtros.ordenarPor && filtros.ordenarPor !== 'reciente') {
      params['ordenarPor'] = filtros.ordenarPor;
    }
    
    // Solo incluir pagina si es mayor a 1
    if (filtros.pagina && filtros.pagina > 1) {
      params['pagina'] = filtros.pagina;
    }

    return params;
  }

  get totalPaginas(): number {
    return Math.ceil(this.totalResultados / (this.filtros.limite || 12));
  }

  get paginasArray(): number[] {
    const total = this.totalPaginas;
    const actual = this.filtros.pagina || 1;
    const rango = 2;
    const paginas: number[] = [];

    for (let i = Math.max(1, actual - rango); i <= Math.min(total, actual + rango); i++) {
      paginas.push(i);
    }

    return paginas;
  }

  get tituloOperacion(): string {
    if (this.filtros.operacion === 'venta') return 'en Venta';
    if (this.filtros.operacion === 'alquiler') return 'en Alquiler';
    return '';
  }
}

