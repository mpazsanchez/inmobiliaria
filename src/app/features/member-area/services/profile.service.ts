import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import type { Agente } from '../../../core/models/agent.interface';
import { AGENTES_MOCK } from '../../../core/services/mock-data/agents.mock';
import { CloudinaryService } from '../../../core/services/cloudinary.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private cloudinary = inject(CloudinaryService);
  private useMockData = true;

  /**
   * Obtiene el perfil completo del asesor por su ID de usuario
   */
  getMyProfile(userId: number): Observable<Agente | null> {
    if (this.useMockData) {
      const agente = AGENTES_MOCK.find(a => a.id === userId);
      return of(agente || null).pipe(delay(300));
    }

    // TODO: Implementar llamada a API real
    // return this.http.get<Agente>(`${this.apiUrl}/profile/${userId}`);
    return of(null);
  }

  /**
   * Actualiza el perfil del asesor
   */
  updateProfile(userId: number, data: Partial<Agente>): Observable<Agente> {
    if (this.useMockData) {
      const index = AGENTES_MOCK.findIndex(a => a.id === userId);

      if (index === -1) {
        return throwError(() => new Error('Agente no encontrado'));
      }

      // Actualizar datos en el mock (esto persiste en memoria durante la sesion)
      AGENTES_MOCK[index] = {
        ...AGENTES_MOCK[index],
        ...data
      };

      return of(AGENTES_MOCK[index]).pipe(delay(500));
    }

    // TODO: Implementar llamada a API real
    // return this.http.put<Agente>(`${this.apiUrl}/profile/${userId}`, data);
    return throwError(() => new Error('API no implementada'));
  }

  /**
   * Sube una foto de perfil usando Cloudinary
   * Retorna URL persistente que funciona despues de refresh
   */
  uploadPhoto(file: File): Observable<{ url: string }> {
    // Usar Cloudinary para upload real (funciona en mock y produccion)
    return this.cloudinary.uploadAgentPhoto(file).pipe(
      map(result => ({ url: result.secureUrl }))
    );
  }

  /**
   * Activa/desactiva el uso de datos mock
   */
  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
  }
}
