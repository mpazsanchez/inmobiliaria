import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-exclusive-properties-cta',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './exclusive-properties-cta.component.html',
  styleUrl: './exclusive-properties-cta.component.scss'
})
export class ExclusivePropertiesCtaComponent {
  onContactClick(): void {
    // Puede navegar a contacto o abrir modal
    console.log('Contacto para propiedades exclusivas');
  }
}
