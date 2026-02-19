import { Component, signal, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private seoService = inject(SeoService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  error = signal<string | null>(null);
  showPassword = false;
  isLoading = false;

  // Rate limiting
  isBlocked = signal(false);
  blockTimeRemaining = signal(0);
  private blockTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.seoService.setTitle('Iniciar Sesión | Fairway Propiedades');
    this.seoService.setDescription('Accedé al panel de gestión de Fairway Propiedades. Administrá propiedades, contactos y tu perfil.');
    this.seoService.setKeywords('fairway login, panel administración, área privada, gestión inmobiliaria');

    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/member-area/dashboard']);
    }
  }

  ngOnDestroy(): void {
    this.clearBlockTimer();
  }

  /**
   * Rellena el formulario con credenciales de prueba
   */
  fillCredentials(email: string, password: string): void {
    this.loginForm.patchValue({ email, password });
  }

  /**
   * Procesa el login del usuario
   */
  login(): void {
    // No permitir login si está bloqueado por rate limiting
    if (this.isBlocked()) {
      return;
    }

    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error.set(null);

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password)
        .then(() => {
          this.router.navigate(['/member-area/dashboard']);
        })
        .catch((err: any) => {
          this.handleLoginError(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.error.set('Completa todos los campos correctamente.');
    }
  }

  /**
   * Maneja errores de login incluyendo rate limiting
   */
  private handleLoginError(err: any): void {
    // Detectar error de rate limiting (HTTP 429)
    if (err.status === 429 || err.message?.includes('Too Many Requests') || err.message?.includes('demasiados intentos')) {
      // Extraer tiempo de espera del header Retry-After o usar default de 60 segundos
      const retryAfter = err.retryAfter || 60;
      this.startBlockTimer(retryAfter);
      this.error.set(`Demasiados intentos fallidos. Esperá ${retryAfter} segundos.`);
    } else {
      this.error.set(err.message || 'Credenciales inválidas');
    }
  }

  /**
   * Inicia el temporizador de bloqueo por rate limiting
   */
  private startBlockTimer(seconds: number): void {
    this.clearBlockTimer();
    this.isBlocked.set(true);
    this.blockTimeRemaining.set(seconds);

    this.blockTimer = setInterval(() => {
      const remaining = this.blockTimeRemaining() - 1;
      this.blockTimeRemaining.set(remaining);

      if (remaining <= 0) {
        this.clearBlockTimer();
        this.isBlocked.set(false);
        this.error.set(null);
      }
    }, 1000);
  }

  /**
   * Limpia el temporizador de bloqueo
   */
  private clearBlockTimer(): void {
    if (this.blockTimer) {
      clearInterval(this.blockTimer);
      this.blockTimer = null;
    }
  }
}
