import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AgentService } from '../../../../core/services/agent.service';
import { PropertyService } from '../../../../core/services/property.service';
import type { Agente, EstadisticasAgente } from '../../../../core/models';
import type { Propiedad } from '../../../../core/models';
import { PropertyCardComponent } from '../../components/property-card/property-card.component';

@Component({
  selector: 'app-agent-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, PropertyCardComponent],
  templateUrl: './agent-profile.component.html',
  styleUrl: './agent-profile.component.scss'
})
export class AgentProfileComponent implements OnInit {
  agente: Agente | null = null;
  propiedades: Propiedad[] = [];
  estadisticas: EstadisticasAgente | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private agentService: AgentService,
    private propertyService: PropertyService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadAgentProfile(id);
    });
  }

  private loadAgentProfile(id: number): void {
    this.isLoading = true;
    this.error = null;

    // Cargar datos del agente
    this.agentService.getAgentePorId(id).subscribe({
      next: (agente) => {
        if (agente) {
          this.agente = agente;
          this.loadPropiedades(id);
          this.loadEstadisticas(id);
        } else {
          this.error = 'Agente no encontrado';
          this.isLoading = false;
        }
      },
      error: () => {
        this.error = 'Error al cargar el perfil';
        this.isLoading = false;
      }
    });
  }

  private loadPropiedades(agenteId: number): void {
    this.agentService.getPropiedadesAgente(agenteId).subscribe({
      next: (propiedades) => {
        this.propiedades = propiedades;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private loadEstadisticas(agenteId: number): void {
    this.agentService.getEstadisticasAgente(agenteId).subscribe({
      next: (stats) => {
        this.estadisticas = stats;
      }
    });
  }

  getNombreCompleto(): string {
    if (!this.agente) return '';
    return `${this.agente.nombre} ${this.agente.apellido}`;
  }

  formatearTelefono(telefono: string): string {
    return telefono.replace(/\D/g, '');
  }

  formatearPrecio(precio: number, moneda: string): string {
    const simbolo = moneda === 'USD' ? 'US$' : '$';
    return `${simbolo} ${precio.toLocaleString('es-AR')}`;
  }

  getWhatsAppUrl(): string {
    if (!this.agente) return '';
    const numero = this.formatearTelefono(this.agente.whatsapp || this.agente.telefono);
    const mensaje = `Hola ${this.agente.nombre}, vi tu perfil en Fairway y me gustaría contactarte.`;
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  }

  onFavoriteToggle(propertyId: string): void {
    console.log('Toggle favorite:', propertyId);
  }

  onShare(event: { propertyId: string; platform: string }): void {
    console.log('Share property:', event);
  }

  volverAlListado(): void {
    this.router.navigate(['/team']);
  }
}
