import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, delay, map, catchError, tap, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Testimonio, Beneficio, FAQ, Banner } from '../models';

/**
 * SERVICIO UNIFICADO DE CONTENIDO DINÁMICO
 * 
 * Este servicio maneja todo el contenido dinámico (Testimonios, Beneficios, FAQs, Banners)
 * tanto para el sitio público (lectura) como para el área de administración (CRUD completo).
 * 
 * MODO MOCK (useMockData = true):
 * - Lee datos desde archivos JSON en /assets/data/static-content/
 * - Mantiene estado en memoria con BehaviorSubjects
 * - Simula delays de red para testing
 * 
 * MODO API (useMockData = false):
 * - Consume endpoints REST del backend
 * - Solo cambiar la URL y el flag para migrar
 * 
 * @author Fairway Dev Team
 * @version 2.0.0 - Servicio Unificado
 */

// =============================================
// TIPOS Y FILTROS
// =============================================

export interface ContentFilters {
  busqueda?: string;
  activo?: boolean;
  categoria?: string;
  posicion?: string;
}

export interface ContentStats {
  testimonios: { total: number; activos: number };
  beneficios: { total: number; activos: number };
  faqs: { total: number; activos: number };
  banners: { total: number; activos: number };
}

export type ContentType = 'testimonios' | 'beneficios' | 'faqs' | 'banners';

// =============================================
// DATOS MOCK INICIALES
// =============================================

const TESTIMONIOS_INICIAL: Testimonio[] = [
  {
    id: 1,
    nombre: 'María García',
    ubicacion: 'Palermo, Buenos Aires',
    texto: 'Excelente atención de parte del equipo de Fairway. Encontramos nuestra casa ideal en tiempo récord.',
    fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    calificacion: 5,
    activo: true,
    orden: 1
  },
  {
    id: 2,
    nombre: 'Carlos Rodríguez',
    ubicacion: 'Nordelta, Tigre',
    texto: 'Vendimos nuestra propiedad en menos de un mes gracias a la estrategia de marketing de Fairway.',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    calificacion: 5,
    activo: true,
    orden: 2
  },
  {
    id: 3,
    nombre: 'Ana Martínez',
    ubicacion: 'Recoleta, Buenos Aires',
    texto: 'Como inversora, valoro mucho el conocimiento del mercado que tiene el equipo.',
    fotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    calificacion: 5,
    activo: true,
    orden: 3
  }
];

const BENEFICIOS_INICIAL: Beneficio[] = [
  {
    id: 1,
    icono: 'bi-shield-check',
    titulo: 'Confianza Garantizada',
    descripcion: 'Más de 15 años de experiencia en el mercado inmobiliario.',
    orden: 1,
    activo: true
  },
  {
    id: 2,
    icono: 'bi-people',
    titulo: 'Equipo Profesional',
    descripcion: 'Asesores certificados y especializados en diferentes segmentos.',
    orden: 2,
    activo: true
  },
  {
    id: 3,
    icono: 'bi-graph-up-arrow',
    titulo: 'Máximo Retorno',
    descripcion: 'Estrategias de pricing y marketing para obtener el mejor valor.',
    orden: 3,
    activo: true
  },
  {
    id: 4,
    icono: 'bi-headset',
    titulo: 'Atención Personalizada',
    descripcion: 'Acompañamiento durante todo el proceso.',
    orden: 4,
    activo: true
  }
];

const FAQS_INICIAL: FAQ[] = [
  {
    id: 1,
    pregunta: '¿Cuál es la comisión por venta de una propiedad?',
    respuesta: 'Nuestra comisión es del 3% + IVA sobre el valor de venta.',
    categoria: 'Comisiones',
    orden: 1,
    activo: true
  },
  {
    id: 2,
    pregunta: '¿Cómo puedo publicar mi propiedad con ustedes?',
    respuesta: 'Puedes contactarnos a través de nuestro formulario web, WhatsApp o llamarnos directamente.',
    categoria: 'Proceso',
    orden: 2,
    activo: true
  },
  {
    id: 3,
    pregunta: '¿Cuánto tiempo toma vender una propiedad?',
    respuesta: 'El tiempo promedio es de 60-90 días gracias a nuestras estrategias de marketing.',
    categoria: 'Proceso',
    orden: 3,
    activo: true
  },
  {
    id: 4,
    pregunta: '¿Realizan tasaciones gratuitas?',
    respuesta: 'Sí, ofrecemos tasaciones gratuitas sin compromiso.',
    categoria: 'Servicios',
    orden: 4,
    activo: true
  },
  {
    id: 5,
    pregunta: '¿Trabajan con créditos hipotecarios?',
    respuesta: 'Sí, tenemos alianzas con los principales bancos.',
    categoria: 'Financiamiento',
    orden: 5,
    activo: true
  }
];

