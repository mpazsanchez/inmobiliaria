import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { PropertiesAdminService, PropertyFilters, PropertyStats } from '../../../services/properties-admin.service';
import { AuthService } from '../../../services/auth.service';
import { Propiedad } from '../../../../../core/models/property.interface';
import { ToastService } from '../../../../../core/services/toast.service';
import { InfoPaginacion } from '../../../../../core/models/search-filters.interface';
import {
  PageHeaderComponent,
  HeaderAction,
  StatsGridComponent,
  StatCardConfig,
  EmptyStateComponent,
  ConfirmModalComponent,
  PaginationComponent
} from '../../../../../shared/components/admin';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PageHeaderComponent,
    StatsGridComponent,
    EmptyStateComponent,
    ConfirmModalComponent,
    PaginationComponent
  ],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit {
  private propertiesService = inject(PropertiesAdminService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  // Estado
  properties = signal<Propiedad[]>([]);
  stats = signal<PropertyStats | null>(null);
  isLoading = signal(true);
  selectedProperty = signal<Propiedad | null>(null);
  showDeleteModal = signal(false);
  paginacion = signal<InfoPaginacion | null>(null);

  // Filtros (incluyen paginación)
  filters = signal<PropertyFilters>({
    pagina: 1,
    limite: 10
  });
  searchTerm = signal('');

  // Usuario y permisos
  currentUser = computed(() => this.authService.getUsuario());
  isAdmin = computed(() => this.currentUser()?.rol === 'admin');

  // Configuración del header
  primaryAction: HeaderAction = {
    label: 'Nueva Propiedad',
    icon: 'bi-plus-lg',
    route: '/member-area/propiedades/nueva',
    variant: 'primary'
  };

  // Título dinámico según rol
  pageTitle = computed(() => this.isAdmin() ? 'Todas las Propiedades' : 'Mis Propiedades');

  // Stats cards computadas
  statsCards = computed<StatCardConfig[]>(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      { value: s.total, label: 'Total', icon: 'bi-building', variant: 'primary' },
      { value: s.disponibles, label: 'Disponibles', icon: 'bi-check-circle', variant: 'success' },
      { value: s.reservadas, label: 'Reservadas', icon: 'bi-clock-history', variant: 'warning' },
      { value: s.vendidas + s.alquiladas, label: 'Cerradas', icon: 'bi-house-check', variant: 'info' },
      { value: s.destacadas, label: 'Destacadas', icon: 'bi-star', variant: 'warning' }
    ];
  });

  // Nombre de la propiedad a eliminar
  propertyToDeleteTitle = computed(() => this.selectedProperty()?.titulo || '');

  // Opciones de filtros
  tiposPropiedad = this.propertiesService.getTiposPropiedad();
  operaciones = this.propertiesService.getOperaciones();
  estados = this.propertiesService.getEstados();

  ngOnInit(): void {
    // Leer parámetros de query inicial
    this.route.queryParams.subscribe(params => {
      const pagina = parseInt(params['pagina']) || 1;
      const limite = parseInt(params['limite']) || 10;
      
      this.filters.update(f => ({ ...f, pagina, limite }));
      this.loadProperties();
    });
    
    this.loadStats();
  }

  loadProperties(): void {
    this.isLoading.set(true);
    const filters = { ...this.filters() };

    // Si es asesor, solo ver sus propiedades
    if (!this.isAdmin()) {
      filters.asesorId = this.currentUser()?.id;
    }

    this.propertiesService.getPropertiesPaginated(filters).subscribe({
      next: (response) => {
        this.properties.set(response.datos);
        this.paginacion.set(response.paginacion);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando propiedades:', err);
        this.isLoading.set(false);
        // TODO: mostrar toast de error al usuario cuando esté conectado a la API real
      }
    });
  }

  loadStats(): void {
    const asesorId = this.isAdmin() ? undefined : this.currentUser()?.id;
    this.propertiesService.getStats(asesorId).subscribe({
      next: (stats) => this.stats.set(stats)
    });
  }

  onSearch(): void {
    // TODO: reemplazar el botón "Buscar" por búsqueda con debounce (ej. 300ms) al conectar con la API real
    this.filters.update(f => ({ ...f, search: this.searchTerm(), pagina: 1 }));
    this.loadProperties();
  }

  onFilterChange(key: string, value: string): void {
    this.filters.update(f => ({
      ...f,
      [key]: value || undefined,
      pagina: 1
    }));
    this.loadProperties();
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.filters.set({ pagina: 1, limite: 10 });
    this.loadProperties();
  }

  toggleDestacada(propiedad: Propiedad): void {
    this.propertiesService.toggleDestacada(propiedad.id).subscribe({
      next: () => {
        const mensaje = propiedad.destacada
          ? 'Propiedad desmarcada como destacada'
          : 'Propiedad marcada como destacada';
        this.toastService.success(mensaje);
        this.loadProperties();
      },
      error: () => this.toastService.error('Error al cambiar estado de destacada')
    });
  }

  changeStatus(propiedad: Propiedad, estado: string): void {
    this.propertiesService.changeStatus(propiedad.id, estado).subscribe({
      next: () => {
        this.toastService.success(`Estado cambiado a "${this.getStatusLabel(estado)}"`);
        this.loadProperties();
        this.loadStats();
      },
      error: () => this.toastService.error('Error al cambiar el estado de la propiedad')
    });
  }

  confirmDelete(propiedad: Propiedad): void {
    this.selectedProperty.set(propiedad);
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.selectedProperty.set(null);
    this.showDeleteModal.set(false);
  }

  deleteProperty(): void {
    const propiedad = this.selectedProperty();
    if (!propiedad) return;

    this.propertiesService.deleteProperty(propiedad.id).subscribe({
      next: () => {
        this.showDeleteModal.set(false);
        this.selectedProperty.set(null);
        this.toastService.success('Propiedad eliminada exitosamente');
        this.loadProperties();
        this.loadStats();
      },
      error: () => {
        this.showDeleteModal.set(false);
        this.toastService.error('Error al eliminar la propiedad. Por favor, intenta nuevamente.');
      }
    });
  }

  // Helpers para UI
  getStatusClass(estado: string): string {
    const classes: Record<string, string> = {
      'disponible': 'status-available',
      'reservado': 'status-reserved',
      'vendido': 'status-sold',
      'alquilado': 'status-rented'
    };
    return classes[estado] || '';
  }

  getStatusLabel(estado: string): string {
    const labels: Record<string, string> = {
      'disponible': 'Disponible',
      'reservado': 'Reservado',
      'vendido': 'Vendido',
      'alquilado': 'Alquilado'
    };
    return labels[estado] || estado;
  }

  getOperacionLabel(operacion: string): string {
    return operacion === 'venta' ? 'Venta' : 'Alquiler';
  }

  getTipoLabel(tipo: string): string {
    const labels: Record<string, string> = {
      'departamento': 'Departamento',
      'casa': 'Casa',
      'ph': 'PH',
      'oficina': 'Oficina',
      'local': 'Local',
      'terreno': 'Terreno'
    };
    return labels[tipo] || tipo;
  }

  formatPrice(precio: number, moneda: string): string {
    if (moneda === 'USD') {
      return `USD ${precio.toLocaleString('es-AR')}`;
    }
    return `$ ${precio.toLocaleString('es-AR')}`;
  }

  hasActiveFilters(): boolean {
    const f = this.filters();
    return !!(f.search || f.operacion || f.tipoPropiedad || f.estado);
  }

  // Métodos de paginación
  onPageChange(pagina: number): void {
    this.filters.update(f => ({ ...f, pagina }));
    this.loadProperties();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(limite: number): void {
    this.filters.update(f => ({ ...f, limite, pagina: 1 }));
    this.loadProperties();
  }

}
