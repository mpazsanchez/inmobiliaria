import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgenteInfo } from '../../../../core/models';

@Component({
  selector: 'app-property-agent-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-agent-card.component.html',
  styleUrl: './property-agent-card.component.scss'
})
export class PropertyAgentCardComponent {
  @Input() agente!: AgenteInfo;
  @Input() propertyTitle: string = '';

  get whatsappUrl(): string {
    if (!this.agente?.telefono) return '';
    const phone = this.agente.telefono.replace(/\D/g, '');
    const message = encodeURIComponent(`Hola, me interesa la propiedad: ${this.propertyTitle}`);
    return `https://wa.me/${phone}?text=${message}`;
  }

  get phoneUrl(): string {
    if (!this.agente?.telefono) return '';
    return `tel:${this.agente.telefono}`;
  }

  get emailUrl(): string {
    if (!this.agente?.email) return '';
    const subject = encodeURIComponent(`Consulta: ${this.propertyTitle}`);
    return `mailto:${this.agente.email}?subject=${subject}`;
  }
}
