import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertiesAdminService, PropertyFilters, PropertyStats } from '../../../services/properties-admin.service';
import { AuthService } from '../../../services/auth.service';
import { Propiedad } from '../../../../../core/models/property.interface';
import {
  PageHeaderComponent,
  HeaderAction,
  StatsGridComponent,
  StatCardConfig,
  EmptyStateComponent,
  ConfirmModalComponent
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
    ConfirmModalComponent
  ],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit {
  private propertiesService = inject(PropertiesAdminService);
  private authService = inject(AuthService);

  // Estado
  properties = signal<Propiedad[]>([]);
  stats = signal<PropertyStats | null>(null);
  isLoading = signal(true);
  selectedProperty = signal<Propiedad | null>(null);
  showDeleteModal = signal(false);

  // Filtros
  filters = signal<PropertyFilters>({});
  searchTerm = signal('');

  // Usuario y permisos
  currentUser = computed(() => this.authService.getUsuario());
  isAdmin = computed(() => this.currentUser()?.rol === 'administrador');

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
    this.loadProperties();
    this.loadStats();
  }

  loadProperties(): void {
    this.isLoading.set(true);
    const filters = this.filters();

    // Si es asesor, solo ver sus propiedades
    if (!this.isAdmin()) {
      filters.asesorId = this.currentUser()?.id;
    }

    this.propertiesService.getProperties(filters).subscribe({
      next: (data) => {
        this.properties.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando propiedades:', err);
        this.isLoading.set(false);
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
    this.filters.update(f => ({ ...f, search: this.searchTerm() }));
    this.loadProperties();
  }

  onFilterChange(key: string, value: string): void {
    this.filters.update(f => ({
      ...f,
      [key]: value || undefined
    }));
    this.loadProperties();
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.filters.set({});
    this.loadProperties();
  }

  toggleDestacada(propiedad: Propiedad): void {
    this.propertiesService.toggleDestacada(propiedad.id).subscribe({
      next: () => this.loadProperties()
    });
  }

  changeStatus(propiedad: Propiedad, estado: string): void {
    this.propertiesService.changeStatus(propiedad.id, estado).subscribe({
      next: () => {
        this.loadProperties();
        this.loadStats();
      }
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
        this.loadProperties();
        this.loadStats();
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
}
