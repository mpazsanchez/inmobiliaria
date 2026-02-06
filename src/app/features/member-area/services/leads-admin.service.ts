import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import type { Contacto } from '../../../core/models/lead.interface';

// Mock data
const MOCK_LEADS: Contacto[] = [
  {
    id: 880,
    propiedadId: 101,
    asesorId: 5,
    nombreContacto: 'Maria Lopez',
    emailContacto: 'maria.lopez@gmail.com',
    telefonoContacto: '+54 9 11 5678-0000',
    mensaje: 'Hola, estoy interesada en la casa de Palermo. ¿Podriamos coordinar una visita esta semana? Gracias.',
    fechaEnvio: '2026-01-22T15:30:00Z',
    respondida: false
  },
  {
    id: 881,
    propiedadId: 102,
    asesorId: 3,
    nombreContacto: 'Carlos Fernandez',
    emailContacto: 'carlos.f@hotmail.com',
    telefonoContacto: '+54 9 11 6789-1234',
    mensaje: 'Buenas tardes, me interesa el departamento. ¿Esta disponible para alquiler temporal?',
    fechaEnvio: '2026-01-21T10:15:00Z',
    respondida: true
  },
  {
    id: 882,
    propiedadId: 101,
    asesorId: 5,
    nombreContacto: 'Laura Martinez',
    emailContacto: 'laura.m@yahoo.com',
    telefonoContacto: '+54 9 11 7890-2345',
    mensaje: '¿Aceptan mascotas? Tengo un perro mediano.',
    fechaEnvio: '2026-01-20T14:45:00Z',
    respondida: true
  },
  {
    id: 883,
    propiedadId: 105,
    asesorId: 1,
    nombreContacto: 'Juan Perez',
    emailContacto: 'juan.perez@gmail.com',
    telefonoContacto: '+54 9 11 8901-3456',
    mensaje: 'Consulta sobre financiacion disponible para esta propiedad. Me gustaria saber si trabajan con algun banco en particular o si tienen planes de pago directo.',
    fechaEnvio: '2026-01-19T09:30:00Z',
    respondida: false
  },
  {
    id: 884,
    propiedadId: 103,
    asesorId: 2,
    nombreContacto: 'Ana Gonzalez',
    emailContacto: 'ana.gonzalez@outlook.com',
    telefonoContacto: '+54 9 11 9012-4567',
    mensaje: 'Me gustaria recibir mas informacion sobre las expensas y servicios incluidos.',
    fechaEnvio: '2026-01-18T16:20:00Z',
    respondida: true
  },
  {
    id: 885,
    propiedadId: 104,
    asesorId: 1,
    nombreContacto: 'Roberto Sanchez',
    emailContacto: 'roberto.s@gmail.com',
    telefonoContacto: '+54 9 11 1234-5678',
    mensaje: 'Buenas, quisiera saber si el precio es negociable y si tienen disponibilidad para mostrar la propiedad el sabado.',
    fechaEnvio: '2026-01-22T11:00:00Z',
    respondida: false
  },
  {
    id: 886,
    propiedadId: 106,
    asesorId: 2,
    nombreContacto: 'Patricia Diaz',
    emailContacto: 'patricia.d@gmail.com',
    telefonoContacto: '+54 9 11 2345-6789',
    mensaje: '¿Cual es la antiguedad del edificio? ¿Tiene cochera disponible?',
    fechaEnvio: '2026-01-21T08:45:00Z',
    respondida: false
  },
  {
    id: 887,
    propiedadId: 101,
    asesorId: 5,
    nombreContacto: 'Miguel Torres',
    emailContacto: 'miguel.t@hotmail.com',
    telefonoContacto: '+54 9 11 3456-7890',
    mensaje: 'Estoy buscando una propiedad similar pero con 4 dormitorios. ¿Tienen algo disponible en la zona?',
    fechaEnvio: '2026-01-17T14:30:00Z',
    respondida: true
  },
  // Leads sin asesor asignado (para el dashboard de admin)
  {
    id: 888,
    propiedadId: 102,
    asesorId: null,
    nombreContacto: 'Fernando Ruiz',
    emailContacto: 'fernando.ruiz@gmail.com',
    telefonoContacto: '+54 9 11 4567-8901',
    mensaje: 'Hola, vi esta propiedad en el portal y me interesa conocerla. ¿Cuándo podríamos coordinar una visita?',
    fechaEnvio: '2026-01-23T09:15:00Z',
    respondida: false
  },
  {
    id: 889,
    propiedadId: 103,
    asesorId: null,
    nombreContacto: 'Claudia Vega',
    emailContacto: 'claudia.vega@yahoo.com',
    telefonoContacto: '+54 9 11 5678-9012',
    mensaje: 'Buenos días, quisiera información sobre el precio y si aceptan permuta.',
    fechaEnvio: '2026-01-23T11:30:00Z',
    respondida: false
  },
  {
    id: 890,
    propiedadId: 105,
    asesorId: null,
    nombreContacto: 'Diego Moreno',
    emailContacto: 'diego.moreno@hotmail.com',
    telefonoContacto: '+54 9 11 6789-0123',
    mensaje: 'Me interesa esta propiedad para inversión. ¿Podrían enviarme más detalles sobre rentabilidad?',
    fechaEnvio: '2026-01-22T16:45:00Z',
    respondida: false
  }
];

// Interfaces
export interface LeadFilters {
  busqueda?: string;
  respondida?: boolean;
  asesorId?: number | null; // null = sin asignar
  propiedadId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface LeadStats {
  total: number;
  pendientes: number;
  respondidas: number;
  hoy: number;
  estaSemana: number;
}

@Injectable({ providedIn: 'root' })
export class LeadsAdminService {
  private http = inject(HttpClient);

