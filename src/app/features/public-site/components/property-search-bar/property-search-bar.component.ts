import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FiltrosBusqueda } from '../../../../core/models/search-filters.interface';

@Component({
  selector: 'app-property-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-search-bar.component.html',
  styleUrl: './property-search-bar.component.scss'
})
export class PropertySearchBarComponent {
  private router = inject(Router);

  // Opciones para los selectores
  operaciones = [
    { value: '', label: 'Comprar o Alquilar' },
    { value: 'venta', label: 'Comprar' },
    { value: 'alquiler', label: 'Alquilar' }
  ];

  tiposPropiedad = [
    { value: '', label: 'Tipo de propiedad' },
    { value: 'casa', label: 'Casa' },
    { value: 'departamento', label: 'Departamento' },
    { value: 'ph', label: 'PH' },
    { value: 'oficina', label: 'Oficina' },
    { value: 'terreno', label: 'Terreno' }
  ];

  // Modelo del formulario
  filtros: Partial<FiltrosBusqueda> = {
    operacion: 'venta',
    tipoPropiedad: '',
    ubicacion: '',
    precioMinimo: undefined,
    precioMaximo: undefined
  };

  // Moneda seleccionada
  moneda: 'USD' | 'ARS' = 'USD';

  // Método para cambiar la operación desde los tabs
  setOperacion(operacion: string): void {
    this.filtros.operacion = operacion;
  }

  // Método para cambiar la moneda
  setMoneda(moneda: 'USD' | 'ARS'): void {
    this.moneda = moneda;
  }

  onBuscar(): void {
    // Limpiar filtros vacíos
    const filtrosLimpios = Object.entries(this.filtros)
      .filter(([_, value]) => value !== '' && value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    // Agregar moneda si hay precios
    if (this.filtros.precioMinimo || this.filtros.precioMaximo) {
      (filtrosLimpios as Record<string, unknown>)['moneda'] = this.moneda;
    }

    // Navegar a la página de listado con los filtros como query params
    this.router.navigate(['/propiedades'], {
      queryParams: filtrosLimpios
    });
  }
}
