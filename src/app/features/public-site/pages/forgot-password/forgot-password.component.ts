import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../member-area/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isLoading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.success.set(null);

    const email = this.form.value.email;

    this.authService.sendPasswordResetEmail(email).subscribe({
      next: () => {
        this.success.set(
          '✅ Se ha enviado un email con instrucciones para restablecer tu contraseña. ' +
          'Por favor revisa tu bandeja de entrada y la carpeta de spam.'
        );
        this.form.reset();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al enviar email de reset:', err);
        // Por seguridad, no indicamos si el email existe o no
        this.success.set(
          '✅ Si el email está registrado, recibirás instrucciones para restablecer tu contraseña.'
        );
        this.form.reset();
        this.isLoading.set(false);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (field?.hasError('email')) {
      return 'Ingresa un email válido';
    }
    return '';
  }
}