const BANNERS_INICIAL: Banner[] = [
  {
    id: 1,
    titulo: 'Encontrá tu hogar ideal',
    subtitulo: 'Las mejores propiedades en las zonas más exclusivas',
    imagenUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=800&fit=crop',
    imagenMovilUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    enlace: '/propiedades',
    textoBoton: 'Ver propiedades',
    posicion: 'hero',
    orden: 1,
    activo: true
  },
  {
    id: 2,
    titulo: 'Vendé tu propiedad con nosotros',
    subtitulo: 'Tasación gratuita y el mejor asesoramiento del mercado',
    imagenUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=800&fit=crop',
    imagenMovilUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
    enlace: '/contacto',
    textoBoton: 'Solicitar tasación',
    posicion: 'hero',
    orden: 2,
    activo: true
  }
];

// =============================================
// SERVICIO
// =============================================

@Injectable({ providedIn: 'root' })
export class ContenidoDinamicoService {
  private http = inject(HttpClient);

  // ⚠️ CAMBIAR A FALSE CUANDO HAYA API REAL
  private useMockData = true;

  // URLs para API real
  private readonly API_URL = `${environment.apiUrl}/contenido`;

  // Estado en memoria (BehaviorSubjects para reactividad)
  private testimoniosSubject = new BehaviorSubject<Testimonio[]>([]);
  private beneficiosSubject = new BehaviorSubject<Beneficio[]>([]);
  private faqsSubject = new BehaviorSubject<FAQ[]>([]);
  private bannersSubject = new BehaviorSubject<Banner[]>([]);

  // Observables públicos
  testimonios$ = this.testimoniosSubject.asObservable();
  beneficios$ = this.beneficiosSubject.asObservable();
  faqs$ = this.faqsSubject.asObservable();
  banners$ = this.bannersSubject.asObservable();

  // Flag para saber si ya se cargaron los datos iniciales
  private datosInicializados = false;

  constructor() {
    // Cargar datos iniciales al instanciar el servicio
    this.inicializarDatos();
  }

  // =============================================
  // INICIALIZACIÓN
  // =============================================

  /**
   * Carga los datos iniciales desde JSON o usa datos mock
   */
  private inicializarDatos(): void {
    if (this.datosInicializados) return;

    if (this.useMockData) {
      // Intentar cargar desde JSON, si falla usar datos iniciales
      this.cargarDesdeJSON();
    }

    this.datosInicializados = true;
  }

  /**
   * Carga datos desde archivos JSON
   */
  private cargarDesdeJSON(): void {
    // Cargar testimonios
    this.http.get<{ testimonios: Testimonio[] }>('/assets/data/static-content/testimonios.json')
      .pipe(
        catchError(() => of({ testimonios: TESTIMONIOS_INICIAL })),
        tap(data => this.testimoniosSubject.next(data.testimonios))
      )
      .subscribe();

    // Cargar beneficios (del mismo archivo de testimonios)
    this.http.get<{ beneficios: Beneficio[] }>('/assets/data/static-content/testimonios.json')
      .pipe(
        catchError(() => of({ beneficios: BENEFICIOS_INICIAL })),
        tap(data => this.beneficiosSubject.next(data.beneficios))
      )
      .subscribe();

    // Cargar FAQs
    this.http.get<{ faqs: FAQ[] }>('/assets/data/static-content/faqs-list.json')
      .pipe(
        catchError(() => of({ faqs: FAQS_INICIAL })),
        tap(data => this.faqsSubject.next(data.faqs))
      )
      .subscribe();

    // Cargar Banners
    this.http.get<{ banners: Banner[] }>('/assets/data/static-content/banners.json')
      .pipe(
        catchError(() => of({ banners: BANNERS_INICIAL })),
        tap(data => this.bannersSubject.next(data.banners))
      )
      .subscribe();
  }

  // =============================================
  // TESTIMONIOS - LECTURA (Público)
  // =============================================

