import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiltrosBusqueda } from '../../../../core/models';

@Component({
  selector: 'app-property-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-filters.component.html',
  styleUrl: './property-filters.component.scss'
})
export class PropertyFiltersComponent implements OnInit, OnChanges {
  @Input() filtrosActivos: FiltrosBusqueda = {};
  @Output() filtrosChange = new EventEmitter<FiltrosBusqueda>();
  @Output() limpiarFiltros = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  filtros: FiltrosBusqueda = {};
  isCollapsed = false;

  tiposPropiedad = [
    { value: '', label: 'Todos los tipos' },
    { value: 'casa', label: 'Casa' },
    { value: 'departamento', label: 'Departamento' },
    { value: 'ph', label: 'PH' },
    { value: 'local', label: 'Local Comercial' },
    { value: 'oficina', label: 'Oficina' },
    { value: 'terreno', label: 'Terreno' }
  ];

  ambientesOpciones = [
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' }
  ];

  dormitoriosOpciones = [
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' },
    { value: 4, label: '4+' }
  ];

  banosOpciones = [
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' }
  ];

  garageOpciones = [
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' }
  ];

  monedaOpciones = [
    { value: 'USD', label: 'USD' },
    { value: 'ARS', label: 'ARS' }
  ];

  amenities = [
    { value: 'piscina', label: 'Piscina' },
    { value: 'gimnasio', label: 'Gimnasio' },
    { value: 'seguridad', label: 'Seguridad 24hs' },
    { value: 'cochera', label: 'Cochera' },
    { value: 'jardin', label: 'Jardín' },
    { value: 'parrilla', label: 'Parrilla' }
  ];

  ngOnInit(): void {
    // Inicializar filtros locales desde los activos
    this.filtros = { ...this.filtrosActivos };
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Solo sincronizar si:
    // 1. No es el primer cambio (ya se manejó en ngOnInit)
    // 2. Y los filtros realmente cambiaron (evitar sync innecesarios)
    if (changes['filtrosActivos'] && !changes['filtrosActivos'].firstChange) {
      const prev = changes['filtrosActivos'].previousValue;
      const curr = changes['filtrosActivos'].currentValue;
      
      // Solo actualizar si los valores son diferentes
      if (JSON.stringify(prev) !== JSON.stringify(curr)) {
        this.filtros = { ...curr };
      }
    }
  }

  aplicarFiltros(): void {
    this.filtrosChange.emit(this.filtros);
    this.cerrar.emit(); // Cerrar panel en móvil después de aplicar
  }

  limpiar(): void {
    this.filtros = {};
    this.limpiarFiltros.emit();
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleAmenity(amenity: string): void {
    if (!this.filtros.amenidades) {
      this.filtros.amenidades = [];
    }
    
    const index = this.filtros.amenidades.indexOf(amenity);
    if (index > -1) {
      this.filtros.amenidades.splice(index, 1);
    } else {
      this.filtros.amenidades.push(amenity);
    }
  }

  isAmenitySelected(amenity: string): boolean {
    return this.filtros.amenidades?.includes(amenity) || false;
  }

  contarFiltrosActivos(): number {
    let count = 0;
    if (this.filtros.tipoPropiedad) count++;
    if (this.filtros.precioMinimo) count++;
    if (this.filtros.precioMaximo) count++;
    if (this.filtros.moneda) count++;
    if (this.filtros.ambientes) count++;
    if (this.filtros.dormitorios) count++;
    if (this.filtros.banos) count++;
    if (this.filtros.superficieMinima) count++;
    if (this.filtros.superficieMaxima) count++;
    if (this.filtros.garageMinimo) count++;
    if (this.filtros.amenidades && this.filtros.amenidades.length > 0) count += this.filtros.amenidades.length;
    return count;
  }

  cerrarFiltros(): void {
    this.cerrar.emit();
  }
}

