import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../member-area/services/auth.service';

// Validator para verificar que las contraseñas coincidan
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  if (!newPassword || !confirmPassword) {
    return null;
  }

  return newPassword.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  token = signal<string | null>(null);
  tokenValid = signal<boolean | null>(null);
  isValidating = signal(true);
  isSubmitting = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  form: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordMatchValidator });

  ngOnInit(): void {
    // Extraer token de los query params
    this.token.set(this.route.snapshot.queryParamMap.get('token'));

    if (!this.token()) {
      this.error.set('Token de restablecimiento no válido o no proporcionado.');
      this.tokenValid.set(false);
      this.isValidating.set(false);
      return;
    }

    // Validar token con el backend
    this.authService.validateResetToken(this.token()!).subscribe({
      next: (valid) => {
        this.tokenValid.set(valid);
        this.isValidating.set(false);
        if (!valid) {
          this.error.set('El enlace de restablecimiento ha expirado o no es válido. Solicita uno nuevo.');
        }
      },
      error: (err) => {
        console.error('Error al validar token:', err);
        this.tokenValid.set(false);
        this.isValidating.set(false);
        this.error.set('Error al validar el enlace. Por favor, solicita uno nuevo.');
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.error.set(null);

    const { newPassword } = this.form.value;

    this.authService.resetPasswordWithToken(this.token()!, newPassword).subscribe({
      next: () => {
        this.success.set(
          '✅ Contraseña actualizada exitosamente. Serás redirigido al inicio de sesión...'
        );
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        console.error('Error al restablecer contraseña:', err);
        this.error.set(
          'Error al actualizar la contraseña. El enlace puede haber expirado. ' +
          'Por favor, solicita uno nuevo.'
        );
        this.isSubmitting.set(false);
      }
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.showPassword.set(!this.showPassword());
    } else {
      this.showConfirmPassword.set(!this.showConfirmPassword());
    }
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
    
    if (field?.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `La contraseña debe tener al menos ${minLength} caracteres`;
    }
    
    return '';
  }

  hasPasswordMismatch(): boolean {
    return !!(
      this.form.hasError('passwordMismatch') &&
      this.form.get('confirmPassword')?.touched
    );
  }
}