  // ⚠️ CAMBIAR A FALSE CUANDO HAYA API REAL
  private useMockData = true;

  // URLs
  private readonly API_URL = '/api/v1/consultas';

  // Estado local para mock
  private leadsSubject = new BehaviorSubject<Contacto[]>([...MOCK_LEADS]);
  leads$ = this.leadsSubject.asObservable();

  // =============================================
  // OBTENER TODAS LAS CONSULTAS CON FILTROS
  // =============================================
  getLeads(filters?: LeadFilters): Observable<Contacto[]> {
    if (this.useMockData) {
      return this.leads$.pipe(
        map(leads => this.applyFilters(leads, filters)),
        map(leads => leads.sort((a, b) =>
          new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime()
        )),
        delay(300)
      );
    }

    return this.http.get<Contacto[]>(this.API_URL, { params: filters as any });
  }

  private applyFilters(leads: Contacto[], filters?: LeadFilters): Contacto[] {
    if (!filters) return leads;

    let result = [...leads];

    if (filters.busqueda) {
      const search = filters.busqueda.toLowerCase();
      result = result.filter(l =>
        l.nombreContacto.toLowerCase().includes(search) ||
        l.emailContacto.toLowerCase().includes(search) ||
        l.mensaje.toLowerCase().includes(search)
      );
    }

    if (filters.respondida !== undefined) {
      result = result.filter(l => l.respondida === filters.respondida);
    }

    if (filters.asesorId !== undefined) {
      if (filters.asesorId === null) {
        // Filtrar leads sin asesor asignado
        result = result.filter(l => l.asesorId === null);
      } else {
        result = result.filter(l => l.asesorId === filters.asesorId);
      }
    }

    if (filters.propiedadId) {
      result = result.filter(l => l.propiedadId === filters.propiedadId);
    }

    return result;
  }

  // =============================================
  // OBTENER CONSULTA POR ID
  // =============================================
  getLeadById(id: number): Observable<Contacto | null> {
    if (this.useMockData) {
      const lead = this.leadsSubject.value.find(l => l.id === id);
      return of(lead || null).pipe(delay(200));
    }

    return this.http.get<Contacto>(`${this.API_URL}/${id}`);
  }

  // =============================================
  // MARCAR COMO RESPONDIDA
  // =============================================
  markAsResponded(id: number): Observable<Contacto> {
    if (this.useMockData) {
      const current = this.leadsSubject.value;
      const index = current.findIndex(l => l.id === id);

      if (index === -1) {
        throw new Error('Consulta no encontrada');
      }

      const updated: Contacto = {
        ...current[index],
        respondida: true
      };
      const newList = [...current];
      newList[index] = updated;

      this.leadsSubject.next(newList);
      return of(updated).pipe(delay(300));
    }

    return this.http.patch<Contacto>(`${this.API_URL}/${id}/responder`, {});
  }

  // =============================================
  // MARCAR COMO PENDIENTE
  // =============================================
  markAsPending(id: number): Observable<Contacto> {
    if (this.useMockData) {
      const current = this.leadsSubject.value;
      const index = current.findIndex(l => l.id === id);

      if (index === -1) {
        throw new Error('Consulta no encontrada');
      }

      const updated: Contacto = {
        ...current[index],
        respondida: false
      };
      const newList = [...current];
      newList[index] = updated;

      this.leadsSubject.next(newList);
      return of(updated).pipe(delay(300));
    }

    return this.http.patch<Contacto>(`${this.API_URL}/${id}/pendiente`, {});
  }

  // =============================================
  // ASIGNAR A ASESOR
  // =============================================
  assignToAgent(id: number, asesorId: number): Observable<Contacto> {
    if (this.useMockData) {
      const current = this.leadsSubject.value;
      const index = current.findIndex(l => l.id === id);

      if (index === -1) {
        throw new Error('Consulta no encontrada');
      }

      const updated: Contacto = {
        ...current[index],
        asesorId: asesorId
      };
      const newList = [...current];
      newList[index] = updated;

      this.leadsSubject.next(newList);
      return of(updated).pipe(delay(300));
    }

    return this.http.patch<Contacto>(`${this.API_URL}/${id}/asignar`, { asesorId });
  }

  // =============================================
  // ELIMINAR CONSULTA
  // =============================================
  deleteLead(id: number): Observable<boolean> {
    if (this.useMockData) {
      const current = this.leadsSubject.value;
      const filtered = current.filter(l => l.id !== id);
      this.leadsSubject.next(filtered);
      return of(true).pipe(delay(300));
    }

    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      map(() => true)
    );
  }

  // =============================================
  // OBTENER ESTADÍSTICAS
  // =============================================
  getStats(asesorId?: number): Observable<LeadStats> {
    if (this.useMockData) {
      return this.leads$.pipe(
        map(leads => {
          let filtered = asesorId ? leads.filter(l => l.asesorId === asesorId) : leads;

          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

          return {
            total: filtered.length,
            pendientes: filtered.filter(l => !l.respondida).length,
            respondidas: filtered.filter(l => l.respondida).length,
            hoy: filtered.filter(l => new Date(l.fechaEnvio) >= today).length,
            estaSemana: filtered.filter(l => new Date(l.fechaEnvio) >= weekAgo).length
          };
        }),
        delay(200)
      );
    }

    if (asesorId) {
      return this.http.get<LeadStats>(`${this.API_URL}/stats`, {
        params: { asesorId: asesorId.toString() }
      });
    }
    return this.http.get<LeadStats>(`${this.API_URL}/stats`);
  }

  // =============================================
  // HELPERS
  // =============================================
  getTimeAgo(fecha: string): string {
    const now = new Date();
    const date = new Date(fecha);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} dias`;

    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  }

  formatDate(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
