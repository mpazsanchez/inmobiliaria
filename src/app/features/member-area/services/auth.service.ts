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
          id: 999, // ID único para admin, no debe coincidir con ningún agente
          nombre: 'Administrador Fairway',
          email,
          telefono: '+54 11 4555-0000',
          rol: 'administrador',
          fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
          passwordHash: '',
          activo: true,
          fechaRegistro: '2023-01-01'
        };
        this.usuario.set(user);
        this.guardarSesion(user);
        resolve(user);
      } else if (email === 'asesor@fairway.com' && password === 'asesor123') {
        // Usuario asesor - ID coincide con Maria Gonzalez en AGENTES_MOCK (id: 1)
        const user: Usuario = {
          id: 1,
          nombre: 'Maria Gonzalez',
          email,
          telefono: '+54 9 11 2345-6789',
          rol: 'asesor',
          fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
          passwordHash: '',
          activo: true,
          fechaRegistro: '2022-03-15'
        };
        this.usuario.set(user);
        this.guardarSesion(user);
        resolve(user);
      } else if (email === 'carlos@fairway.com' && password === 'carlos123') {
        // Usuario asesor - ID coincide con Carlos Rodriguez en AGENTES_MOCK (id: 2)
        const user: Usuario = {
          id: 2,
          nombre: 'Carlos Rodriguez',
          email,
          telefono: '+54 9 11 8765-4321',
          rol: 'asesor',
          fotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
          passwordHash: '',
          activo: true,
          fechaRegistro: '2023-01-10'
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
