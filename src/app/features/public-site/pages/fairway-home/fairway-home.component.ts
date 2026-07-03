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

  heroBanner = signal<Banner | null>(null);

  private readonly fallbackHero = {
    titulo: 'Encontrá tu hogar ideal',
    subtitulo: 'Propiedades en venta y alquiler en Tandil y la zona',
    imagenUrl: 'assets/images/backgrounds/fairway/hero-home-3.webp'
  };

  ngOnInit(): void {
    this.contenidoService.getBannersByPaginaYPosicion('home', 'hero').subscribe({
      next: (banners: Banner[]) => {
        if (banners.length > 0) {
          this.heroBanner.set(banners[0]);
        }
      }
    });
  }

  // Genera la URL de la versión mobile del hero (480px) si existe el archivo
  get heroMobileImageUrl(): string {
    const url = this.heroData.imagenUrl;
    return url.replace(/([^/]+)\.webp$/, '$1-mobile.webp');
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
