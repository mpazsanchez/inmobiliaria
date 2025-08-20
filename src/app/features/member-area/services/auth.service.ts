import { Injectable, signal } from '@angular/core';
import { User, UserRole } from '../models/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user = signal<User | null>(null);

  login(email: string, password: string): Promise<void> {
    // Simulación de login
    return new Promise((resolve, reject) => {
      if (email === 'demo@demo.com' && password === 'demo') {
        this.user.set({
          id: '1',
          name: 'Demo User',
          email,
          role: 'comprador'
        });
        resolve();
      } else {
        reject(new Error('Credenciales inválidas'));
      }
    });
  }

  logout() {
    this.user.set(null);
  }

  getUser() {
    return this.user();
  }

  isAuthenticated() {
    return !!this.user();
  }

  getRole(): UserRole | null {
    return this.user()?.role ?? null;
  }

  upgradeToInstaller() {
    if (this.user()) {
      this.user.set({ ...this.user()!, role: 'instalador-en-formacion' });
    }
  }
}
