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
  categoria?: string; // Para FAQs
  posicion?: string; // Para Banners
  pagina?: string; // Para Banners - filtrar por página
}

export interface ContentStats {
  testimonios: { total: number; activos: number };
  beneficios: { total: number; activos: number };
  faqs: { total: number; activos: number };
  banners: { total: number; activos: number };
}

export type ContentType = 'testimonios' | 'beneficios' | 'faqs' | 'banners';

// =============================================
// DATOS FALLBACK (coinciden con los JSON en /assets/data/static-content/)
// Solo se usan si falla la carga de los archivos JSON
// =============================================

const TESTIMONIOS_FALLBACK: Testimonio[] = [
  {
    id: 1,
    nombre: 'María Fernández',
    ubicacion: 'Centro, Tandil',
    texto: 'Excelente experiencia con Fairway. Encontraron la casa perfecta para mi familia en tiempo récord. El asesor fue muy profesional y atento a nuestras necesidades.',
    fotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    calificacion: 5,
    activo: true,
    orden: 1
  },
  {
    id: 2,
    nombre: 'Carlos Martínez',
    ubicacion: 'Villa Italia, Tandil',
    texto: 'Vendí mi propiedad en menos de un mes gracias a la gestión de Fairway. La tasación fue justa y todo el proceso fue transparente. Totalmente recomendados.',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    calificacion: 5,
    activo: true,
    orden: 2
  },
  {
    id: 3,
    nombre: 'Laura González',
    ubicacion: 'Cerrito, Tandil',
    texto: 'Como primera compradora estaba nerviosa, pero el equipo de Fairway me guió en cada paso. Ahora tengo mi primer hogar propio y no podría estar más feliz.',
    fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    calificacion: 5,
    activo: true,
    orden: 3
  },
  {
    id: 4,
    nombre: 'Roberto Sánchez',
    ubicacion: 'Zona Sierras, Tandil',
    texto: 'Buscaba una propiedad para inversión y el equipo me asesoró perfectamente. El conocimiento del mercado local es impresionante. Muy profesionales.',
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    calificacion: 5,
    activo: true,
    orden: 4
  },
  {
    id: 5,
    nombre: 'Ana Lucía Torres',
    ubicacion: 'La Movediza, Tandil',
    texto: 'Después de meses buscando sin éxito, Fairway encontró exactamente lo que necesitaba en mi presupuesto. Atención personalizada de principio a fin.',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    calificacion: 5,
    activo: true,
    orden: 5
  }
];

const BENEFICIOS_FALLBACK: Beneficio[] = [
  {
    id: 1,
    icono: 'shield-check',
    titulo: 'Confianza y Seguridad',
    descripcion: 'Más de 20 años de experiencia en el mercado inmobiliario de Tandil garantizan operaciones seguras y transparentes.',
    orden: 1,
    activo: true
  },
  {
    id: 2,
    icono: 'people',
    titulo: 'Equipo Profesional',
    descripcion: 'Asesores especializados comprometidos en encontrar la propiedad perfecta para cada cliente.',
    orden: 2,
    activo: true
  },
  {
    id: 3,
    icono: 'house',
    titulo: 'Amplio Portfolio',
    descripcion: 'Gran variedad de propiedades en venta y alquiler en Tandil y la zona serrana.',
    orden: 3,
    activo: true
  },
  {
    id: 4,
    icono: 'headset',
    titulo: 'Atención Personalizada',
    descripcion: 'Acompañamiento en cada paso del proceso, desde la búsqueda hasta la firma del contrato.',
    orden: 4,
    activo: true
  },
  {
    id: 5,
    icono: 'graph-up-arrow',
    titulo: 'Conocimiento Local',
    descripcion: 'Profundo conocimiento del mercado inmobiliario de Tandil y sus diferentes barrios.',
    orden: 5,
    activo: true
  },
  {
    id: 6,
    icono: 'clock',
    titulo: 'Respuesta Rápida',
    descripcion: 'Atención inmediata a consultas y coordinación ágil de visitas a propiedades.',
    orden: 6,
    activo: true
  }
];

