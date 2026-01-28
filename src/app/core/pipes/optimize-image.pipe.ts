import { Pipe, PipeTransform, inject } from '@angular/core';
import { CloudinaryService } from '../services/cloudinary.service';

/**
 * Pipe para optimizar URLs de imágenes
 * 
 * Uso:
 * <img [src]="imageUrl | optimizeImage:'thumb'">
 * <img [src]="imageUrl | optimizeImage:'medium'">
 * <img [src]="imageUrl | optimizeImage:'large'">
 * 
 * Para agentes (cara centrada):
 * <img [src]="agentPhoto | optimizeImage:'agent'">
 */
@Pipe({
  name: 'optimizeImage',
  standalone: true
})
export class OptimizeImagePipe implements PipeTransform {
  private cloudinary = inject(CloudinaryService);

  transform(url: string | null | undefined, size: 'thumb' | 'medium' | 'large' | 'agent' = 'medium'): string {
    if (!url) {
      return this.getPlaceholder(size);
    }

    // Si es URL de Cloudinary, optimizar
    if (url.includes('cloudinary.com')) {
      if (size === 'agent') {
        return this.cloudinary.getAgentThumbnail(url);
      }
      return this.cloudinary.getPropertyImage(url, size as any);
    }

    // Si es URL de Unsplash, agregar parámetros de optimización
    if (url.includes('unsplash.com')) {
      return this.optimizeUnsplash(url, size);
    }

    // Si es ruta local, retornar tal cual
    return url;
  }

  private optimizeUnsplash(url: string, size: 'thumb' | 'medium' | 'large' | 'agent'): string {
    const sizes = {
      thumb: 'w=400&h=300',
      medium: 'w=800&h=600',
      large: 'w=1200&h=800',
      agent: 'w=400&h=400'
    };

    const params = sizes[size];
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params}&fit=crop&auto=format`;
  }

  private getPlaceholder(size: 'thumb' | 'medium' | 'large' | 'agent'): string {
    const sizes = {
      thumb: '400x300',
      medium: '800x600',
      large: '1200x800',
      agent: '400x400'
    };
    return `https://placehold.co/${sizes[size]}/e0e0e0/666?text=Sin+Imagen`;
  }
}
