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
    phone: '0249 424-4568',
    email: 'fairwayparquizacion@gmail.com',
    address: 'Garibaldi 750, Tandil, Buenos Aires, Argentina',
    horario: ''
  },
  social: [
    { icon: 'fab fa-whatsapp', label: 'WhatsApp', url: 'https://wa.me/5492494244568' },
    { icon: 'fab fa-instagram', label: 'Instagram', url: 'https://www.instagram.com/fairwayserviciosintegrales/?hl=fi' },
    { icon: 'fab fa-facebook', label: 'Facebook', url: 'https://www.facebook.com/fairway.parquizacion.integral/' }
  ],
  map: {
    iframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3255.0876147220537!2d-59.14285922458904!3d-37.32794924099706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95911f1f5b33e93f%3A0xd8d529d9fd0e9302!2sGaribaldi%20750%2C%20Tandil%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1727804641234!5m2!1ses!2sar'
  },
  formFields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'telefono', label: 'Teléfono', type: 'tel', required: false },
    { name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true }
  ]
};



