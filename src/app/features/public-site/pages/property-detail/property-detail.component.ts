import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Propiedad } from '../../../../core/models';
import { PropertyService } from '../../../../core/services/property.service';
import { PropertyGalleryComponent } from '../../components/property-gallery/property-gallery.component';
import { PropertyAgentCardComponent } from '../../components/property-agent-card/property-agent-card.component';
import { PropertyContactFormComponent } from '../../components/property-contact-form/property-contact-form.component';
import { RelatedPropertiesComponent } from '../../components/related-properties/related-properties.component';
import { PropertyMapComponent } from '../../components/property-map/property-map.component';
import { BreadcrumbsComponent } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { ShareModalComponent } from '../../../../shared/components/share-modal/share-modal.component';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PropertyGalleryComponent,
    PropertyAgentCardComponent,
    PropertyContactFormComponent,
    RelatedPropertiesComponent,
    PropertyMapComponent,
    BreadcrumbsComponent,
    ShareModalComponent
  ],
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {
  propiedad: Propiedad | null = null;
  relatedProperties: Propiedad[] = [];
  isLoading = true;
  error: string | null = null;
  showShareModal = false;
  private isBrowser: boolean;

  breadcrumbs = [
    { label: 'Inicio', link: '/' },
    { label: 'Propiedades', link: '/properties' },
    { label: 'Detalle', link: '' }
  ];

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadProperty(id);
    });
  }

  private loadProperty(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.propertyService.getPropiedadPorId(id).subscribe({
      next: (propiedad) => {
        if (propiedad) {
          this.propiedad = propiedad;
          this.breadcrumbs[2].label = propiedad.titulo;
          this.loadRelatedProperties(propiedad.id);
        } else {
          this.error = 'Propiedad no encontrada';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar la propiedad';
        this.isLoading = false;
      }
    });
  }

  private loadRelatedProperties(propiedadId: number): void {
    this.propertyService.getPropiedadesRelacionadas(propiedadId, 4).subscribe({
      next: (props) => {
        this.relatedProperties = props;
      }
    });
  }

  // Formatters
  formatearPrecio(precio: number, moneda: string): string {
    const simbolo = moneda === 'USD' ? 'US$' : '$';
    return `${simbolo} ${precio.toLocaleString('es-AR')}`;
  }

  getOperacionLabel(operacion: string): string {
    return operacion === 'venta' ? 'Venta' : 'Alquiler';
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'disponible': return 'estado-disponible';
      case 'reservado': return 'estado-reservado';
      case 'vendido':
      case 'alquilado': return 'estado-cerrado';
      default: return '';
    }
  }

  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'disponible': return 'Disponible';
      case 'reservado': return 'Reservado';
      case 'vendido': return 'Vendido';
      case 'alquilado': return 'Alquilado';
      default: return estado;
    }
  }

  getTipoLabel(tipo: string): string {
    const tipos: { [key: string]: string } = {
      'casa': 'Casa',
      'departamento': 'Departamento',
      'ph': 'PH',
      'oficina': 'Oficina',
      'local': 'Local',
      'terreno': 'Terreno',
      'cochera': 'Cochera',
      'galpon': 'Galpón'
    };
    return tipos[tipo] || tipo;
  }

  getAmenidadLabel(amenidad: string): string {
    const labels: { [key: string]: string } = {
      'jardin': 'Jardín',
      'parrilla': 'Parrilla',
      'cochera': 'Cochera',
      'lavadero': 'Lavadero',
      'balcon': 'Balcón',
      'pileta': 'Pileta',
      'gym': 'Gimnasio',
      'sum': 'SUM',
      'seguridad-24hs': 'Seguridad 24hs',
      'aire-acondicionado': 'Aire acondicionado',
      'terraza': 'Terraza',
      'solarium': 'Solarium',
      'laundry': 'Laundry',
      'recepcion': 'Recepción',
      'patio': 'Patio',
      'spa': 'Spa',
      'pileta-privada': 'Pileta privada',
      'dependencia': 'Dependencia de servicio'
    };
    return labels[amenidad] || amenidad.replace(/-/g, ' ');
  }

  // Actions
  openShareModal(): void {
    this.showShareModal = true;
  }

  closeShareModal(): void {
    this.showShareModal = false;
  }

  printPage(): void {
    if (this.isBrowser) {
      window.print();
    }
  }

  get whatsappUrl(): string {
    if (!this.propiedad?.agente?.telefono) return '';
    const phone = this.propiedad.agente.telefono.replace(/\D/g, '');
    const message = encodeURIComponent(`Hola, me interesa la propiedad: ${this.propiedad.titulo} (Código: ${this.propiedad.id})`);
    return `https://wa.me/${phone}?text=${message}`;
  }
}
