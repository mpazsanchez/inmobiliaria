import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import type { Agente } from '../../../core/models/agent.interface';
import { AGENTES_MOCK } from '../../../core/services/mock-data/agents.mock';
import { CloudinaryService } from '../../../core/services/cloudinary.service';

// Interfaces para el admin
export interface AgentFilters {
  busqueda?: string;
  activo?: boolean;
  destacado?: boolean;
  especialidad?: string;
}

export interface AgentStats {
  total: number;
  activos: number;
  inactivos: number;
  destacados: number;
}

@Injectable({ providedIn: 'root' })
export class AgentsAdminService {
  private http = inject(HttpClient);
  private cloudinary = inject(CloudinaryService);

  // ⚠️ CAMBIAR A FALSE CUANDO HAYA API REAL
  private useMockData = true;

  // URLs
  private readonly API_URL = '/api/v1/agentes';

  // Estado local para mock
  private agentesSubject = new BehaviorSubject<Agente[]>([...AGENTES_MOCK]);
  agentes$ = this.agentesSubject.asObservable();

  // =============================================
  // OBTENER TODOS LOS AGENTES CON FILTROS
  // =============================================
  getAgents(filters?: AgentFilters): Observable<Agente[]> {
    if (this.useMockData) {
      return this.agentes$.pipe(
        map(agentes => this.applyFilters(agentes, filters)),
        delay(300)
      );
    }

    return this.http.get<Agente[]>(this.API_URL, { params: filters as any });
  }

  private applyFilters(agentes: Agente[], filters?: AgentFilters): Agente[] {
    if (!filters) return agentes;

    let result = [...agentes];

    if (filters.busqueda) {
      const search = filters.busqueda.toLowerCase();
      result = result.filter(a =>
        a.nombre.toLowerCase().includes(search) ||
        a.apellido.toLowerCase().includes(search) ||
        a.email.toLowerCase().includes(search) ||
        a.especialidad?.toLowerCase().includes(search)
      );
    }

    if (filters.activo !== undefined) {
      result = result.filter(a => a.activo === filters.activo);
    }

    if (filters.destacado !== undefined) {
      result = result.filter(a => a.destacado === filters.destacado);
    }

    if (filters.especialidad) {
      result = result.filter(a =>
        a.especialidad?.toLowerCase().includes(filters.especialidad!.toLowerCase())
      );
    }

    return result;
  }

  // =============================================
  // OBTENER AGENTE POR ID
  // =============================================
  getAgentById(id: number): Observable<Agente | null> {
    if (this.useMockData) {
      const agente = this.agentesSubject.value.find(a => a.id === id);
      return of(agente || null).pipe(delay(200));
    }

    return this.http.get<Agente>(`${this.API_URL}/${id}`);
  }

  // =============================================
  // CREAR AGENTE
  // =============================================
  createAgent(agente: Partial<Agente>): Observable<Agente> {
    if (this.useMockData) {
      const current = this.agentesSubject.value;
      const newId = Math.max(...current.map(a => a.id)) + 1;

      const newAgente: Agente = {
        id: newId,
        nombre: agente.nombre || '',
        apellido: agente.apellido || '',
        cargo: agente.cargo || 'Agente Inmobiliario',
        email: agente.email || '',
        telefono: agente.telefono || '',
        fotoUrl: agente.fotoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        especialidad: agente.especialidad,
        slogan: agente.slogan,
        biografia: agente.biografia,
        experienciaAnios: agente.experienciaAnios || 0,
        idiomas: agente.idiomas || ['Español'],
        whatsapp: agente.whatsapp,
        linkedin: agente.linkedin,
        instagram: agente.instagram,
        facebook: agente.facebook,
        propiedadesVendidas: 0,
        propiedadesActivas: 0,
        clientesSatisfechos: 0,
        certificaciones: agente.certificaciones || [],
        premios: agente.premios || [],
        activo: agente.activo ?? true,
        destacado: agente.destacado ?? false
      };

      this.agentesSubject.next([...current, newAgente]);
      return of(newAgente).pipe(delay(500));
    }

    return this.http.post<Agente>(this.API_URL, agente);
  }

