import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Propiedad } from '../../../../core/models';

@Component({
  selector: 'app-related-properties',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './related-properties.component.html',
  styleUrl: './related-properties.component.scss'
})
export class RelatedPropertiesComponent {
  @Input() propiedades: Propiedad[] = [];
  @Input() titulo: string = 'Propiedades similares';

  formatearPrecio(precio: number, moneda: string): string {
    const simbolo = moneda === 'USD' ? 'US$' : '$';
    return `${simbolo} ${precio.toLocaleString('es-AR')}`;
  }

  getOperacionLabel(operacion: string): string {
    return operacion === 'venta' ? 'Venta' : 'Alquiler';
  }
}
