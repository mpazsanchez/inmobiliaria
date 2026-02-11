import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { 
  TokenRecuperacion, 
  SolicitarRecuperacionDto, 
  ResetearPasswordDto 
} from '../models/user.interface';

/**
 * Servicio para gestionar la recuperación de contraseña
 * Implementa el flujo completo: solicitud -> email -> validación -> reset
 */
@Injectable({
  providedIn: 'root'
})
export class AuthRecoveryService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Estado del servicio
  private loading = signal(false);
  private error = signal<string | null>(null);

  // Mock de tokens de recuperación (en producción sería backend)
  private tokensRecuperacion: TokenRecuperacion[] = [];

  constructor() {}

  /**
   * Solicita un token de recuperación de contraseña
   * Envía un email al usuario con el link de recuperación
   */
  solicitarRecuperacion(dto: SolicitarRecuperacionDto): Observable<{ message: string }> {
    this.loading.set(true);
    this.error.set(null);

    // Mock: buscar usuario por email
    const usuariosData = this.isBrowser ? localStorage.getItem('usuarios') : null;
    const usuarios = usuariosData ? JSON.parse(usuariosData) : [];
    const usuario = usuarios.find((u: any) => u.email === dto.email);

    return of(null).pipe(
      delay(1500), // Simular llamada a API
      map(() => {
        this.loading.set(false);

        if (!usuario) {
          // Por seguridad, no revelamos si el email existe o no
          return {
            message: 'Si el email existe en nuestro sistema, recibirás un correo con instrucciones para recuperar tu contraseña.'
          };
        }

        // Generar token único
        const token = this.generarToken();
        const ahora = new Date();
        const expiracion = new Date(ahora.getTime() + 60 * 60 * 1000); // 1 hora

        const tokenRecuperacion: TokenRecuperacion = {
          id: this.tokensRecuperacion.length + 1,
          usuarioId: usuario.id,
          token: token,
          fechaCreacion: ahora,
          fechaExpiracion: expiracion,
          usado: false
        };

        this.tokensRecuperacion.push(tokenRecuperacion);
        
        // Guardar tokens (en producción sería en backend)
        if (this.isBrowser) {
          localStorage.setItem('tokens_recuperacion', JSON.stringify(this.tokensRecuperacion));
        }

        // Mock: simular envío de email
        console.log(`📧 Email enviado a ${dto.email}`);
        console.log(`Link de recuperación: /reset-password?token=${token}`);

        return {
          message: 'Si el email existe en nuestro sistema, recibirás un correo con instrucciones para recuperar tu contraseña.'
        };
      })
    );
  }

  /**
   * Valida si un token de recuperación es válido
   */
  validarToken(token: string): Observable<boolean> {
    this.loading.set(true);

    // Cargar tokens
    const tokensData = this.isBrowser ? localStorage.getItem('tokens_recuperacion') : null;
    this.tokensRecuperacion = tokensData ? JSON.parse(tokensData) : [];

    return of(null).pipe(
      delay(800),
      map(() => {
        this.loading.set(false);

        const tokenObj = this.tokensRecuperacion.find(t => t.token === token);

        if (!tokenObj) {
          this.error.set('Token inválido');
          return false;
        }

        if (tokenObj.usado) {
          this.error.set('Este token ya fue utilizado');
          return false;
        }

        const ahora = new Date();
        const expiracion = new Date(tokenObj.fechaExpiracion);

        if (ahora > expiracion) {
          this.error.set('Este token ha expirado. Solicita uno nuevo.');
          return false;
        }

        return true;
      })
    );
  }

  /**
   * Resetea la contraseña usando un token válido
   */
  resetearPassword(dto: ResetearPasswordDto): Observable<{ message: string }> {
    this.loading.set(true);
    this.error.set(null);

    // Cargar tokens
    const tokensData = this.isBrowser ? localStorage.getItem('tokens_recuperacion') : null;
    this.tokensRecuperacion = tokensData ? JSON.parse(tokensData) : [];

    return of(null).pipe(
      delay(1500),
      map(() => {
        const tokenObj = this.tokensRecuperacion.find(t => t.token === dto.token);

        if (!tokenObj || tokenObj.usado) {
          this.loading.set(false);
          this.error.set('Token inválido o ya utilizado');
          throw new Error('Token inválido');
        }

        const ahora = new Date();
        const expiracion = new Date(tokenObj.fechaExpiracion);

        if (ahora > expiracion) {
          this.loading.set(false);
          this.error.set('Token expirado');
          throw new Error('Token expirado');
        }

        // Actualizar contraseña del usuario
        const usuariosData = this.isBrowser ? localStorage.getItem('usuarios') : null;
        const usuarios = usuariosData ? JSON.parse(usuariosData) : [];
        const usuarioIndex = usuarios.findIndex((u: any) => u.id === tokenObj.usuarioId);

        if (usuarioIndex === -1) {
          this.loading.set(false);
          this.error.set('Usuario no encontrado');
          throw new Error('Usuario no encontrado');
        }

        // Hash de la nueva contraseña (en producción usar bcrypt en backend)
        usuarios[usuarioIndex].passwordHash = this.hashPassword(dto.nuevaPassword);
        if (this.isBrowser) {
          localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }

        // Marcar token como usado
        tokenObj.usado = true;
        if (this.isBrowser) {
          localStorage.setItem('tokens_recuperacion', JSON.stringify(this.tokensRecuperacion));
        }

        this.loading.set(false);

        return {
          message: 'Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión.'
        };
      })
    );
  }

  /**
   * Limpia tokens expirados (mantenimiento)
   */
  limpiarTokensExpirados(): void {
    if (!this.isBrowser) return;

    const tokensData = localStorage.getItem('tokens_recuperacion');
    if (!tokensData) return;

    this.tokensRecuperacion = JSON.parse(tokensData);
    const ahora = new Date();

    this.tokensRecuperacion = this.tokensRecuperacion.filter(token => {
      const expiracion = new Date(token.fechaExpiracion);
      return ahora <= expiracion && !token.usado;
    });

    localStorage.setItem('tokens_recuperacion', JSON.stringify(this.tokensRecuperacion));
  }

  // Helpers
  private generarToken(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private hashPassword(password: string): string {
    // Mock de hashing (en producción usar bcrypt en el backend)
    return `hash_${password}_${Date.now()}`;
  }

  // Getters
  isLoading = this.loading.asReadonly();
  getError = this.error.asReadonly();
}
