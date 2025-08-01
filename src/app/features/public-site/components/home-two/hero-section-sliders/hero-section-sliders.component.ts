import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

export interface SliderItem {
  id: string;
  imageUrl: string;
  altText: string;
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButton?: {
    text: string;
    action: string;
  };
  secondaryButton?: {
    text: string;
    action: string;
  };
}

@Component({
  selector: 'app-hero-section-sliders',
  standalone: true,
  imports: [CommonModule, NgbCarouselModule],
  templateUrl: './hero-section-sliders.component.html',
  styleUrl: './hero-section-sliders.component.scss'
})
export class HeroSectionSlidersComponent {
  
  sliderItems: SliderItem[] = [
    {
      id: 'slide-1',
      imageUrl: './assets/images/backgrounds/solarcheck/slide-1.jpg',
      altText: 'Instalación profesional de láminas solares Glazing',
      title: 'PROFESIONALES EN',
      subtitle: 'LÁMINAS SOLARES',
      description: 'Transforma tus ventanas con tecnología premium de protección solar',
      primaryButton: {
        text: 'DESCUBRE MÁS',
        action: 'discover'
      },
      secondaryButton: {
        text: 'Ver Nuestro Proceso',
        action: 'video'
      }
    },
    {
      id: 'slide-2', 
      imageUrl: './assets/images/backgrounds/solarcheck/slide-2.jpg',
      altText: 'Servicios expertos de instalación y capacitación',
      title: 'INSTALACIÓN',
      subtitle: 'EXPERTA',
      description: 'Instaladores certificados con calidad garantizada y capacitación profesional',
      primaryButton: {
        text: 'CERTIFÍCATE',
        action: 'training'
      },
      secondaryButton: {
        text: 'Ver Galería',
        action: 'gallery'
      }
    },
    {
      id: 'slide-3',
      imageUrl: './assets/images/backgrounds/solarcheck/slide-3.png',
      altText: 'Materiales premium y herramientas para profesionales',
      title: 'MATERIALES',
      subtitle: 'PREMIUM',
      description: 'Láminas de alta calidad y herramientas profesionales para resultados excepcionales',
      primaryButton: {
        text: 'COMPRAR AHORA',
        action: 'shop'
      },
      secondaryButton: {
        text: 'Especificaciones',
        action: 'specs'
      }
    }
  ];

  // Contact information for footer display
  contactInfo = {
    address: 'Madrid, España & Buenos Aires, Argentina',
    email: 'info@glazing.me'
  };

  trackBySlideId(index: number, item: SliderItem): string {
    return item.id;
  }

  // Button actions
  onButtonClick(action: string): void {
    switch(action) {
      case 'discover':
        // Navigate to about/services
        console.log('Navigate to discover');
        break;
      case 'video':
        // Open video modal or navigate to videos
        console.log('Open video');
        break;
      case 'training':
        // Navigate to training section
        console.log('Navigate to training');
        break;
      case 'gallery':
        // Navigate to gallery
        console.log('Navigate to gallery');
        break;
      case 'shop':
        // Navigate to shop
        console.log('Navigate to shop');
        break;
      case 'specs':
        // Navigate to technical specifications
        console.log('Navigate to specs');
        break;
      default:
        break;
    }
  }
}