  getTestimonios(filters?: ContentFilters): Observable<Testimonio[]> {
    if (this.useMockData) {
      return this.testimonios$.pipe(
        map(items => this.applyFiltersTestimonios(items, filters)),
        delay(300)
      );
    }
    return this.http.get<Testimonio[]>(`${this.API_URL}/testimonios`);
  }

  getTestimonioById(id: number): Observable<Testimonio | null> {
    if (this.useMockData) {
      const item = this.testimoniosSubject.value.find(t => t.id === id);
      return of(item || null).pipe(delay(200));
    }
    return this.http.get<Testimonio>(`${this.API_URL}/testimonios/${id}`);
  }

  getTestimoniosDestacados(limite: number = 3): Observable<Testimonio[]> {
    return this.getTestimonios({ activo: true }).pipe(
      map(testimonios => testimonios.slice(0, limite))
    );
  }

  // =============================================
  // TESTIMONIOS - ESCRITURA (Admin)
  // =============================================

  createTestimonio(data: Partial<Testimonio>): Observable<Testimonio> {
    if (this.useMockData) {
      const current = this.testimoniosSubject.value;
      const newId = current.length > 0 ? Math.max(...current.map(t => t.id)) + 1 : 1;
      const newItem: Testimonio = {
        id: newId,
        nombre: data.nombre || '',
        ubicacion: data.ubicacion || '',
        texto: data.texto || '',
        fotoUrl: data.fotoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        calificacion: data.calificacion || 5,
        activo: data.activo ?? true,
        orden: data.orden || current.length + 1
      };
      this.testimoniosSubject.next([...current, newItem]);
      return of(newItem).pipe(delay(500));
    }
    return this.http.post<Testimonio>(`${this.API_URL}/testimonios`, data);
  }

  updateTestimonio(id: number, data: Partial<Testimonio>): Observable<Testimonio> {
    if (this.useMockData) {
      const current = this.testimoniosSubject.value;
      const index = current.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Testimonio no encontrado');

      const updated: Testimonio = { ...current[index], ...data };
      const newList = [...current];
      newList[index] = updated;
      this.testimoniosSubject.next(newList);
      return of(updated).pipe(delay(500));
    }
    return this.http.put<Testimonio>(`${this.API_URL}/testimonios/${id}`, data);
  }

  deleteTestimonio(id: number): Observable<boolean> {
    if (this.useMockData) {
      const current = this.testimoniosSubject.value;
      this.testimoniosSubject.next(current.filter(t => t.id !== id));
      return of(true).pipe(delay(300));
    }
    return this.http.delete<void>(`${this.API_URL}/testimonios/${id}`).pipe(map(() => true));
  }

  toggleTestimonioActivo(id: number): Observable<Testimonio> {
    if (this.useMockData) {
      const current = this.testimoniosSubject.value;
      const index = current.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Testimonio no encontrado');

      const updated: Testimonio = { ...current[index], activo: !current[index].activo };
      const newList = [...current];
      newList[index] = updated;
      this.testimoniosSubject.next(newList);
      return of(updated).pipe(delay(300));
    }
    return this.http.patch<Testimonio>(`${this.API_URL}/testimonios/${id}/toggle`, {});
  }

  // =============================================
  // BENEFICIOS - LECTURA (Público)
  // =============================================

  getBeneficios(filters?: ContentFilters): Observable<Beneficio[]> {
    if (this.useMockData) {
      return this.beneficios$.pipe(
        map(items => this.applyFiltersBeneficios(items, filters)),
        delay(300)
      );
    }
    return this.http.get<Beneficio[]>(`${this.API_URL}/beneficios`);
  }

  getBeneficioById(id: number): Observable<Beneficio | null> {
    if (this.useMockData) {
      const item = this.beneficiosSubject.value.find(b => b.id === id);
      return of(item || null).pipe(delay(200));
    }
    return this.http.get<Beneficio>(`${this.API_URL}/beneficios/${id}`);
  }

  // =============================================
  // BENEFICIOS - ESCRITURA (Admin)
  // =============================================

  createBeneficio(data: Partial<Beneficio>): Observable<Beneficio> {
    if (this.useMockData) {
      const current = this.beneficiosSubject.value;
      const newId = current.length > 0 ? Math.max(...current.map(b => b.id)) + 1 : 1;
      const newItem: Beneficio = {
        id: newId,
        icono: data.icono || 'bi-star',
        titulo: data.titulo || '',
        descripcion: data.descripcion || '',
        orden: data.orden || current.length + 1,
        activo: data.activo ?? true
      };
      this.beneficiosSubject.next([...current, newItem]);
      return of(newItem).pipe(delay(500));
    }
    return this.http.post<Beneficio>(`${this.API_URL}/beneficios`, data);
  }

