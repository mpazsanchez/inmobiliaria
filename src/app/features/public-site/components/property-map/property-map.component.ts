import { Component, Input, OnInit, OnChanges, OnDestroy, ElementRef, ViewChild, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Propiedad } from '../../../../core/models';

@Component({
  selector: 'app-property-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-map.component.html',
  styleUrl: './property-map.component.scss'
})
export class PropertyMapComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() propiedades: Propiedad[] = [];
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map: any = null;
  private markerClusterGroup: any = null;
  private L: any = null;
  private isBrowser: boolean;

  private navigationListener: EventListener | null = null;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    // Escuchar el evento de navegación desde el popup
    this.navigationListener = ((event: CustomEvent) => {
      this.router.navigate(['/propiedad', event.detail]);
    }) as EventListener;
    window.addEventListener('navigateToProperty', this.navigationListener);
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;
    await this.initializeMap();
  }

  ngOnChanges(): void {
    if (this.map && this.isBrowser) {
      this.updateMarkers();
    }
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    if (this.navigationListener) {
      window.removeEventListener('navigateToProperty', this.navigationListener);
    }
  }

  private async initializeMap(): Promise<void> {
    if (this.map || !this.isBrowser) return;

    // Importar Leaflet y MarkerCluster dinámicamente solo en el navegador
    const leaflet = await import('leaflet');
    this.L = leaflet.default || leaflet;

    // Importar MarkerCluster (se registra automáticamente en L)
    await import('leaflet.markercluster');

    // Usar CDN para los iconos de Leaflet
    this.L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    // Centro por defecto (Buenos Aires)
    const defaultCenter: [number, number] = [-34.6037, -58.3816];

    this.map = this.L.map(this.mapContainer.nativeElement, {
      center: defaultCenter,
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Usar OpenStreetMap tiles (gratuito)
    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    // Crear el grupo de clusters
    this.markerClusterGroup = this.L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      disableClusteringAtZoom: 14,
      iconCreateFunction: (cluster: any) => {
        const count = cluster.getChildCount();
        let size = 'small';
        let dimension = 40;

        if (count >= 10 && count < 50) {
          size = 'medium';
          dimension = 50;
        } else if (count >= 50) {
          size = 'large';
          dimension = 60;
        }

        return this.L.divIcon({
          html: `<div class="cluster-icon cluster-${size}"><span>${count}</span></div>`,
          className: 'custom-cluster',
          iconSize: this.L.point(dimension, dimension)
        });
      }
    });

    this.map.addLayer(this.markerClusterGroup);

    this.updateMarkers();
  }

  private updateMarkers(): void {
    if (!this.map || !this.markerClusterGroup || !this.L) return;

    // Limpiar marcadores existentes
    this.markerClusterGroup.clearLayers();

    if (this.propiedades.length === 0) return;

    const bounds = this.L.latLngBounds([]);

    this.propiedades.forEach(propiedad => {
      const lat = propiedad.ubicacion.coordenadas.lat;
      const lng = propiedad.ubicacion.coordenadas.lng;

      // Crear marcador personalizado
      const marker = this.L.marker([lat, lng], {
        icon: this.createCustomIcon(propiedad)
      });

      // Crear contenido del popup
      const popupContent = this.createPopupContent(propiedad);
      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'property-popup'
      });

      this.markerClusterGroup.addLayer(marker);
      bounds.extend([lat, lng]);
    });

    // Ajustar vista al bounds de todas las propiedades
    if (this.propiedades.length === 1) {
      this.map.setView(
        [this.propiedades[0].ubicacion.coordenadas.lat, this.propiedades[0].ubicacion.coordenadas.lng],
        15
      );
    } else if (bounds.isValid()) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private createCustomIcon(propiedad: Propiedad): any {
    const color = propiedad.operacion === 'venta' ? '#1a4d2e' : '#3b82f6';

    return this.L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg style="transform: rotate(45deg); width: 16px; height: 16px; fill: white;" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  }

  private createPopupContent(propiedad: Propiedad): string {
    const precio = this.formatearPrecio(propiedad.precio, propiedad.moneda);
    const operacionLabel = propiedad.operacion === 'venta' ? 'Venta' : 'Alquiler';
    const imagenUrl = propiedad.imagenes && propiedad.imagenes.length > 0
      ? propiedad.imagenes[0].url
      : 'assets/images/placeholder-property.jpg';

    return `
      <div class="popup-content">
        <div class="popup-image">
          <img src="${imagenUrl}" alt="${propiedad.titulo}" onerror="this.src='assets/images/placeholder-property.jpg'">
          <span class="popup-operation">${operacionLabel}</span>
        </div>
        <div class="popup-info">
          <h4 class="popup-title">${propiedad.titulo}</h4>
          <p class="popup-price">${precio}</p>
          <p class="popup-location">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${propiedad.ubicacion.ciudad}
          </p>
          <div class="popup-features">
            ${propiedad.caracteristicas.ambientes ? `<span>${propiedad.caracteristicas.ambientes} amb</span>` : ''}
            ${propiedad.caracteristicas.dormitorios ? `<span>${propiedad.caracteristicas.dormitorios} dorm</span>` : ''}
            ${propiedad.caracteristicas.banos ? `<span>${propiedad.caracteristicas.banos} baños</span>` : ''}
            ${propiedad.caracteristicas.superficie_total ? `<span>${propiedad.caracteristicas.superficie_total} m²</span>` : ''}
          </div>
          <button class="popup-btn" onclick="window.dispatchEvent(new CustomEvent('navigateToProperty', {detail: ${propiedad.id}}))">
            Ver Detalle
          </button>
        </div>
      </div>
    `;
  }

  private formatearPrecio(precio: number, moneda: string): string {
    const simbolo = moneda === 'USD' ? 'US$' : '$';
    return `${simbolo} ${precio.toLocaleString('es-AR')}`;
  }
}
