import { Component, OnInit, ViewChild, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgbCarouselModule, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { ContenidoDinamicoService } from '../../../../core/services/contenido-dinamico.service';
import type { Banner } from '../../../../core/models';

@Component({
  selector: 'app-hero-banner-slider',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbCarouselModule],
  templateUrl: './hero-banner-slider.component.html',
  styleUrl: './hero-banner-slider.component.scss'
})
export class HeroBannerSliderComponent implements OnInit {
  @ViewChild(NgbCarousel) carousel!: NgbCarousel;

  private contenidoService = inject(ContenidoDinamicoService);

  // Input para especificar la página (default: home)
  @Input() pagina: 'home' | 'properties' | 'about' | 'contact' | 'team' | 'services' = 'home';
  @Input() posicion: 'hero' | 'secundario' | 'promocional' = 'hero';

  banners = signal<Banner[]>([]);
  isLoading = signal(true);
  currentSlideIndex = signal(0);

  ngOnInit(): void {
    this.loadBanners();
  }

  private loadBanners(): void {
    // Cargar banners filtrados por página Y posición
    this.contenidoService.getBannersByPaginaYPosicion(this.pagina, this.posicion).subscribe({
      next: (banners) => {
        this.banners.set(banners);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  trackByBannerId(index: number, banner: Banner): number {
    return banner.id;
  }

  goToSlide(slideIndex: number): void {
    this.currentSlideIndex.set(slideIndex);
    this.carousel.select(`banner-${slideIndex}`);
  }

  onSlideChange(event: { current: string }): void {
    const slideNumber = parseInt(event.current.split('-')[1]);
    this.currentSlideIndex.set(slideNumber);
  }

  isExternalLink(enlace: string | undefined): boolean {
    if (!enlace) return false;
    return enlace.startsWith('http://') || enlace.startsWith('https://');
  }
}
