import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import type { Testimonio, Beneficio, FAQ, Banner } from '../../../core/models';

// =============================================
// MOCK DATA
// =============================================
const TESTIMONIOS_MOCK: Testimonio[] = [
  {
    id: 1,
    nombre: 'María García',
    ubicacion: 'Palermo, Buenos Aires',
    texto: 'Excelente atención de parte del equipo de Fairway. Encontramos nuestra casa ideal en tiempo récord. La asesoría fue profesional y siempre estuvieron disponibles para resolver nuestras dudas.',
    fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    calificacion: 5,
    activo: true,
    orden: 1
  },
  {
    id: 2,
    nombre: 'Carlos Rodríguez',
    ubicacion: 'Nordelta, Tigre',
    texto: 'Vendimos nuestra propiedad en menos de un mes gracias a la estrategia de marketing de Fairway. El proceso fue transparente y profesional de principio a fin.',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    calificacion: 5,
    activo: true,
    orden: 2
  },
  {
    id: 3,
    nombre: 'Ana Martínez',
    ubicacion: 'Recoleta, Buenos Aires',
    texto: 'Como inversora, valoro mucho el conocimiento del mercado que tiene el equipo. Me ayudaron a identificar las mejores oportunidades de inversión.',
    fotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    calificacion: 5,
    activo: true,
    orden: 3
  }
];

const BENEFICIOS_MOCK: Beneficio[] = [
  {
    id: 1,
    icono: 'bi-shield-check',
    titulo: 'Confianza Garantizada',
    descripcion: 'Más de 15 años de experiencia en el mercado inmobiliario con miles de clientes satisfechos.',
    orden: 1,
    activo: true
  },
  {
    id: 2,
    icono: 'bi-people',
    titulo: 'Equipo Profesional',
    descripcion: 'Asesores certificados y especializados en diferentes segmentos del mercado.',
    orden: 2,
    activo: true
  },
  {
    id: 3,
    icono: 'bi-graph-up-arrow',
    titulo: 'Máximo Retorno',
    descripcion: 'Estrategias de pricing y marketing para obtener el mejor valor por tu propiedad.',
    orden: 3,
    activo: true
  },
  {
    id: 4,
    icono: 'bi-headset',
    titulo: 'Atención Personalizada',
    descripcion: 'Acompañamiento durante todo el proceso, disponibles cuando nos necesites.',
    orden: 4,
    activo: true
  }
];

const FAQS_MOCK: FAQ[] = [
  {
    id: 1,
    pregunta: '¿Cuál es la comisión por venta de una propiedad?',
    respuesta: 'Nuestra comisión es del 3% + IVA sobre el valor de venta, tanto para el comprador como para el vendedor. Este porcentaje incluye todos los servicios de asesoramiento, marketing y gestión de la operación.',
    categoria: 'Comisiones',
    orden: 1,
    activo: true
  },
  {
    id: 2,
    pregunta: '¿Cómo puedo publicar mi propiedad con ustedes?',
    respuesta: 'Puedes contactarnos a través de nuestro formulario web, WhatsApp o llamarnos directamente. Un asesor visitará tu propiedad para una tasación gratuita y te explicará nuestro proceso de venta.',
    categoria: 'Proceso',
    orden: 2,
    activo: true
  },
  {
    id: 3,
    pregunta: '¿Cuánto tiempo toma vender una propiedad?',
    respuesta: 'El tiempo promedio de venta depende de varios factores como ubicación, precio y condiciones del mercado. En promedio, nuestras propiedades se venden en 60-90 días gracias a nuestras estrategias de marketing.',
    categoria: 'Proceso',
    orden: 3,
    activo: true
  },
  {
    id: 4,
    pregunta: '¿Realizan tasaciones gratuitas?',
    respuesta: 'Sí, ofrecemos tasaciones gratuitas sin compromiso. Nuestros asesores analizan el mercado actual, las características de tu propiedad y propiedades similares para darte un precio justo.',
    categoria: 'Servicios',
    orden: 4,
    activo: true
  },
  {
    id: 5,
    pregunta: '¿Trabajan con créditos hipotecarios?',
    respuesta: 'Sí, tenemos alianzas con los principales bancos y podemos asesorarte sobre las mejores opciones de financiamiento disponibles según tu perfil.',
    categoria: 'Financiamiento',
    orden: 5,
    activo: true
  }
];

