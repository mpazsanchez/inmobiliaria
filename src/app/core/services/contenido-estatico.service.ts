import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContenidoEstatico, TipoPaginaEstatica } from '../models/static-content/contenido-estatico.interface';

/**
 * Service for managing static page content
 * Allows creating, reading, updating and deleting editable content from admin
 */
@Injectable({
  providedIn: 'root'
})
export class ContenidoEstaticoService {
  private apiUrl = `${environment.apiUrl}/static-content`;
  private useMockData = true; // Change to false when API is ready

  constructor(private http: HttpClient) {}

  /**
   * Gets content for a specific page
   * @param pagina Page identifier (e.g.: "nosotros", "contacto")
   */
  getPageContent(pagina: TipoPaginaEstatica): Observable<ContenidoEstatico> {
    if (this.useMockData) {
      // Load individual JSON file for the page
      return this.http.get<ContenidoEstatico>(`/assets/data/static-content/${pagina}.json`).pipe(
        map(contenido => contenido || this.getDefaultContent(pagina)),
        delay(300)
      );
    }

    return this.http.get<ContenidoEstatico>(`${this.apiUrl}/${pagina}`);
  }

  /**
   * Gets all static content pages
   */
  getAllContent(): Observable<ContenidoEstatico[]> {
    if (this.useMockData) {
      // Load all individual files in parallel
      const paginas: TipoPaginaEstatica[] = ['nosotros', 'contacto', 'terminos', 'privacidad', 'servicios', 'faqs'];
      const requests = paginas.map(pagina => 
        this.http.get<ContenidoEstatico>(`/assets/data/static-content/${pagina}.json`)
      );
      
      return forkJoin(requests).pipe(delay(300));
    }

    return this.http.get<ContenidoEstatico[]>(this.apiUrl);
  }

  /**
   * Creates a new static content page
   * @param contenido Content data to create
   */
  createContent(contenido: Omit<ContenidoEstatico, 'ultimaActualizacion'>): Observable<ContenidoEstatico> {
    if (this.useMockData) {
      const nuevoContenido: ContenidoEstatico = {
        ...contenido,
        ultimaActualizacion: new Date().toISOString(),
        publicada: contenido.publicada ?? true
      };
      return of(nuevoContenido).pipe(delay(300));
    }

    return this.http.post<ContenidoEstatico>(this.apiUrl, contenido);
  }

  /**
   * Updates content of an existing page
   * @param pagina Page identifier
   * @param contenido Updated data
   */
  updateContent(
    pagina: string, 
    contenido: Partial<ContenidoEstatico>
  ): Observable<ContenidoEstatico> {
    if (this.useMockData) {
      return this.getPageContent(pagina as TipoPaginaEstatica).pipe(
        map(current => ({
          ...current,
          ...contenido,
          ultimaActualizacion: new Date().toISOString()
        })),
        delay(300)
      );
    }

    return this.http.put<ContenidoEstatico>(`${this.apiUrl}/${pagina}`, contenido);
  }

  /**
   * Deletes a static content page
   * @param pagina Page identifier to delete
   */
  deleteContent(pagina: string): Observable<void> {
    if (this.useMockData) {
      return of(void 0).pipe(delay(300));
    }

    return this.http.delete<void>(`${this.apiUrl}/${pagina}`);
  }

  /**
   * Publishes or unpublishes a page
   * @param pagina Page identifier
   * @param publicada Publication status
   */
  togglePublicationStatus(pagina: string, publicada: boolean): Observable<ContenidoEstatico> {
    return this.updateContent(pagina, { publicada });
  }

  // ============================================
  // PRIVATE METHODS - MOCK DATA
  // ============================================

  /**
   * Returns default content for a page
   */
  private getDefaultContent(pagina: TipoPaginaEstatica): ContenidoEstatico {
    return {
      pagina,
      titulo: 'Página sin contenido',
      contenidoHtml: '<p>Esta página aún no tiene contenido disponible.</p>',
      ultimaActualizacion: new Date().toISOString(),
      publicada: false
    };
  }
}
