import { Component, inject, Inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeadService } from '../../../../../core/services/lead.service';
import { RecaptchaService } from '../../../../../core/services/recaptcha.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  contactForm: FormGroup;
  isBrowser: boolean;
  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);

  private readonly fb = inject(FormBuilder);
  private readonly leadService = inject(LeadService);
  private readonly recaptchaService = inject(RecaptchaService);

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  /**
   * Verifica si un campo es inválido y ha sido tocado
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Maneja el envío del formulario con verificación reCAPTCHA
   */
  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    // Ejecutar reCAPTCHA antes de enviar
    const recaptchaToken = await this.recaptchaService.executeRecaptcha('CONTACT');

    // Si reCAPTCHA falla y está habilitado, mostrar error
    if (!recaptchaToken && this.recaptchaService.isAvailable) {
      this.loading.set(false);
      this.error.set('Error de verificación. Por favor, intente nuevamente.');
      return;
    }

    const mensaje = `Asunto: ${this.contactForm.value.subject}\n\n${this.contactForm.value.message}`;

    this.leadService.submitInquiry({
      propiedadId: 0, // Consulta general
      asesorId: 0, // Backend asignará automáticamente
      nombreContacto: this.contactForm.value.name,
      emailContacto: this.contactForm.value.email,
      telefonoContacto: this.contactForm.value.phone,
      mensaje: mensaje,
      recaptchaToken: recaptchaToken || undefined // Enviar token al backend
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        this.contactForm.reset();

        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          this.success.set(false);
        }, 5000);
      },
      error: (err: Error) => {
        console.error('Error al enviar consulta:', err);
        this.loading.set(false);
        this.error.set('Hubo un error al enviar el mensaje. Por favor intente nuevamente.');

        // Ocultar mensaje de error después de 5 segundos
        setTimeout(() => {
          this.error.set(null);
        }, 5000);
      }
    });
  }
}