const BANNERS_MOCK: Banner[] = [
  {
    id: 1,
    titulo: 'Encontrá tu hogar ideal',
    subtitulo: 'Las mejores propiedades en las zonas más exclusivas de Buenos Aires',
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
  },
  {
    id: 3,
    titulo: 'Oportunidad de inversión',
    subtitulo: 'Departamentos en pozo con financiación',
    imagenUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop',
    enlace: '/propiedades?tipo=departamento',
    textoBoton: 'Ver más',
    posicion: 'promocional',
    orden: 1,
    activo: true,
    fechaInicio: '2026-01-01',
    fechaFin: '2026-03-31'
  }
];

// =============================================
// TIPOS PARA FILTROS Y ESTADÍSTICAS
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
// SERVICIO
// =============================================
@Injectable({ providedIn: 'root' })
export class ContentAdminService {
  private http = inject(HttpClient);

  // ⚠️ CAMBIAR A FALSE CUANDO HAYA API REAL
  private useMockData = true;

  // URLs
  private readonly API_URL = '/api/v1/contenido';

  // Estado local para mock
  private testimoniosSubject = new BehaviorSubject<Testimonio[]>([...TESTIMONIOS_MOCK]);
  private beneficiosSubject = new BehaviorSubject<Beneficio[]>([...BENEFICIOS_MOCK]);
  private faqsSubject = new BehaviorSubject<FAQ[]>([...FAQS_MOCK]);
  private bannersSubject = new BehaviorSubject<Banner[]>([...BANNERS_MOCK]);

  testimonios$ = this.testimoniosSubject.asObservable();
  beneficios$ = this.beneficiosSubject.asObservable();
  faqs$ = this.faqsSubject.asObservable();
  banners$ = this.bannersSubject.asObservable();

  // =============================================
  // TESTIMONIOS
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

  createTestimonio(data: Partial<Testimonio>): Observable<Testimonio> {
    if (this.useMockData) {
      const current = this.testimoniosSubject.value;
      const newId = current.length > 0 ? Math.max(...current.map(t => t.id)) + 1 : 1;
      const newItem: Testimonio = {
        id: newId,
        nombre: data.nombre || '',
        ubicacion: data.ubicacion || '',
        texto: data.texto || '',
        fotoUrl: data.fotoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
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

  // =============================================
  // BENEFICIOS
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

  // =============================================
  // FAQS
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

  // =============================================
  // BANNERS
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

  // =============================================
  // ESTADÍSTICAS GLOBALES
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
  // TOGGLE ACTIVO (GENÉRICO)
  // =============================================
  private readonly toggleActions: Record<ContentType, (id: number) => Observable<any>> = {
    testimonios: (id) => this.toggleTestimonioActivo(id),
    beneficios: (id) => this.toggleBeneficioActivo(id),
    faqs: (id) => this.toggleFaqActivo(id),
    banners: (id) => this.toggleBannerActivo(id)
  };

  toggleActivo(type: ContentType, id: number): Observable<any> {
    return this.toggleActions[type](id);
  }

  private toggleTestimonioActivo(id: number): Observable<Testimonio> {
    const current = this.testimoniosSubject.value;
    const index = current.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Testimonio no encontrado');

    const updated: Testimonio = { ...current[index], activo: !current[index].activo };
    const newList = [...current];
    newList[index] = updated;
    this.testimoniosSubject.next(newList);
    return of(updated).pipe(delay(300));
  }

  private toggleBeneficioActivo(id: number): Observable<Beneficio> {
    const current = this.beneficiosSubject.value;
    const index = current.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Beneficio no encontrado');

    const updated: Beneficio = { ...current[index], activo: !current[index].activo };
    const newList = [...current];
    newList[index] = updated;
    this.beneficiosSubject.next(newList);
    return of(updated).pipe(delay(300));
  }

  private toggleFaqActivo(id: number): Observable<FAQ> {
    const current = this.faqsSubject.value;
    const index = current.findIndex(f => f.id === id);
    if (index === -1) throw new Error('FAQ no encontrada');

    const updated: FAQ = { ...current[index], activo: !current[index].activo };
    const newList = [...current];
    newList[index] = updated;
    this.faqsSubject.next(newList);
    return of(updated).pipe(delay(300));
  }

  private toggleBannerActivo(id: number): Observable<Banner> {
    const current = this.bannersSubject.value;
    const index = current.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Banner no encontrado');

    const updated: Banner = { ...current[index], activo: !current[index].activo };
    const newList = [...current];
    newList[index] = updated;
    this.bannersSubject.next(newList);
    return of(updated).pipe(delay(300));
  }

  // =============================================
  // OPCIONES PARA FORMULARIOS
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
}
