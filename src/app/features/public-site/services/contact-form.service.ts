import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactFormService {
  private readonly apiUrl = '';
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<boolean>(false);

  private readonly http = inject(HttpClient);

  async sendContactForm(data: ContactFormData): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);
    try {
      // Simulación de envío al backend
      await firstValueFrom(this.http.post(this.apiUrl, data));
      this.success.set(true);
      console.log('Formulario enviado con éxito:', data);
      
    } catch (err) {
      this.error.set('No se pudo enviar el formulario.');
    } finally {
      this.loading.set(false);
    }
  }
}
