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
      altText: 'Glazing professional solar films installation',
      title: 'PROFESSIONAL',
      subtitle: 'SOLAR FILMS',
      description: 'Transform your windows with premium solar protection technology',
      primaryButton: {
        text: 'DISCOVER MORE',
        action: 'discover'
      },
      secondaryButton: {
        text: 'Watch Our Process',
        action: 'video'
      }
    },
    {
      id: 'slide-2', 
      imageUrl: './assets/images/backgrounds/solarcheck/slide-2.jpg',
      altText: 'Expert installation and training services',
      title: 'EXPERT',
      subtitle: 'INSTALLATION',
      description: 'Certified installers with guaranteed quality and professional training',
      primaryButton: {
        text: 'GET CERTIFIED',
        action: 'training'
      },
      secondaryButton: {
        text: 'View Gallery',
        action: 'gallery'
      }
    },
    {
      id: 'slide-3',
      imageUrl: './assets/images/backgrounds/solarcheck/slide-3.png',
      altText: 'Premium materials and tools for professionals',
      title: 'PREMIUM',
      subtitle: 'MATERIALS',
      description: 'High-quality films and professional tools for exceptional results',
      primaryButton: {
        text: 'SHOP NOW',
        action: 'shop'
      },
      secondaryButton: {
        text: 'Technical Specs',
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