  updateBeneficio(id: number, data: Partial<Beneficio>): Observable<Beneficio> {
    if (this.useMockData) {
      const current = this.beneficiosSubject.value;
      const index = current.findIndex(b => b.id === id);
      if (index === -1) throw new Error('Beneficio no encontrado');

      const updated: Beneficio = { ...current[index], ...data };
      const newList = [...current];
      newList[index] = updated;
      this.beneficiosSubject.next(newList);
      return of(updated).pipe(delay(500));
    }
    return this.http.put<Beneficio>(`${this.API_URL}/beneficios/${id}`, data);
  }

  deleteBeneficio(id: number): Observable<boolean> {
    if (this.useMockData) {
      const current = this.beneficiosSubject.value;
      this.beneficiosSubject.next(current.filter(b => b.id !== id));
      return of(true).pipe(delay(300));
    }
    return this.http.delete<void>(`${this.API_URL}/beneficios/${id}`).pipe(map(() => true));
  }

  toggleBeneficioActivo(id: number): Observable<Beneficio> {
    if (this.useMockData) {
      const current = this.beneficiosSubject.value;
      const index = current.findIndex(b => b.id === id);
      if (index === -1) throw new Error('Beneficio no encontrado');

      const updated: Beneficio = { ...current[index], activo: !current[index].activo };
      const newList = [...current];
      newList[index] = updated;
      this.beneficiosSubject.next(newList);
      return of(updated).pipe(delay(300));
    }
    return this.http.patch<Beneficio>(`${this.API_URL}/beneficios/${id}/toggle`, {});
  }

  // =============================================
  // FAQS - LECTURA (Público)
  // =============================================

  getFaqs(filters?: ContentFilters): Observable<FAQ[]> {
    if (this.useMockData) {
      return this.faqs$.pipe(
        map(items => this.applyFiltersFaqs(items, filters)),
        delay(300)
      );
    }
    return this.http.get<FAQ[]>(`${this.API_URL}/faqs`);
  }

  getFaqById(id: number): Observable<FAQ | null> {
    if (this.useMockData) {
      const item = this.faqsSubject.value.find(f => f.id === id);
      return of(item || null).pipe(delay(200));
    }
    return this.http.get<FAQ>(`${this.API_URL}/faqs/${id}`);
  }

  getFaqsByCategoria(categoria: string): Observable<FAQ[]> {
    return this.getFaqs({ categoria, activo: true });
  }

  // =============================================
  // FAQS - ESCRITURA (Admin)
  // =============================================

  createFaq(data: Partial<FAQ>): Observable<FAQ> {
    if (this.useMockData) {
      const current = this.faqsSubject.value;
      const newId = current.length > 0 ? Math.max(...current.map(f => f.id)) + 1 : 1;
      const newItem: FAQ = {
        id: newId,
        pregunta: data.pregunta || '',
        respuesta: data.respuesta || '',
        categoria: data.categoria,
        orden: data.orden || current.length + 1,
        activo: data.activo ?? true
      };
      this.faqsSubject.next([...current, newItem]);
      return of(newItem).pipe(delay(500));
    }
    return this.http.post<FAQ>(`${this.API_URL}/faqs`, data);
  }

  updateFaq(id: number, data: Partial<FAQ>): Observable<FAQ> {
    if (this.useMockData) {
      const current = this.faqsSubject.value;
      const index = current.findIndex(f => f.id === id);
      if (index === -1) throw new Error('FAQ no encontrada');

      const updated: FAQ = { ...current[index], ...data };
      const newList = [...current];
      newList[index] = updated;
      this.faqsSubject.next(newList);
      return of(updated).pipe(delay(500));
    }
    return this.http.put<FAQ>(`${this.API_URL}/faqs/${id}`, data);
  }

  deleteFaq(id: number): Observable<boolean> {
    if (this.useMockData) {
      const current = this.faqsSubject.value;
      this.faqsSubject.next(current.filter(f => f.id !== id));
      return of(true).pipe(delay(300));
    }
    return this.http.delete<void>(`${this.API_URL}/faqs/${id}`).pipe(map(() => true));
  }

