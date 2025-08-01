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
      title: 'AHORRA ENERGÍA',
      subtitle: 'CON LÁMINAS SOLARES',
      description: 'Reduce hasta un 80% del calor solar y mejora el confort de tu hogar o negocio con instalación profesional garantizada',
      primaryButton: {
        text: 'SOLICITAR PRESUPUESTO',
        action: 'discover'
      },
      secondaryButton: {
        text: 'Ver Instalaciones',
        action: 'video'
      }
    },
    {
      id: 'slide-2', 
      imageUrl: './assets/images/backgrounds/solarcheck/slide-2.jpg',
      altText: 'Red de instaladores certificados Glazing',
      title: 'INSTALADORES',
      subtitle: 'CERTIFICADOS',
      description: 'Conectamos con el profesional más cercano a tu ubicación. Calidad garantizada y respaldo técnico oficial',
      primaryButton: {
        text: 'ENCONTRAR INSTALADOR',
        action: 'training'
      },
      secondaryButton: {
        text: 'Ver Garantías',
        action: 'gallery'
      }
    },
    {
      id: 'slide-3',
      imageUrl: './assets/images/backgrounds/solarcheck/slide-3.png',
      altText: 'Beneficios de las láminas solares residenciales y comerciales',
      title: 'PROTECCIÓN',
      subtitle: 'Y CONFORT',
      description: 'Mejora la estética, seguridad y eficiencia energética de tus espacios con la mejor tecnología del mercado',
      primaryButton: {
        text: 'VER BENEFICIOS',
        action: 'shop'
      },
      secondaryButton: {
        text: 'Casos de Éxito',
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