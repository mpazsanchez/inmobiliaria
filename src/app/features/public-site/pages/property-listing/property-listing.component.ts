import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
export class PropertyListingComponent implements OnInit {
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
    // Leer operación desde la configuración de la ruta (para /comprar y /alquilar)
    const operacionRuta = this.route.snapshot.data['operacion'];
    
    // Configurar breadcrumbs
    this.setupBreadcrumbs(operacionRuta);
    
    // Leer parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.filtros = {
        ...this.filtros,
        operacion: operacionRuta || params['operacion'] || undefined,
        tipoPropiedad: params['tipo'] || undefined,
        ubicacion: params['ubicacion'] || undefined,
        precioMinimo: params['precioMin'] ? +params['precioMin'] : undefined,
        precioMaximo: params['precioMax'] ? +params['precioMax'] : undefined,
        pagina: params['pagina'] ? +params['pagina'] : 1
      };
      
      this.cargarPropiedades();
    });
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
        console.error('Error al cargar propiedades:', error);
        this.isLoading = false;
      }
    });
  }

  onFiltrosChange(nuevosFiltros: FiltrosBusqueda): void {
    this.filtros = {
      ...this.filtros,
      ...nuevosFiltros,
      pagina: 1 // Reset página al cambiar filtros
    };
    this.actualizarURL();
    this.cargarPropiedades();
  }

  onOrdenChange(orden: OrdenBusqueda): void {
    this.filtros = {
      ...this.filtros,
      ordenarPor: orden,
      pagina: 1
    };
    this.actualizarURL();
    this.cargarPropiedades();
  }

  onPaginaChange(pagina: number): void {
    this.filtros.pagina = pagina;
    this.actualizarURL();
    this.cargarPropiedades();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  limpiarFiltros(): void {
    this.filtros = {
      pagina: 1,
      limite: 12,
      ordenarPor: 'reciente'
    };
    this.actualizarURL();
    this.cargarPropiedades();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleMapView(): void {
    this.showMapView = !this.showMapView;
  }

  onFavoriteToggle(propertyId: string): void {
    // TODO: Implementar lógica de favoritos (requiere autenticación)
    console.log('Toggle favorite:', propertyId);
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

  private actualizarURL(): void {
    const queryParams: any = {};
    
    if (this.filtros.operacion) queryParams['operacion'] = this.filtros.operacion;
    if (this.filtros.tipoPropiedad) queryParams['tipo'] = this.filtros.tipoPropiedad;
    if (this.filtros.ubicacion) queryParams['ubicacion'] = this.filtros.ubicacion;
    if (this.filtros.precioMinimo) queryParams['precioMin'] = this.filtros.precioMinimo;
    if (this.filtros.precioMaximo) queryParams['precioMax'] = this.filtros.precioMaximo;
    if (this.filtros.pagina && this.filtros.pagina > 1) queryParams['pagina'] = this.filtros.pagina;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
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

