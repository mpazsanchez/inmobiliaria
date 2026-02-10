import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';
import { CloudinaryService } from '../../../core/services/cloudinary.service';
import { AuthService } from './auth.service';
import type { Usuario, ActualizarUsuarioDto } from '../../../core/models/user.interface';

/**
 * Servicio de perfil del usuario autenticado
 * Ahora usa UserService internamente para evitar duplicación
 */
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private cloudinary = inject(CloudinaryService);
  private userService = inject(UserService);
  private authService = inject(AuthService);

  /**
   * Obtiene el perfil completo del usuario autenticado
   * En mock usa el usuario de AuthService
   */
  getMyProfile(): Observable<Usuario | null> {
    const usuario = this.authService.getUsuario();

    if (!usuario) {
      return of(null);
    }

    // Usar UserService que ya tiene la lógica de mock/real
    return this.userService.getUsuarioPorId(usuario.id);
  }

  /**
   * Actualiza el perfil del usuario autenticado
   * Solo permite editar ciertos campos (no rol, no activo, etc)
   */
  updateMyProfile(data: ActualizarUsuarioDto): Observable<Usuario> {
    const usuario = this.authService.getUsuario();

    if (!usuario) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    // Usar UserService para actualizar
    return this.userService.actualizarUsuario(usuario.id, data);
  }

  /**
   * Sube una foto de perfil usando Cloudinary
   * Retorna URL persistente que funciona después de refresh
   */
  uploadPhoto(file: File): Observable<{ url: string }> {
    // Usar Cloudinary para upload real (funciona en mock y producción)
    return this.cloudinary.uploadAgentPhoto(file).pipe(
      map(result => ({ url: result.secureUrl }))
    );
  }

  /**
   * Cambia la contraseña del usuario autenticado
   * TODO: Implementar cuando backend esté listo
   */
  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    const usuario = this.authService.getUsuario();

    if (!usuario) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    // TODO: Implementar llamada a API real
    // return this.http.put<void>('/api/usuarios/me/password', { oldPassword, newPassword });
    
    // Mock: simular éxito
    return of(void 0).pipe(delay(500));
  }
}
