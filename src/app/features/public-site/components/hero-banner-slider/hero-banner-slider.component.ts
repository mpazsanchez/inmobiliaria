import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgbCarouselModule, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { ContenidoEstaticoService } from '../../../../core/services/contenido-estatico.service';
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

  private contenidoService = inject(ContenidoEstaticoService);

  banners = signal<Banner[]>([]);
  isLoading = signal(true);
  currentSlideIndex = signal(0);

  ngOnInit(): void {
    this.loadBanners();
  }

  private loadBanners(): void {
    this.contenidoService.getBannersByPosicion('hero').subscribe({
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
