import { Component, signal } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule]
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

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password)
        .then(() => {
          this.error.set(null);
          this.router.navigate(['/member-area/dashboard']);
        })
        .catch((err: any) => this.error.set(err.message));
    } else {
      this.error.set('Completa todos los campos correctamente.');
    }
  }

  loginFake(): void {
    this.authService?.login('demo@demo.com', 'demo')
      .then(() => {
        this.error?.set(null);
        this.router?.navigate(['/member-area/dashboard']);
      })
      .catch((err: any) => this.error?.set(err.message));
  }
}