  toggleFaqActivo(id: number): Observable<FAQ> {
    if (this.useMockData) {
      const current = this.faqsSubject.value;
      const index = current.findIndex(f => f.id === id);
      if (index === -1) throw new Error('FAQ no encontrada');

      const updated: FAQ = { ...current[index], activo: !current[index].activo };
      const newList = [...current];
      newList[index] = updated;
      this.faqsSubject.next(newList);
      return of(updated).pipe(delay(300));
    }
    return this.http.patch<FAQ>(`${this.API_URL}/faqs/${id}/toggle`, {});
  }

  // =============================================
  // BANNERS - LECTURA (Público)
  // =============================================

  getBanners(filters?: ContentFilters): Observable<Banner[]> {
    if (this.useMockData) {
      return this.banners$.pipe(
        map(items => this.applyFiltersBanners(items, filters)),
        delay(300)
      );
    }
    return this.http.get<Banner[]>(`${this.API_URL}/banners`);
  }

  getBannerById(id: number): Observable<Banner | null> {
    if (this.useMockData) {
      const item = this.bannersSubject.value.find(b => b.id === id);
      return of(item || null).pipe(delay(200));
    }
    return this.http.get<Banner>(`${this.API_URL}/banners/${id}`);
  }

  getBannersByPosicion(posicion: 'hero' | 'secundario' | 'promocional'): Observable<Banner[]> {
    return this.getBanners({ posicion, activo: true });
  }

  // =============================================
  // BANNERS - ESCRITURA (Admin)
  // =============================================

  createBanner(data: Partial<Banner>): Observable<Banner> {
    if (this.useMockData) {
      const current = this.bannersSubject.value;
      const newId = current.length > 0 ? Math.max(...current.map(b => b.id)) + 1 : 1;
      const newItem: Banner = {
        id: newId,
        titulo: data.titulo || '',
        subtitulo: data.subtitulo,
        imagenUrl: data.imagenUrl || '',
        imagenMovilUrl: data.imagenMovilUrl,
        enlace: data.enlace,
        textoBoton: data.textoBoton,
        posicion: data.posicion || 'hero',
        orden: data.orden || current.length + 1,
        activo: data.activo ?? true,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin
      };
      this.bannersSubject.next([...current, newItem]);
      return of(newItem).pipe(delay(500));
    }
    return this.http.post<Banner>(`${this.API_URL}/banners`, data);
  }

  updateBanner(id: number, data: Partial<Banner>): Observable<Banner> {
    if (this.useMockData) {
      const current = this.bannersSubject.value;
      const index = current.findIndex(b => b.id === id);
      if (index === -1) throw new Error('Banner no encontrado');

      const updated: Banner = { ...current[index], ...data };
      const newList = [...current];
      newList[index] = updated;
      this.bannersSubject.next(newList);
      return of(updated).pipe(delay(500));
    }
    return this.http.put<Banner>(`${this.API_URL}/banners/${id}`, data);
  }

  deleteBanner(id: number): Observable<boolean> {
    if (this.useMockData) {
      const current = this.bannersSubject.value;
      this.bannersSubject.next(current.filter(b => b.id !== id));
      return of(true).pipe(delay(300));
    }
    return this.http.delete<void>(`${this.API_URL}/banners/${id}`).pipe(map(() => true));
  }

  toggleBannerActivo(id: number): Observable<Banner> {
    if (this.useMockData) {
      const current = this.bannersSubject.value;
      const index = current.findIndex(b => b.id === id);
      if (index === -1) throw new Error('Banner no encontrado');

      const updated: Banner = { ...current[index], activo: !current[index].activo };
      const newList = [...current];
      newList[index] = updated;
      this.bannersSubject.next(newList);
      return of(updated).pipe(delay(300));
    }
    return this.http.patch<Banner>(`${this.API_URL}/banners/${id}/toggle`, {});
  }

  // =============================================
  // TOGGLE GENÉRICO (Admin)
  // =============================================

  toggleActivo(type: ContentType, id: number): Observable<any> {
    const toggleActions: Record<ContentType, (id: number) => Observable<any>> = {
      testimonios: (id) => this.toggleTestimonioActivo(id),
      beneficios: (id) => this.toggleBeneficioActivo(id),
      faqs: (id) => this.toggleFaqActivo(id),
      banners: (id) => this.toggleBannerActivo(id)
    };

    return toggleActions[type](id);
  }

  // =============================================
  // ESTADÍSTICAS (Admin)
  // =============================================