const FAQS_FALLBACK: FAQ[] = [
  {
    id: 1,
    pregunta: '¿Cuánto cobran por sus servicios?',
    respuesta: 'Nuestros honorarios varían según el tipo de operación. En ventas, cobramos un porcentaje del valor de la transacción. En alquileres, un mes de alquiler. Contactanos para un presupuesto personalizado.',
    categoria: 'Comisiones',
    orden: 1,
    activo: true
  },
  {
    id: 2,
    pregunta: '¿Cuánto demora vender una propiedad?',
    respuesta: 'El tiempo de venta depende de varios factores: precio, ubicación, estado de la propiedad y condiciones del mercado. En promedio, una propiedad bien tasada se vende entre 3 y 6 meses.',
    categoria: 'Proceso',
    orden: 2,
    activo: true
  },
  {
    id: 3,
    pregunta: '¿Necesito ser el propietario para publicar?',
    respuesta: 'Sí, debes ser el propietario o tener autorización expresa del mismo mediante poder o contrato de intermediación.',
    categoria: 'Legal',
    orden: 3,
    activo: true
  },
  {
    id: 4,
    pregunta: '¿Hacen tasaciones gratuitas?',
    respuesta: 'Ofrecemos una valoración orientativa sin cargo. Para tasaciones oficiales con informe técnico, se cobra un honorario según la complejidad.',
    categoria: 'Servicios',
    orden: 4,
    activo: true
  },
  {
    id: 5,
    pregunta: '¿Trabajan con créditos hipotecarios?',
    respuesta: 'Sí, te asesoramos en el proceso de solicitud de crédito hipotecario y trabajamos con las principales entidades bancarias.',
    categoria: 'Financiamiento',
    orden: 5,
    activo: true
  },
  {
    id: 6,
    pregunta: '¿Qué documentación necesito para vender?',
    respuesta: 'Título de propiedad, DNI del titular, último impuesto inmobiliario y expensas al día, certificado de libre deuda, y planos aprobados.',
    categoria: 'Legal',
    orden: 6,
    activo: true
  },
  {
    id: 7,
    pregunta: '¿Hacen contratos de alquiler?',
    respuesta: 'Sí, gestionamos contratos de alquiler conforme a la Ley de Alquileres vigente, con asesoramiento legal incluido.',
    categoria: 'Servicios',
    orden: 7,
    activo: true
  },
  {
    id: 8,
    pregunta: '¿Puedo visitar propiedades los fines de semana?',
    respuesta: 'Sí, coordinamos visitas de lunes a sábados. Contactá a tu asesor para programar un horario conveniente.',
    categoria: 'Proceso',
    orden: 8,
    activo: true
  }
];

