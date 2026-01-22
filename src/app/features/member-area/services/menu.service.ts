import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// =============================================
// INTERFACES
// =============================================
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  orden: number;
}

export interface MenuResponse {
  menus: {
    administrador: MenuItem[];
    asesor: MenuItem[];
  };
}

// =============================================
// SERVICIO DE MENU
// =============================================
@Injectable({ providedIn: 'root' })
export class MenuService {
  private http = inject(HttpClient);

  // Flag para cambiar entre mock y API real
  private useMockData = true;

  // URLs
  private readonly JSON_URL = 'assets/data/cms-menu.json';
  private readonly API_URL = '/api/v1/menu'; // TODO: URL real del backend

  /**
   * Obtiene el menu segun el rol del usuario
   * @param rol - 'administrador' o 'asesor'
   * @returns Observable con los items del menu
   */
  getMenuByRole(rol: string): Observable<MenuItem[]> {
    if (this.useMockData) {
      return this.getMenuFromJson(rol);
    } else {
      return this.getMenuFromApi(rol);
    }
  }

  /**
   * Carga el menu desde el archivo JSON local
   */
  private getMenuFromJson(rol: string): Observable<MenuItem[]> {
    return this.http.get<MenuResponse>(this.JSON_URL).pipe(
      map(response => {
        const normalizedRol = rol.toLowerCase();
        if (normalizedRol === 'administrador') {
          return response.menus.administrador;
        } else if (normalizedRol === 'asesor') {
          return response.menus.asesor;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error cargando menu desde JSON:', error);
        return of([]);
      })
    );
  }

  /**
   * Carga el menu desde la API real
   * TODO: Implementar cuando el backend este listo
   */
  private getMenuFromApi(rol: string): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.API_URL}/${rol}`).pipe(
      catchError(error => {
        console.error('Error cargando menu desde API:', error);
        // Fallback a JSON si falla la API
        return this.getMenuFromJson(rol);
      })
    );
  }
}