  // =============================================
  // ACTUALIZAR AGENTE
  // =============================================
  updateAgent(id: number, data: Partial<Agente>): Observable<Agente> {
    if (this.useMockData) {
      const current = this.agentesSubject.value;
      const index = current.findIndex(a => a.id === id);

      if (index === -1) {
        throw new Error('Agente no encontrado');
      }

      const updated: Agente = { ...current[index], ...data };
      const newList = [...current];
      newList[index] = updated;

      this.agentesSubject.next(newList);
      return of(updated).pipe(delay(500));
    }

    return this.http.put<Agente>(`${this.API_URL}/${id}`, data);
  }

  // =============================================
  // ELIMINAR AGENTE
  // =============================================
  deleteAgent(id: number): Observable<boolean> {
    if (this.useMockData) {
      const current = this.agentesSubject.value;
      const filtered = current.filter(a => a.id !== id);
      this.agentesSubject.next(filtered);
      return of(true).pipe(delay(300));
    }

    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      map(() => true)
    );
  }

  // =============================================
  // TOGGLE ACTIVO
  // =============================================
  toggleActivo(id: number): Observable<Agente> {
    if (this.useMockData) {
      const current = this.agentesSubject.value;
      const index = current.findIndex(a => a.id === id);

      if (index === -1) {
        throw new Error('Agente no encontrado');
      }

      const updated: Agente = {
        ...current[index],
        activo: !current[index].activo
      };
      const newList = [...current];
      newList[index] = updated;

      this.agentesSubject.next(newList);
      return of(updated).pipe(delay(300));
    }

    return this.http.patch<Agente>(`${this.API_URL}/${id}/toggle-activo`, {});
  }

  // =============================================
  // TOGGLE DESTACADO
  // =============================================
  toggleDestacado(id: number): Observable<Agente> {
    if (this.useMockData) {
      const current = this.agentesSubject.value;
      const index = current.findIndex(a => a.id === id);

      if (index === -1) {
        throw new Error('Agente no encontrado');
      }

      const updated: Agente = {
        ...current[index],
        destacado: !current[index].destacado
      };
      const newList = [...current];
      newList[index] = updated;

      this.agentesSubject.next(newList);
      return of(updated).pipe(delay(300));
    }

    return this.http.patch<Agente>(`${this.API_URL}/${id}/toggle-destacado`, {});
  }

  // =============================================
  // OBTENER ESTADÍSTICAS
  // =============================================
  getStats(): Observable<AgentStats> {
    if (this.useMockData) {
      return this.agentes$.pipe(
        map(agentes => ({
          total: agentes.length,
          activos: agentes.filter(a => a.activo).length,
          inactivos: agentes.filter(a => !a.activo).length,
          destacados: agentes.filter(a => a.destacado).length
        })),
        delay(200)
      );
    }

    return this.http.get<AgentStats>(`${this.API_URL}/stats`);
  }

  // =============================================
  // UPLOAD DE FOTO (CLOUDINARY)
  // =============================================
  uploadPhoto(file: File): Observable<{ url: string }> {
    // Usar Cloudinary para todos los uploads (mock y produccion)
    return this.cloudinary.uploadAgentPhoto(file).pipe(
      map(result => ({ url: result.secureUrl }))
    );
  }

  // =============================================
  // OPCIONES PARA FORMULARIOS
  // =============================================
  getCargos(): string[] {
    return [
      'Agente Inmobiliario Junior',
      'Agente Inmobiliario',
      'Agente Inmobiliario Senior',
      'Broker Asociado',
      'Broker',
      'Especialista en Propiedades Comerciales',
      'Especialista en Propiedades de Lujo',
      'Director Comercial'
    ];
  }

  getEspecialidades(): string[] {
    return [
      'Propiedades de Lujo y Barrios Cerrados',
      'Primera Vivienda e Inversiones',
      'Inmuebles Comerciales y Oficinas',
      'Departamentos y Propiedades en Zona Norte',
      'Departamentos y Propiedades en Zona Sur',
      'Tasaciones y Oportunidades de Inversión',
      'Alquileres y Propiedades para Jóvenes Profesionales',
      'Desarrollos Inmobiliarios',
      'Propiedades Rurales y Campos'
    ];
  }

  getIdiomasDisponibles(): string[] {
    return ['Español', 'Inglés', 'Portugués', 'Francés', 'Italiano', 'Alemán'];
  }
}
