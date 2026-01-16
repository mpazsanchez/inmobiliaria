import { Injectable, signal, computed } from '@angular/core';
import { Usuario } from '../../../core/models/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuario = signal<Usuario | null>(null);

  // Computed signals para acceso rapido
  readonly isLoggedIn = computed(() => !!this.usuario());

  // =============================================
  // LOGIN - TODO: Conectar con API real
  // =============================================
  login(email: string, password: string): Promise<Usuario> {
    // TODO: Reemplazar con llamada HTTP al backend
    return new Promise((resolve, reject) => {
      // Mock temporal para desarrollo
      if (email === 'admin@fairway.com' && password === 'admin123') {
        const user: Usuario = {
          id: 1,
          nombre: 'Administrador Fairway',
          email,
          telefono: '+54 11 4555-0000',
          rol: 'administrador',
          fotoUrl: 'assets/images/agents/admin.jpg',
          passwordHash: '',
          activo: true,
          fechaRegistro: '2023-01-01'
        };
        this.usuario.set(user);
        this.guardarSesion(user);
        resolve(user);
      } else if (email === 'asesor@fairway.com' && password === 'asesor123') {
        const user: Usuario = {
          id: 2,
          nombre: 'Maria Garcia',
          email,
          telefono: '+54 11 4555-1234',
          rol: 'asesor',
          fotoUrl: 'assets/images/agents/maria-garcia.jpg',
          passwordHash: '',
          activo: true,
          fechaRegistro: '2022-03-15'
        };
        this.usuario.set(user);
        this.guardarSesion(user);
        resolve(user);
      } else {
        reject(new Error('Credenciales invalidas'));
      }
    });
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

  isAuthenticated(): boolean {
    return !!this.usuario();
  }

  // =============================================
  // PERSISTENCIA DE SESION
  // =============================================
  private guardarSesion(usuario: Usuario): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('fairway_user', JSON.stringify(usuario));
    }
  }

  private limpiarSesion(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('fairway_user');
    }
  }

  restaurarSesion(): void {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('fairway_user');
      if (stored) {
        try {
          this.usuario.set(JSON.parse(stored));
        } catch {
          this.limpiarSesion();
        }
      }
    }
  }
}
