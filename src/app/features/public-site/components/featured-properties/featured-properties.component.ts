import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../../../core/services/property.service';
import { Propiedad } from '../../../../core/models/property.interface';
import { MOCK_ASESORES, Asesor } from '../../../../core/services/mock-data/agents.mock';

// Interfaz extendida para incluir info del agente
interface PropiedadConAgente extends Propiedad {
  agente?: Asesor;
}

@Component({
  selector: 'app-featured-properties',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './featured-properties.component.html',
  styleUrl: './featured-properties.component.scss'
})
export class FeaturedPropertiesComponent implements OnInit {
  private propertyService = inject(PropertyService);

  propiedadesDestacadas: PropiedadConAgente[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.cargarPropiedadesDestacadas();
  }

  cargarPropiedadesDestacadas(): void {
    this.propertyService.getPropiedadesDestacadas(6).subscribe({
      next: (propiedades) => {
        // Agregar info del agente a cada propiedad
        this.propiedadesDestacadas = propiedades.map(prop => ({
          ...prop,
          agente: MOCK_ASESORES.find(a => a.id === prop.asesorId)
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar propiedades destacadas:', error);
        this.isLoading = false;
      }
    });
  }

  formatearPrecio(precio: number, moneda: string): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: moneda === 'USD' ? 'USD' : 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(precio);
  }

  // Generar link de WhatsApp
  getWhatsAppLink(agente: Asesor, propiedad: Propiedad): string {
    const mensaje = encodeURIComponent(
      `Hola ${agente.nombre}, me interesa la propiedad "${propiedad.titulo}" publicada en Fairway. ¿Podrías darme más información?`
    );
    return `https://wa.me/${agente.whatsapp}?text=${mensaje}`;
  }

  // Generar link de teléfono
  getTelLink(telefono: string): string {
    return `tel:${telefono.replace(/\s/g, '')}`;
  }

  // Generar link de email
  getEmailLink(agente: Asesor, propiedad: Propiedad): string {
    const subject = encodeURIComponent(`Consulta: ${propiedad.titulo}`);
    const body = encodeURIComponent(
      `Hola ${agente.nombre},\n\nMe interesa la propiedad "${propiedad.titulo}" ubicada en ${propiedad.ubicacion.direccion}, ${propiedad.ubicacion.ciudad}.\n\n¿Podrían contactarme para coordinar una visita?\n\nGracias.`
    );
    return `mailto:${agente.email}?subject=${subject}&body=${body}`;
  }
}
