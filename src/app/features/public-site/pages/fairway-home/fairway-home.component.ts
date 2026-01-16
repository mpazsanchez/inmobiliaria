import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertySearchBarComponent } from '../../components/property-search-bar/property-search-bar.component';
import { FeaturedPropertiesComponent } from '../../components/featured-properties/featured-properties.component';
import { ExclusivePropertiesCtaComponent } from '../../components/exclusive-properties-cta/exclusive-properties-cta.component';
import { WhyFairwayComponent } from '../../components/why-fairway/why-fairway.component';

@Component({
  selector: 'app-fairway-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PropertySearchBarComponent,
    FeaturedPropertiesComponent,
    ExclusivePropertiesCtaComponent,
    WhyFairwayComponent
  ],
  templateUrl: './fairway-home.component.html',
  styleUrl: './fairway-home.component.scss'
})
export class FairwayHomeComponent {
  // Hero section data
  heroData = {
    backgroundImage: 'assets/images/backgrounds/fairway/hero-home.webp',
    title: 'Encuentra tu hogar ideal',
    subtitle: 'Miles de propiedades en venta y alquiler te esperan'
  };
}
