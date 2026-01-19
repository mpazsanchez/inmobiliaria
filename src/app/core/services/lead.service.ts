import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Contacto } from '../models/lead.interface';
import { RespuestaPaginada } from '../models/search-filters.interface';

/**
 * Servicio para gestionar consultas y leads de contacto
 * Permite crear, leer y gestionar consultas desde formularios de contacto
 */
@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private apiUrl = `${environment.apiUrl}/contactos`;
  private useMockData = true; // Cambiar a false cuando la API esté lista
  private mockDataCache: Contacto[] | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Envía una consulta de contacto general o sobre una propiedad específica
   * @param contact Datos del formulario de contacto
   */
  submitInquiry(contact: Omit<Contacto, 'id' | 'fechaEnvio' | 'respondida'>): Observable<Contacto> {
    if (this.useMockData) {
      const newContact: Contacto = {
        id: Math.floor(Math.random() * 10000),
        ...contact,
        fechaEnvio: new Date().toISOString(),
        respondida: false
      };
      console.log('📧 Consulta enviada (mock):', newContact);
      return of(newContact).pipe(delay(500));
    }

    return this.http.post<Contacto>(this.apiUrl, contact);
  }

  /**
   * Envía una consulta específica sobre una propiedad
   * Atajo para submitInquiry con propiedadId
   */
  inquireAboutProperty(
    propertyId: number,
    data: Pick<Contacto, 'nombreContacto' | 'emailContacto' | 'telefonoContacto' | 'mensaje'>
  ): Observable<Contacto> {
    return this.submitInquiry({
      propiedadId: propertyId,
      asesorId: 0, // El backend asignará el asesor según la propiedad
      ...data
    });
  }

  /**
   * Solicita agendar una visita a una propiedad
   * Similar a inquireAboutProperty pero con mensaje predefinido
   */
  scheduleVisit(
    propertyId: number,
    data: Pick<Contacto, 'nombreContacto' | 'emailContacto' | 'telefonoContacto'> & { preferredDate?: string }
  ): Observable<Contacto> {
    const message = data.preferredDate
      ? `Me gustaría agendar una visita para el ${data.preferredDate}. Por favor, confirmen disponibilidad.`
      : 'Me gustaría agendar una visita a esta propiedad. ¿Cuándo tienen disponibilidad?';

    return this.inquireAboutProperty(propertyId, {
      nombreContacto: data.nombreContacto,
      emailContacto: data.emailContacto,
      telefonoContacto: data.telefonoContacto,
      mensaje: message
    });
  }

  /**
   * Obtiene todas las consultas (solo para admin/asesores)
   * @param filters Filtros opcionales (por asesor, propiedad, respondida)
   */
  getInquiries(filters?: {
    agentId?: number;
    propertyId?: number;
    answered?: boolean;
    page?: number;
    perPage?: number;
  }): Observable<RespuestaPaginada<Contacto>> {
    if (this.useMockData) {
      return this.loadMockData().pipe(
        map(inquiries => {
          // Aplicar filtros
          let filteredInquiries = [...inquiries];
          if (filters?.agentId) {
            filteredInquiries = filteredInquiries.filter(c => c.asesorId === filters.agentId);
          }
          if (filters?.propertyId) {
            filteredInquiries = filteredInquiries.filter(c => c.propiedadId === filters.propertyId);
          }
          if (filters?.answered !== undefined) {
            filteredInquiries = filteredInquiries.filter(c => c.respondida === filters.answered);
          }

          // Paginación
          const page = filters?.page || 1;
          const perPage = filters?.perPage || 20;
          const startIndex = (page - 1) * perPage;
          const endIndex = startIndex + perPage;
          const paginatedData = filteredInquiries.slice(startIndex, endIndex);

          return {
            datos: paginatedData,
            paginacion: {
              paginaActual: page,
              porPagina: perPage,
              totalItems: filteredInquiries.length,
              totalPaginas: Math.ceil(filteredInquiries.length / perPage),
              tieneSiguiente: endIndex < filteredInquiries.length,
              tieneAnterior: page > 1
            }
          };
        }),
        delay(300)
      );
    }

    // Construir query params
    let params = new HttpParams();
    if (filters?.agentId) params = params.set('asesorId', filters.agentId.toString());
    if (filters?.propertyId) params = params.set('propiedadId', filters.propertyId.toString());
    if (filters?.answered !== undefined) params = params.set('respondida', filters.answered.toString());
    if (filters?.page) params = params.set('pagina', filters.page.toString());
    if (filters?.perPage) params = params.set('porPagina', filters.perPage.toString());

    return this.http.get<RespuestaPaginada<Contacto>>(this.apiUrl, { params });
  }

  /**
   * Obtiene una consulta específica por ID (solo para admin/asesores)
   */
  getInquiryById(id: number): Observable<Contacto> {
    if (this.useMockData) {
      return this.loadMockData().pipe(
        map(inquiries => {
          const inquiry = inquiries.find(c => c.id === id);
          if (!inquiry) {
            throw new Error(`Consulta ${id} no encontrada`);
          }
          return inquiry;
        }),
        delay(300)
      );
    }

    return this.http.get<Contacto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Marca una consulta como respondida (solo para admin/asesores)
   */
  markAsAnswered(id: number): Observable<Contacto> {
    if (this.useMockData) {
      return this.loadMockData().pipe(
        map(inquiries => {
          const inquiry = inquiries.find(c => c.id === id);
          if (!inquiry) {
            throw new Error(`Consulta ${id} no encontrada`);
          }
          inquiry.respondida = true;
          return inquiry;
        }),
        delay(300)
      );
    }

    return this.http.patch<Contacto>(`${this.apiUrl}/${id}`, { respondida: true });
  }

  /**
   * Obtiene estadísticas de consultas (solo para admin)
   */
  getStatistics(): Observable<{
    totalInquiries: number;
    pendingInquiries: number;
    answeredInquiries: number;
    inquiriesByAgent: { agentId: number; total: number }[];
    inquiriesByProperty: { propertyId: number; total: number }[];
  }> {
    if (this.useMockData) {
      return this.loadMockData().pipe(
        map(inquiries => {
          return {
            totalInquiries: inquiries.length,
            pendingInquiries: inquiries.filter(c => !c.respondida).length,
            answeredInquiries: inquiries.filter(c => c.respondida).length,
            inquiriesByAgent: this.countByAgent(inquiries),
            inquiriesByProperty: this.countByProperty(inquiries)
          };
        }),
        delay(300)
      );
    }

    return this.http.get<any>(`${this.apiUrl}/estadisticas`);
  }

  /**
   * Carga datos mock desde el archivo JSON
   */
  private loadMockData(): Observable<Contacto[]> {
    if (this.mockDataCache) {
      return of(this.mockDataCache);
    }

    return this.http.get<Contacto[]>('/assets/data/leads.json').pipe(
      map(data => {
        this.mockDataCache = data;
        return data;
      })
    );
  }

  /**
   * Cuenta consultas agrupadas por asesor
   */
  private countByAgent(inquiries: Contacto[]): { agentId: number; total: number }[] {
    const count = inquiries.reduce((acc, inquiry) => {
      const value = inquiry.asesorId;
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(count).map(([id, total]) => ({
      agentId: parseInt(id),
      total
    }));
  }

  /**
   * Cuenta consultas agrupadas por propiedad
   */
  private countByProperty(inquiries: Contacto[]): { propertyId: number; total: number }[] {
    const count = inquiries.reduce((acc, inquiry) => {
      const value = inquiry.propiedadId;
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(count).map(([id, total]) => ({
      propertyId: parseInt(id),
      total
    }));
  }
}

