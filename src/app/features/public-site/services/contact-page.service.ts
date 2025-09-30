import { Injectable, signal } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class ContactPageService {
  readonly data = signal(CONTACT_PAGE_MOCK);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async fetchData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      // Simula delay de fetch
      await new Promise(res => setTimeout(res, 300));
      this.data.set(CONTACT_PAGE_MOCK);
    } catch (err) {
      this.error.set('Error al cargar la página de contacto');
    } finally {
      this.loading.set(false);
    }
  }
}

// Data mock para la página de Contacto
const CONTACT_PAGE_MOCK = {
  title: 'Contacto',
  subtitle: '¿Tenés dudas o querés solicitar presupuesto?',
  description: 'Completá el formulario y nuestro equipo te responderá a la brevedad. También podés contactarnos por teléfono o email.',
  contactInfo: {
    phone: '+34 123 456 789',
    email: 'info@glazing.me',
    address: 'Blvd Las Heras 708, Córdoba Argentina',
    horario: 'Lunes a Viernes de 9 a 18hs'
  },
  social: [
    { icon: 'fab fa-whatsapp', label: 'WhatsApp', url: 'https://wa.me/5492494380238' },
    { icon: 'fab fa-instagram', label: 'Instagram', url: 'https://www.instagram.com/fairwayserviciosintegrales/?hl=fi' },
    { icon: 'fab fa-facebook', label: 'Facebook', url: 'https://www.facebook.com/fairway.parquizacion.integral/' }
  ],
  map: {
    iframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1234567890!2d-64.1887766846812!3d-31.42008398141809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a2e2b2b2b2b2%3A0x1234567890abcdef!2sBlvd%20Las%20Heras%20708%2C%20C%C3%B3rdoba!5e0!3m2!1ses!2sar!4v1234567890123'
  },
  formFields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'telefono', label: 'Teléfono', type: 'tel', required: false },
    { name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true }
  ]
};



