import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertySearchService } from '../../../../core/services/property-search.service';
import { FiltrosBusqueda } from '../../../../core/models/search-filters.interface';

@Component({
  selector: 'app-property-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-search-bar.component.html',
  styleUrl: './property-search-bar.component.scss'
})
export class PropertySearchBarComponent implements OnInit {
  private searchService = inject(PropertySearchService);

  /**
   * If true, navigates to /propiedades with filters as query params.
   * If false, executes search in-place (for listing page).
   */
  @Input() navigateOnSearch = true;

  /**
   * Optional initial filters (e.g., to pre-select operation)
   */
  @Input() initialFilters?: Partial<FiltrosBusqueda>;

  // =============================================
  // SELECT OPTIONS
  // Values match FiltrosBusqueda interface
  // =============================================

  readonly operationOptions = [
    { value: '', label: 'Comprar o Alquilar' },
    { value: 'venta', label: 'Comprar' },
    { value: 'alquiler', label: 'Alquilar' }
  ] as const;

  readonly propertyTypeOptions = [
    { value: '', label: 'Tipo de propiedad' },
    { value: 'casa', label: 'Casa' },
    { value: 'departamento', label: 'Departamento' },
    { value: 'ph', label: 'PH' },
    { value: 'oficina', label: 'Oficina' },
    { value: 'terreno', label: 'Terreno' }
  ] as const;

  readonly currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'ARS', label: 'ARS' }
  ] as const;

  // =============================================
  // FORM MODEL
  // Uses same property names as FiltrosBusqueda
  // =============================================

  filters: Partial<FiltrosBusqueda> = {
    operacion: 'venta',
    tipoPropiedad: '',
    ubicacion: '',
    precioMinimo: undefined,
    precioMaximo: undefined,
    moneda: 'USD'
  };

  // =============================================
  // LIFECYCLE
  // =============================================

  ngOnInit(): void {
    if (this.initialFilters) {
      this.filters = {
        ...this.filters,
        ...this.initialFilters
      };
    }

    const serviceFilters = this.searchService.filters();
    if (serviceFilters.operacion) {
      this.filters.operacion = serviceFilters.operacion;
    }
  }

  // =============================================
  // PUBLIC METHODS - UI INTERACTION
  // =============================================

  setOperation(operation: string): void {
    this.filters.operacion = operation;
  }

  setCurrency(currency: string): void {
    this.filters.moneda = currency;
  }

  onSearch(): void {
    const cleanFilters = this.removeEmptyFilters(this.filters);

    if (this.navigateOnSearch) {
      this.searchService.searchAndNavigate(cleanFilters);
    } else {
      this.searchService.searchWithFilters(cleanFilters).subscribe();
    }
  }

  // =============================================
  // PRIVATE METHODS
  // =============================================

  private removeEmptyFilters(filters: Partial<FiltrosBusqueda>): Partial<FiltrosBusqueda> {
    return Object.entries(filters)
      .filter(([_, value]) => {
        if (value === undefined || value === null) return false;
        if (typeof value === 'string' && value === '') return false;
        return true;
      })
      .reduce((acc, [key, value]) => {
        (acc as Record<string, unknown>)[key] = value;
        return acc;
      }, {} as Partial<FiltrosBusqueda>);
  }
}
