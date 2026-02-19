import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, of, throwError, delay } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Usuario } from '../../../core/models/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private jsonUrl = '/assets/data/usuarios.json';
  private usuario = signal<Usuario | null>(null);

  // Computed signals para acceso rapido
  readonly isLoggedIn = computed(() => !!this.usuario());
  readonly currentUser = computed(() => this.usuario());

  constructor() {
    // Restaurar sesión solo en el navegador
    if (this.isBrowser) {
      this.restaurarSesion();
    }
  }

  // =============================================
  // LOGIN - TODO: Conectar con API real
  // =============================================
  async login(email: string, password: string): Promise<Usuario> {
    try {
      // Leer todos los usuarios del JSON
      const response = await firstValueFrom(
        this.http.get<{ usuarios: Usuario[] }>(this.jsonUrl)
      );
      
      const usuarios = response.usuarios || [];
      
      // Buscar usuario por email
      const usuario = usuarios.find(u => u.email === email);
      
      if (!usuario) {
        throw new Error('Credenciales inválidas');
      }
      
      // Validar contraseña (en mock simplificado)
      const passwordValida = this.validarPassword(email, password);
      
      if (!passwordValida) {
        throw new Error('Credenciales inválidas');
      }
      
      // Login exitoso
      this.usuario.set(usuario);
      this.guardarSesion(usuario);
      return usuario;
      
    } catch (error) {
      throw new Error('Credenciales inválidas');
    }
  }

  /**
   * Validación de contraseña mock
   * En producción, esto se hace en el backend
   */
  private validarPassword(email: string, password: string): boolean {
    const credencialesValidas: Record<string, string> = {
      'admin@fairway.com': 'admin123',
      'maria@fairway.com': 'asesor123',
      'carlos@fairway.com': 'carlos123',
      'laura@fairway.com': 'laura123',
      'juan@fairway.com': 'juan123'
    };
    
    return credencialesValidas[email] === password;
  }

  // =============================================
  // LOGOUT
  // =============================================
  logout(): void {
    this.usuario.set(null);
    this.limpiarSesion();
  }

  // =============================================
  // GETTERS
  // =============================================
  getUsuario(): Usuario | null {
    return this.usuario();
  }

  getUser(): Usuario | null {
    return this.usuario();
  }

  isAuthenticated(): boolean {
    return !!this.usuario();
  }

  // =============================================
  // PERSISTENCIA DE SESION
  // =============================================
  private guardarSesion(usuario: Usuario): void {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      localStorage.setItem('fairway_user', JSON.stringify(usuario));
    }
  }

  private limpiarSesion(): void {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      localStorage.removeItem('fairway_user');
    }
  }

  restaurarSesion(): void {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('fairway_user');
      if (stored) {
        try {
          const usuario = JSON.parse(stored);
          this.usuario.set(usuario);
        } catch (error) {
          console.error('[AuthService] Error al restaurar sesión:', error);
          this.limpiarSesion();
        }
      }
    }
  }

  // =============================================
  // ROLES Y PERMISOS
  // =============================================
  isAdmin(): boolean {
    return this.usuario()?.rol === 'admin';
  }

  isAsesor(): boolean {
    return this.usuario()?.rol === 'asesor';
  }

  getCurrentUserId(): number | null {
    return this.usuario()?.id || null;
  }

  // =============================================
  // PASSWORD RESET - Mock para desarrollo
  // =============================================
  
  /**
   * Envía un email con link de restablecimiento de contraseña
   * En producción: POST /api/auth/forgot-password
   */
  sendPasswordResetEmail(email: string): Observable<void> {
    console.log('[AuthService] Enviando email de reset a:', email);
    
    // TODO: En producción, llamar al endpoint real
    // return this.http.post<void>('/api/auth/forgot-password', { email });
    
    // Mock: Simular delay de envío de email
    return of(void 0).pipe(
      delay(1500),
      map(() => {
        console.log('[AuthService] Email de reset enviado exitosamente');
        // En producción, el backend envía el email con el token
        return void 0;
      })
    );
  }

  /**
   * Valida si un token de reset es válido
   * En producción: GET /api/auth/validate-reset-token?token=xyz
   */
  validateResetToken(token: string): Observable<boolean> {
    console.log('[AuthService] Validando token:', token);
    
    // TODO: En producción, llamar al endpoint real
    // return this.http.get<{ valid: boolean }>('/api/auth/validate-reset-token', {
    //   params: { token }
    // }).pipe(map(response => response.valid));
    
    // Mock: Simular validación de token
    // Tokens válidos en mock: cualquier string de más de 10 caracteres
    return of(void 0).pipe(
      delay(1000),
      map(() => {
        const isValid = token.length > 10;
        console.log('[AuthService] Token válido:', isValid);
        return isValid;
      })
    );
  }

  /**
   * Restablece la contraseña usando un token
   * En producción: POST /api/auth/reset-password
   */
  resetPasswordWithToken(token: string, newPassword: string): Observable<void> {
    console.log('[AuthService] Restableciendo contraseña con token');
    
    // TODO: En producción, llamar al endpoint real
    // return this.http.post<void>('/api/auth/reset-password', {
    //   token,
    //   newPassword
    // });
    
    // Mock: Simular actualización de contraseña
    return of(void 0).pipe(
      delay(1500),
      map(() => {
        console.log('[AuthService] Contraseña restablecida exitosamente');
        // En producción, el backend actualiza la contraseña hasheada
        return void 0;
      })
    );
  }
}
