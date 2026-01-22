import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  error = signal<string | null>(null);
  showPassword = false;
  isLoading = false;

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
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error.set(null);

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password)
        .then(() => {
          this.router.navigate(['/member-area/dashboard']);
        })
        .catch((err: any) => {
          this.error.set(err.message);
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.error.set('Completa todos los campos correctamente.');
    }
  }
}
