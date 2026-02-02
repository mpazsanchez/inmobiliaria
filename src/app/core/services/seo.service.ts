import { Injectable, inject, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Propiedad } from '../models/property.interface';

/**
 * Servicio de SEO para gestionar meta tags dinámicamente
 * Usa los servicios Meta y Title de Angular para actualizar
 * las meta tags del documento HTML
 * 
 * NUEVO: Incluye Structured Data (JSON-LD) para mejor indexación en Google
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private meta = inject(Meta);
  private titleService = inject(Title);
  private renderer: Renderer2;
  private baseUrl = 'https://fairway.com.ar'; // TODO: Cambiar por dominio real

  private readonly defaultTitle = 'Fairway Inmobiliaria | Propiedades en Buenos Aires';
  private readonly defaultDescription = 'Fairway Inmobiliaria - Tu socio de confianza para comprar, vender o alquilar propiedades en Buenos Aires. Más de 12 años de experiencia.';
  private readonly defaultKeywords = 'inmobiliaria, propiedades, venta, alquiler, Buenos Aires, departamentos, casas';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

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
    // Twitter Card
    this.meta.updateTag({ name: 'twitter:description', content: desc });
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
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
      this.meta.updateTag({ name: 'twitter:image', content: imageUrl });
      this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    }
  }

  /**
   * NUEVO: Configura meta tags completos para una propiedad
   * Incluye Open Graph y Twitter Cards optimizados
   */
  setPropertyMeta(propiedad: Propiedad): void {
    // Título SEO optimizado
    const title = `${propiedad.titulo} | ${propiedad.ubicacion.barrio || propiedad.ubicacion.ciudad}`;
    this.setTitle(title);

    // Descripción dinámica con datos clave
    const descripcion = `${propiedad.operacion} - ${propiedad.caracteristicas.ambientes} amb, ${propiedad.caracteristicas.dormitorios} dorm, ${propiedad.caracteristicas.banos} baños, ${propiedad.caracteristicas.superficie_total}m². ${propiedad.descripcion.substring(0, 120)}...`;
    this.setDescription(descripcion);

    // Keywords dinámicas basadas en la propiedad
    const keywords = [
      propiedad.tipoPropiedad.toLowerCase(),
      propiedad.operacion.toLowerCase(),
      propiedad.ubicacion.ciudad,
      propiedad.ubicacion.barrio,
      `${propiedad.caracteristicas.ambientes} ambientes`,
      `${propiedad.caracteristicas.dormitorios} dormitorios`,
      `${propiedad.caracteristicas.banos} baños`,
      'inmobiliaria Argentina'
    ].filter(Boolean).join(', ');
    this.setKeywords(keywords);

    // Imagen principal
    const imagen = propiedad.imagenes && propiedad.imagenes.length > 0 
      ? propiedad.imagenes[0].url 
      : `${this.baseUrl}/assets/images/default-property.jpg`;
    this.setImage(imagen);

    // URL canónica
    this.setCanonicalUrl(`${this.baseUrl}/property/${propiedad.id}`);

    // Meta tags adicionales para productos
    this.meta.updateTag({ property: 'product:price:amount', content: propiedad.precio.toString() });
    this.meta.updateTag({ property: 'product:price:currency', content: 'ARS' });
    this.meta.updateTag({ property: 'og:type', content: 'product' });
  }

  /**
   * NUEVO: Genera Structured Data (JSON-LD) para una propiedad
   * Google usa esto para Rich Snippets en resultados de búsqueda
   * 
   * ¿Qué es JSON-LD?
   * - Formato de datos estructurados que Google entiende
   * - Aparece como "rich results" en búsquedas (precio, ubicación, etc.)
   * - Mejora el CTR (Click Through Rate) desde Google
   */
  addPropertyStructuredData(propiedad: Propiedad): void {
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'property-structured-data';
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "name": propiedad.titulo,
      "description": propiedad.descripcion,
      "url": `${this.baseUrl}/property/${propiedad.id}`,
      "image": propiedad.imagenes?.map(img => img.url) || [],
      "offers": {
        "@type": "Offer",
        "priceCurrency": "ARS",
        "price": propiedad.precio,
        "availability": "https://schema.org/InStock"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": propiedad.ubicacion.direccion,
        "addressLocality": propiedad.ubicacion.ciudad,
        "addressRegion": propiedad.ubicacion.provincia,
        "addressCountry": "AR"
      },
      "geo": propiedad.ubicacion.coordenadas ? {
        "@type": "GeoCoordinates",
        "latitude": propiedad.ubicacion.coordenadas.lat,
        "longitude": propiedad.ubicacion.coordenadas.lng
      } : undefined,
      "numberOfRooms": propiedad.caracteristicas.ambientes,
      "numberOfBedrooms": propiedad.caracteristicas.dormitorios,
      "numberOfBathroomsTotal": propiedad.caracteristicas.banos,
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": propiedad.caracteristicas.superficie_total,
        "unitCode": "MTK"
      }
    };

    script.textContent = JSON.stringify(structuredData);
    
    // Remover script anterior si existe
    this.removeStructuredData('property-structured-data');
    
    // Agregar al head
    this.renderer.appendChild(this.document.head, script);
  }

  /**
   * NUEVO: Agrega Structured Data para la organización (Fairway)
   * Se usa en la página de inicio y páginas principales
   */
  addOrganizationStructuredData(): void {
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'organization-structured-data';
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Fairway Inmobiliaria",
      "url": this.baseUrl,
      "logo": `${this.baseUrl}/assets/images/logos/logo-fairway.png`,
      "description": "Inmobiliaria líder en Argentina especializada en venta y alquiler de propiedades.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Buenos Aires",
        "addressRegion": "CABA",
        "addressCountry": "AR"
      },
      "sameAs": [
        "https://www.facebook.com/fairwayinmobiliaria",
        "https://www.instagram.com/fairwayinmobiliaria"
      ]
    };

    script.textContent = JSON.stringify(structuredData);
    this.removeStructuredData('organization-structured-data');
    this.renderer.appendChild(this.document.head, script);
  }

  /**
   * Remueve un script de structured data por ID
   */
  private removeStructuredData(id: string): void {
    const existingScript = this.document.getElementById(id);
    if (existingScript) {
      this.renderer.removeChild(this.document.head, existingScript);
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
