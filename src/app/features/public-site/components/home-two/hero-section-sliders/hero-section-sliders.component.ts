
import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { SliderItem } from '../../../models/home-two-page.interface';

@Component({
  selector: 'app-hero-section-sliders',
  standalone: true,
  imports: [CommonModule, NgbCarouselModule],
  templateUrl: './hero-section-sliders.component.html',
  styleUrl: './hero-section-sliders.component.scss'
})
export class HeroSectionSlidersComponent {
  
  @ViewChild(NgbCarousel) carousel!: NgbCarousel;
  
  currentSlideIndex = 0;
  
  @Input() sliderItems: SliderItem[] = [];

  // Contact information for footer display
  contactInfo = {
    address: 'Madrid, España & Buenos Aires, Argentina',
    email: 'info@glazing.me'
  };

  trackBySlideId(index: number, item: SliderItem): string {
    return item.id;
  }

  // Método para cambiar slide desde los indicadores
  goToSlide(slideIndex: number): void {
    this.currentSlideIndex = slideIndex;
    this.carousel.select(`slide-${slideIndex + 1}`);
  }

  // Método para actualizar el índice actual cuando cambia el slide
  onSlideChange(event: any): void {
    // Extraer el número del ID del slide (slide-1, slide-2, etc.)
    const slideId = event.current;
    const slideNumber = parseInt(slideId.split('-')[1]) - 1;
    this.currentSlideIndex = slideNumber;
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