import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Propiedad } from '../../../../core/models';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.scss'
})
export class PropertyCardComponent {
  @Input() propiedad!: Propiedad;
  @Input() compactMode: boolean = false;
  @Input() index = 0;
  @Output() favoriteToggle = new EventEmitter<string>();
  @Output() share = new EventEmitter<{ propertyId: string, platform: string }>();

  isFavorite = false;

  getImageUrl(url: string): string {
    if (!url || !url.includes('res.cloudinary.com')) return url;
    return url.replace('/upload/', '/upload/f_auto,w_760,q_auto/');
  }

  getAgentImageUrl(url: string): string {
    if (!url) return url;
    if (url.includes('res.cloudinary.com')) {
      return url.replace('/upload/', '/upload/f_auto,w_88,h_88,c_thumb,g_face/');
    }
    if (url.includes('images.unsplash.com')) {
      return url.replace(/([?&]w=)\d+/, '$1150').replace(/([?&]h=)\d+/, '$1150');
    }
    return url;
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isFavorite = !this.isFavorite;
    this.favoriteToggle.emit(this.propiedad.id.toString());
  }

  shareProperty(event: Event, platform: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.share.emit({ propertyId: this.propiedad.id.toString(), platform });
  }

  formatearPrecio(precio: number, moneda: string): string {
    const formato = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formato.format(precio);
  }

  getOperacionLabel(): string {
    return this.propiedad.operacion === 'venta' ? 'Venta' : 'Alquiler';
  }

  getTipoPropiedadLabel(): string {
    const tipos: { [key: string]: string } = {
      'casa': 'Casa',
      'departamento': 'Departamento',
      'ph': 'PH',
      'local': 'Local Comercial',
      'oficina': 'Oficina',
      'terreno': 'Terreno',
      'campo': 'Campo',
      'quinta': 'Quinta'
    };
    return tipos[this.propiedad.tipoPropiedad] || this.propiedad.tipoPropiedad;
  }

  getEstadoClass(): string {
    const estados: { [key: string]: string } = {
      'disponible': 'status-available',
      'reservado': 'status-reserved',
      'vendido': 'status-sold'
    };
    return estados[this.propiedad.estado] || 'status-available';
  }

  getEstadoLabel(): string {
    const labels: { [key: string]: string } = {
      'disponible': 'Disponible',
      'reservado': 'Reservado',
      'vendido': 'Vendido'
    };
    return labels[this.propiedad.estado] || 'Disponible';
  }
}
