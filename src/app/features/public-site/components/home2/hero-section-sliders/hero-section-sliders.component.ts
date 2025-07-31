import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-section-sliders',
  standalone: true,
  imports: [],
  templateUrl: './hero-section-sliders.component.html',
  styleUrl: './hero-section-sliders.component.scss'
})

export class HeroSectionSlidersComponent {
  carouselImages = [
    'assets/images/hero1.jpg',
    'assets/images/hero2.jpg',
    'assets/images/hero3.jpg'
  ];
}
