import { Component, Input, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Imagen } from '../../../../core/models';

@Component({
  selector: 'app-property-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-gallery.component.html',
  styleUrl: './property-gallery.component.scss'
})
export class PropertyGalleryComponent {
  @Input() imagenes: Imagen[] = [];
  @Input() titulo: string = '';
  @Input() videoUrl?: string;
  @Input() video360Url?: string;

  selectedIndex = 0;
  lightboxOpen = false;
  activeTab: 'fotos' | 'videos' | '360' = 'fotos';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  get mainImage(): string {
    if (this.imagenes.length === 0) return 'assets/images/placeholder-property.jpg';
    return this.imagenes[this.selectedIndex]?.url || 'assets/images/placeholder-property.jpg';
  }

  get thumbnails(): Imagen[] {
    return this.imagenes.slice(0, 5);
  }

  get hasMoreImages(): number {
    return this.imagenes.length > 5 ? this.imagenes.length - 5 : 0;
  }

  selectImage(index: number): void {
    this.selectedIndex = index;
  }

  openLightbox(index: number = this.selectedIndex): void {
    if (!this.isBrowser) return;
    this.selectedIndex = index;
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    if (!this.isBrowser) return;
    this.lightboxOpen = false;
    document.body.style.overflow = '';
  }

  nextImage(event?: Event): void {
    event?.stopPropagation();
    if (this.selectedIndex < this.imagenes.length - 1) {
      this.selectedIndex++;
    } else {
      this.selectedIndex = 0;
    }
  }

  prevImage(event?: Event): void {
    event?.stopPropagation();
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    } else {
      this.selectedIndex = this.imagenes.length - 1;
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.lightboxOpen) return;

    switch (event.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
      case 'ArrowLeft':
        this.prevImage();
        break;
    }
  }

  changeTab(tab: 'fotos' | 'videos' | '360'): void {
    this.activeTab = tab;
    this.selectedIndex = 0;
  }
}
