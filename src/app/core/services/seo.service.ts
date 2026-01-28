import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

/**
 * Servicio de SEO para gestionar meta tags dinámicamente
 * Usa los servicios Meta y Title de Angular para actualizar
 * las meta tags del documento HTML
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta = inject(Meta);
  private titleService = inject(Title);

  private readonly defaultTitle = 'Fairway Inmobiliaria | Propiedades en Buenos Aires';
  private readonly defaultDescription = 'Fairway Inmobiliaria - Tu socio de confianza para comprar, vender o alquilar propiedades en Buenos Aires. Más de 12 años de experiencia.';
  private readonly defaultKeywords = 'inmobiliaria, propiedades, venta, alquiler, Buenos Aires, departamentos, casas';

  /**
   * Actualiza el título de la página
   */
  setTitle(title: string): void {
    const fullTitle = title ? `${title} | Fairway Inmobiliaria` : this.defaultTitle;
    this.titleService.setTitle(fullTitle);
  }

  /**
   * Actualiza la meta descripción
   */
  setDescription(description: string): void {
    const desc = description || this.defaultDescription;
    this.meta.updateTag({ name: 'description', content: desc });
    // También para Open Graph (redes sociales)
    this.meta.updateTag({ property: 'og:description', content: desc });
  }

  /**
   * Actualiza las meta keywords
   */
  setKeywords(keywords: string): void {
    const kw = keywords || this.defaultKeywords;
    this.meta.updateTag({ name: 'keywords', content: kw });
  }

  /**
   * Actualiza la URL canónica
   */
  setCanonicalUrl(url: string): void {
    this.meta.updateTag({ property: 'og:url', content: url });
  }

  /**
   * Actualiza la imagen para Open Graph (redes sociales)
   */
  setImage(imageUrl: string): void {
    if (imageUrl) {
      this.meta.updateTag({ property: 'og:image', content: imageUrl });
    }
  }

  /**
   * Método conveniente para actualizar todos los meta tags a la vez
   */
  updateMetaTags(config: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
  }): void {
    if (config.title !== undefined) {
      this.setTitle(config.title);
    }
    if (config.description !== undefined) {
      this.setDescription(config.description);
    }
    if (config.keywords !== undefined) {
      this.setKeywords(config.keywords);
    }
    if (config.image) {
      this.setImage(config.image);
    }
    if (config.url) {
      this.setCanonicalUrl(config.url);
    }
  }

  /**
   * Resetea a los valores por defecto
   */
  resetToDefaults(): void {
    this.setTitle('');
    this.setDescription('');
    this.setKeywords('');
  }
}
