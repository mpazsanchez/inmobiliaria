import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import type { Agente, EstadisticasAgente, ValoracionAgente } from '../models/agent.interface';
import type { Propiedad } from '../models/property.interface';
import { Usuario } from '../models/user.interface';
import { UserService } from './user.service';
import { MOCK_PROPIEDADES } from './mock-data/properties.mock';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private apiUrl = '/api/agentes';
  private useMockData = true; // Cambiar a false cuando haya API real

  /**
   * Convierte un Usuario (con perfilAsesor) al formato Agente heredado
   * Para compatibilidad con componentes existentes
   */
  private usuarioToAgente(usuario: Usuario): Agente {
    const perfil = usuario.perfilAsesor;
    return {
      id: usuario.id,
      usuarioId: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono || '',
      cargo: perfil?.cargo || 'Asesor Inmobiliario',
      especialidad: perfil?.especialidad,
      fotoUrl: usuario.fotoUrl,
      biografia: perfil?.biografia,
      experienciaAnios: perfil?.experienciaAnios,
      idiomas: perfil?.idiomas || [],
      certificaciones: perfil?.certificaciones || [],
      premios: perfil?.premios || [],
      whatsapp: perfil?.whatsapp,
      linkedin: perfil?.linkedin,
      instagram: perfil?.instagram,
      facebook: perfil?.facebook,
      slogan: perfil?.slogan,
      destacado: usuario.destacado || false,
      activo: usuario.activo,
      // Estadísticas se llenarán desde propiedades
      propiedadesVendidas: perfil?.propiedadesVendidas || 0,
      propiedadesActivas: perfil?.propiedadesActivas || 0,
      clientesSatisfechos: perfil?.clientesSatisfechos || 0
    };
  }

  // =============================================
  // OBTENER TODOS LOS AGENTES
  // =============================================
  getAgentes(): Observable<Agente[]> {
    if (this.useMockData) {
      return this.userService.getUsuarios({ rol: 'asesor' }).pipe(
        map(response => (response.items || response.datos).map((u: Usuario) => this.usuarioToAgente(u))),
        delay(300)
      );
    }
    return this.http.get<Agente[]>(this.apiUrl);
  }

  // =============================================
  // OBTENER AGENTE POR ID
  // =============================================
  getAgentePorId(id: number): Observable<Agente | undefined> {
    if (this.useMockData) {
      return this.userService.getUsuarioPorId(id).pipe(
        map(usuario => usuario ? this.usuarioToAgente(usuario) : undefined),
        delay(200)
      );
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
      return this.userService.getUsuarios({ rol: 'asesor', destacado: true }).pipe(
        map(response => (response.items || response.datos)
          .filter((u: Usuario) => u.activo)
          .slice(0, limite)
          .map((u: Usuario) => this.usuarioToAgente(u))
        ),
        delay(200)
      );
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