  getStats(): Observable<ContentStats> {
    if (this.useMockData) {
      return of({
        testimonios: {
          total: this.testimoniosSubject.value.length,
          activos: this.testimoniosSubject.value.filter(t => t.activo).length
        },
        beneficios: {
          total: this.beneficiosSubject.value.length,
          activos: this.beneficiosSubject.value.filter(b => b.activo).length
        },
        faqs: {
          total: this.faqsSubject.value.length,
          activos: this.faqsSubject.value.filter(f => f.activo).length
        },
        banners: {
          total: this.bannersSubject.value.length,
          activos: this.bannersSubject.value.filter(b => b.activo).length
        }
      }).pipe(delay(200));
    }
    return this.http.get<ContentStats>(`${this.API_URL}/stats`);
  }

  // =============================================
  // OPCIONES PARA FORMULARIOS (Admin)
  // =============================================

  getCategoriasFaq(): string[] {
    return ['Comisiones', 'Proceso', 'Servicios', 'Financiamiento', 'Legal', 'General'];
  }

  getPosicionesBanner(): { value: string; label: string }[] {
    return [
      { value: 'hero', label: 'Hero (Principal)' },
      { value: 'secundario', label: 'Secundario' },
      { value: 'promocional', label: 'Promocional' }
    ];
  }

  getIconosDisponibles(): string[] {
    return [
      'bi-shield-check',
      'bi-people',
      'bi-graph-up-arrow',
      'bi-headset',
      'bi-house',
      'bi-award',
      'bi-star',
      'bi-heart',
      'bi-check-circle',
      'bi-lightning',
      'bi-clock',
      'bi-geo-alt',
      'bi-phone',
      'bi-envelope',
      'bi-cash-coin',
      'bi-key',
      'bi-building',
      'bi-briefcase'
    ];
  }

  // =============================================
  // MÉTODOS PRIVADOS - FILTROS
  // =============================================

  private applyFiltersTestimonios(items: Testimonio[], filters?: ContentFilters): Testimonio[] {
    if (!filters) return items.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    let result = [...items];

    if (filters.busqueda) {
      const search = filters.busqueda.toLowerCase();
      result = result.filter(t =>
        t.nombre.toLowerCase().includes(search) ||
        t.ubicacion.toLowerCase().includes(search) ||
        t.texto.toLowerCase().includes(search)
      );
    }

    if (filters.activo !== undefined) {
      result = result.filter(t => t.activo === filters.activo);
    }

    return result.sort((a, b) => (a.orden || 0) - (b.orden || 0));
  }

  private applyFiltersBeneficios(items: Beneficio[], filters?: ContentFilters): Beneficio[] {
    if (!filters) return items.sort((a, b) => a.orden - b.orden);
    let result = [...items];

    if (filters.busqueda) {
      const search = filters.busqueda.toLowerCase();
      result = result.filter(b =>
        b.titulo.toLowerCase().includes(search) ||
        b.descripcion.toLowerCase().includes(search)
      );
    }

    if (filters.activo !== undefined) {
      result = result.filter(b => b.activo === filters.activo);
    }

    return result.sort((a, b) => a.orden - b.orden);
  }

  private applyFiltersFaqs(items: FAQ[], filters?: ContentFilters): FAQ[] {
    if (!filters) return items.sort((a, b) => a.orden - b.orden);
    let result = [...items];

    if (filters.busqueda) {
      const search = filters.busqueda.toLowerCase();
      result = result.filter(f =>
        f.pregunta.toLowerCase().includes(search) ||
        f.respuesta.toLowerCase().includes(search)
      );
    }

    if (filters.activo !== undefined) {
      result = result.filter(f => f.activo === filters.activo);
    }

    if (filters.categoria) {
      result = result.filter(f => f.categoria === filters.categoria);
    }

    return result.sort((a, b) => a.orden - b.orden);
  }

  private applyFiltersBanners(items: Banner[], filters?: ContentFilters): Banner[] {
    if (!filters) return items.sort((a, b) => a.orden - b.orden);
    let result = [...items];

    if (filters.busqueda) {
      const search = filters.busqueda.toLowerCase();
      result = result.filter(b =>
        b.titulo.toLowerCase().includes(search) ||
        (b.subtitulo?.toLowerCase().includes(search) ?? false)
      );
    }

    if (filters.activo !== undefined) {
      result = result.filter(b => b.activo === filters.activo);
    }

    if (filters.posicion) {
      result = result.filter(b => b.posicion === filters.posicion);
    }

    return result.sort((a, b) => a.orden - b.orden);
  }
}
