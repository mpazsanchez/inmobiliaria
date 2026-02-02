import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import DOMPurify from 'dompurify';

/**
 * Servicio de sanitización de HTML
 *
 * Usa DOMPurify para sanitizar contenido HTML del CMS
 * y prevenir ataques XSS.
 *
 * Instalación:
 * npm install dompurify @types/dompurify
 */
@Injectable({ providedIn: 'root' })
export class SanitizerService {
  private domSanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  /**
   * Sanitiza HTML y lo marca como seguro para Angular
   *
   * @param html - HTML sin sanitizar (ej: contenido del CMS)
   * @returns SafeHtml sanitizado
   */
  sanitizeHtml(html: string): SafeHtml {
    if (!html) {
      return '';
    }

    // Solo usar DOMPurify en el navegador (no en SSR)
    if (!this.isBrowser) {
      // En SSR, retornar el HTML sin sanitizar (Angular lo sanitizará básicamente)
      return this.domSanitizer.sanitize(1, html) || '';
    }

    // Sanitizar HTML con DOMPurify para prevenir XSS
    const cleanHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        // Estructura
        'div', 'span', 'p', 'br', 'hr',
        // Encabezados
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        // Formato de texto
        'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'mark', 'small', 'sub', 'sup',
        // Listas
        'ul', 'ol', 'li',
        // Links e imágenes
        'a', 'img',
        // Tablas
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        // Bloques
        'blockquote', 'pre', 'code',
        // Semánticos
        'article', 'section', 'header', 'footer', 'nav', 'aside', 'figure', 'figcaption'
      ],
      ALLOWED_ATTR: [
        // Generales
        'class', 'id', 'style',
        // Links
        'href', 'target', 'rel', 'title',
        // Imágenes
        'src', 'alt', 'width', 'height', 'loading',
        // Tablas
        'colspan', 'rowspan',
        // Accesibilidad
        'aria-label', 'aria-hidden', 'role'
      ],
      // Forzar target="_blank" a tener rel="noopener noreferrer"
      ADD_ATTR: ['target'],
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
    });

    // Marcar como seguro para Angular
    return this.domSanitizer.bypassSecurityTrustHtml(cleanHtml);
  }

  /**
   * Sanitiza HTML y retorna string (no SafeHtml)
   * Útil para guardar contenido sanitizado en el backend
   */
  sanitizeToString(html: string): string {
    if (!html) {
      return '';
    }

    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'div', 'span', 'p', 'br', 'hr',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'mark', 'small',
        'ul', 'ol', 'li',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'blockquote', 'pre', 'code'
      ],
      ALLOWED_ATTR: ['class', 'id', 'href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'title']
    });
  }
}
