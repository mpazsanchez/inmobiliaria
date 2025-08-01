import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

export interface SliderItem {
  id: string;
  imageUrl: string;
  altText: string;
  title?: string;
  description?: string;
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
      altText: 'Hero image showcasing our main product',
      title: 'Welcome to Our Platform',
      description: 'Discover amazing features that will transform your experience'
    },
    {
      id: 'slide-2', 
      imageUrl: './assets/images/backgrounds/solarcheck/slide-2.jpg',
      altText: 'Feature highlight with interactive elements',
      title: 'Innovative Solutions',
      description: 'Built with cutting-edge technology for modern users'
    },
    {
      id: 'slide-3',
      imageUrl: './assets/images/backgrounds/solarcheck/slide-3.png',
      altText: 'Success stories from satisfied customers',
      title: 'Join Thousands of Users',
      description: 'Experience the difference that quality makes'
    }
  ];

  trackBySlideId(index: number, item: SliderItem): string {
    return item.id;
  }
}