const BANNERS_FALLBACK: Banner[] = [
  {
    id: 1,
    titulo: 'Encontrá tu hogar ideal',
    subtitulo: 'Propiedades en venta y alquiler en Tandil y la zona',
    imagenUrl: 'assets/images/backgrounds/fairway/hero-home-3.webp',
    imagenMovilUrl: 'assets/images/backgrounds/fairway/hero-home-3.webp',
    enlace: '/properties',
    textoBoton: 'Ver propiedades',
    pagina: 'home',
    posicion: 'hero',
    orden: 1,
    activo: true
  },
  {
    id: 2,
    titulo: 'Vendé tu propiedad con nosotros',
    subtitulo: 'Tasación gratuita y el mejor asesoramiento del mercado',
    imagenUrl: 'assets/images/backgrounds/fairway/hero-home-2.webp',
    imagenMovilUrl: 'assets/images/backgrounds/fairway/hero-home-2.webp',
    enlace: '/contact',
    textoBoton: 'Solicitar tasación',
    pagina: 'home',
    posicion: 'hero',
    orden: 2,
    activo: true
  },
  {
    id: 3,
    titulo: 'Equipo de profesionales a tu servicio',
    subtitulo: 'Más de 20 años de experiencia en el mercado inmobiliario de Tandil',
    imagenUrl: 'assets/images/backgrounds/fairway/hero-home.webp',
    imagenMovilUrl: 'assets/images/backgrounds/fairway/hero-home.webp',
    enlace: '/team',
    textoBoton: 'Conocer equipo',
    pagina: 'home',
    posicion: 'hero',
    orden: 3,
    activo: true
  },
  {
    id: 4,
    titulo: 'Propiedades en toda la zona',
    subtitulo: 'Casas, departamentos, terrenos y locales comerciales',
    imagenUrl: 'assets/images/backgrounds/fairway/hero-home-3.webp',
    imagenMovilUrl: 'assets/images/backgrounds/fairway/hero-home-3.webp',
    enlace: '/properties',
    textoBoton: 'Ver listado completo',
    pagina: 'properties',
    posicion: 'hero',
    orden: 1,
    activo: true
  },
  {
    id: 5,
    titulo: '¿Querés conocernos?',
    subtitulo: 'Estamos en Tandil desde 2002',
    imagenUrl: 'assets/images/backgrounds/fairway/hero-home-2.webp',
    imagenMovilUrl: 'assets/images/backgrounds/fairway/hero-home-2.webp',
    enlace: '/contact',
    textoBoton: 'Contactanos',
    pagina: 'about',
    posicion: 'hero',
    orden: 1,
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
        catchError(() => of({ testimonios: TESTIMONIOS_FALLBACK })),
        tap(data => this.testimoniosSubject.next(data.testimonios))
      )
      .subscribe();

    // Cargar beneficios (del mismo archivo de testimonios)
    this.http.get<{ beneficios: Beneficio[] }>('/assets/data/static-content/testimonios.json')
      .pipe(
        catchError(() => of({ beneficios: BENEFICIOS_FALLBACK })),
        tap(data => this.beneficiosSubject.next(data.beneficios))
      )
      .subscribe();

    // Cargar FAQs
    this.http.get<{ faqs: FAQ[] }>('/assets/data/static-content/faqs-list.json')
      .pipe(
        catchError(() => of({ faqs: FAQS_FALLBACK })),
        tap(data => this.faqsSubject.next(data.faqs))
      )
      .subscribe();

    // Cargar Banners
    this.http.get<{ banners: Banner[] }>('/assets/data/static-content/banners.json')
      .pipe(
        catchError(() => of({ banners: BANNERS_FALLBACK })),
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
        icono: data.icono || 'star',
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

  /**
   * Obtiene banners activos filtrados por página
   */
  getBannersByPagina(pagina: 'home' | 'properties' | 'about' | 'contact' | 'team' | 'services'): Observable<Banner[]> {
    if (this.useMockData) {
      return this.banners$.pipe(
        map(banners => banners.filter(b => b.activo && b.pagina === pagina)),
        map(banners => banners.sort((a, b) => a.orden - b.orden)),
        delay(300)
      );
    }
    return this.http.get<Banner[]>(`${this.API_URL}/banners`, { params: { pagina, activo: 'true' } });
  }

  /**
   * Obtiene banners activos filtrados por página Y posición
   */
  getBannersByPaginaYPosicion(
    pagina: 'home' | 'properties' | 'about' | 'contact' | 'team' | 'services',
    posicion: 'hero' | 'secundario' | 'promocional'
  ): Observable<Banner[]> {
    if (this.useMockData) {
      return this.banners$.pipe(
        map(banners => banners.filter(b => 
          b.activo && b.pagina === pagina && b.posicion === posicion
        )),
        map(banners => banners.sort((a, b) => a.orden - b.orden)),
        delay(300)
      );
    }
    return this.http.get<Banner[]>(`${this.API_URL}/banners`, { 
      params: { pagina, posicion, activo: 'true' } 
    });
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
        pagina: data.pagina || 'home',
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

  getPaginasBanner(): { value: string; label: string }[] {
    return [
      { value: 'home', label: 'Home / Inicio' },
      { value: 'properties', label: 'Propiedades' },
      { value: 'about', label: 'Nosotros' },
      { value: 'contact', label: 'Contacto' },
      { value: 'team', label: 'Equipo' },
      { value: 'services', label: 'Servicios' }
    ];
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
      'shield-check',
      'people',
      'graph-up-arrow',
      'headset',
      'house',
      'award',
      'star',
      'heart',
      'check-circle',
      'lightning',
      'clock',
      'geo-alt',
      'phone',
      'envelope',
      'cash-coin',
      'key',
      'building',
      'briefcase'
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

    if (filters.pagina) {
      result = result.filter(b => b.pagina === filters.pagina);
    }

    return result.sort((a, b) => a.orden - b.orden);
  }
}
