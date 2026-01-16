import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import type { Agente, EstadisticasAgente, ValoracionAgente } from '../models/agent.interface';
import type { Propiedad } from '../models/property.interface';
import { AGENTES_MOCK } from './mock-data/agents.mock';
import { MOCK_PROPIEDADES } from './mock-data/properties.mock';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private http = inject(HttpClient);
  private apiUrl = '/api/agentes';
  private useMockData = true; // Cambiar a false cuando haya API real

  // =============================================
  // OBTENER TODOS LOS AGENTES
  // =============================================
  getAgentes(): Observable<Agente[]> {
    if (this.useMockData) {
      return of(AGENTES_MOCK).pipe(delay(300));
    }
    return this.http.get<Agente[]>(this.apiUrl);
  }

  // =============================================
  // OBTENER AGENTE POR ID
  // =============================================
  getAgentePorId(id: number): Observable<Agente | undefined> {
    if (this.useMockData) {
      const agente = AGENTES_MOCK.find(a => a.id === id);
      return of(agente).pipe(delay(200));
    }
    return this.http.get<Agente>(`${this.apiUrl}/${id}`);
  }

  // =============================================
  // OBTENER PROPIEDADES DE UN AGENTE
  // =============================================
  getPropiedadesAgente(agenteId: number): Observable<Propiedad[]> {
    if (this.useMockData) {
      const propiedades = MOCK_PROPIEDADES.filter(
        (p: Propiedad) => p.agente?.id === agenteId
      );
      return of(propiedades).pipe(delay(300));
    }
    
    const params = new HttpParams().set('agenteId', agenteId.toString());
    return this.http.get<Propiedad[]>('/api/propiedades', { params });
  }

  // =============================================
  // OBTENER ESTADÍSTICAS DE UN AGENTE
  // =============================================
  getEstadisticasAgente(agenteId: number): Observable<EstadisticasAgente> {
    if (this.useMockData) {
      const propiedades = MOCK_PROPIEDADES.filter(
        (p: Propiedad) => p.agente?.id === agenteId
      );
      
      const stats: EstadisticasAgente = {
        totalPropiedades: propiedades.length,
        propiedadesVenta: propiedades.filter((p: Propiedad) => p.operacion === 'venta').length,
        propiedadesAlquiler: propiedades.filter((p: Propiedad) => p.operacion === 'alquiler').length,
        valorTotalCartera: propiedades.reduce((sum: number, p: Propiedad) => sum + p.precio, 0),
        moneda: 'USD'
      };
      
      return of(stats).pipe(delay(200));
    }
    
    return this.http.get<EstadisticasAgente>(`${this.apiUrl}/${agenteId}/estadisticas`);
  }

  // =============================================
  // OBTENER AGENTES DESTACADOS
  // =============================================
  getAgentesDestacados(limite: number = 6): Observable<Agente[]> {
    if (this.useMockData) {
      const destacados = AGENTES_MOCK
        .filter(a => a.destacado && a.activo)
        .slice(0, limite);
      return of(destacados).pipe(delay(200));
    }
    
    const params = new HttpParams()
      .set('destacado', 'true')
      .set('limite', limite.toString());
    return this.http.get<Agente[]>(this.apiUrl, { params });
  }

  // =============================================
  // OBTENER VALORACIONES DE UN AGENTE
  // =============================================
  getValoracionesAgente(agenteId: number): Observable<ValoracionAgente[]> {
    if (this.useMockData) {
      // Por ahora retornamos array vacío, se puede implementar después
      return of([]).pipe(delay(200));
    }
    
    return this.http.get<ValoracionAgente[]>(`${this.apiUrl}/${agenteId}/valoraciones`);
  }
}
