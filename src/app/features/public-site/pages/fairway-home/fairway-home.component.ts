import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertySearchBarComponent } from '../../components/property-search-bar/property-search-bar.component';
import { FeaturedPropertiesComponent } from '../../components/featured-properties/featured-properties.component';
import { ExclusivePropertiesCtaComponent } from '../../components/exclusive-properties-cta/exclusive-properties-cta.component';
import { WhyFairwayComponent } from '../../components/why-fairway/why-fairway.component';
import { FairwayFaqSectionComponent } from '../../components/fairway-faq-section/fairway-faq-section.component';
import { ContenidoDinamicoService } from '../../../../core/services/contenido-dinamico.service';
import { Banner } from '../../../../core/models/testimonio.interface';

// NOTA: El slider está disponible en HeroBannerSliderComponent
// import { HeroBannerSliderComponent } from '../../components/hero-banner-slider/hero-banner-slider.component';
// Para usarlo, agregar a imports y en el template usar: <app-hero-banner-slider/>

@Component({
  selector: 'app-fairway-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PropertySearchBarComponent,
    FeaturedPropertiesComponent,
    ExclusivePropertiesCtaComponent,
    WhyFairwayComponent,
    FairwayFaqSectionComponent
  ],
  templateUrl: './fairway-home.component.html',
  styleUrl: './fairway-home.component.scss'
})
export class FairwayHomeComponent implements OnInit {
  private contenidoService = inject(ContenidoDinamicoService);

  // Hero data desde API/JSON
  heroBanner = signal<Banner | null>(null);
  isLoading = signal(true);

  // Fallback por si no hay datos
  private readonly fallbackHero = {
    titulo: 'Encuentra tu hogar ideal',
    subtitulo: 'Miles de propiedades en venta y alquiler te esperan',
    imagenUrl: 'assets/images/backgrounds/fairway/hero-home-3.jpg'
  };

  ngOnInit(): void {
    this.loadHeroBanner();
  }

  private loadHeroBanner(): void {
    // Cargar banners de la página home en posición hero
    this.contenidoService.getBannersByPaginaYPosicion('home', 'hero').subscribe({
      next: (banners: Banner[]) => {
        // Tomar el primer banner activo
        if (banners.length > 0) {
          this.heroBanner.set(banners[0]);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  get heroData() {
    const banner = this.heroBanner();
    if (banner) {
      return {
        titulo: banner.titulo,
        subtitulo: banner.subtitulo || '',
        imagenUrl: banner.imagenUrl
      };
    }
    return this.fallbackHero;
  }
}
