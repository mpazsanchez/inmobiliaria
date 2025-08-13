


import { Injectable, signal } from '@angular/core';
import { log } from 'console';
// const CONTACT_PAGE_MOCK = {
//   title: 'Contacto',
//   subtitle: '¿Tenés dudas o querés solicitar presupuesto?',
//   description: 'Completá el formulario y nuestro equipo te responderá a la brevedad. También podés contactarnos por teléfono o email.',
//   contactInfo: {
//     phone: '+34 123 456 789',
//     email: 'info@glazing.me',
//     address: 'Madrid, España & Buenos Aires, Argentina',
//     horario: 'Lunes a Viernes de 9 a 18hs'
//   },
//   social: [
//     { icon: 'fab fa-whatsapp', label: 'WhatsApp', url: 'https://wa.me/34123456789' },
//     { icon: 'fab fa-instagram', label: 'Instagram', url: 'https://instagram.com/glazing.me' },
//     { icon: 'fab fa-facebook', label: 'Facebook', url: 'https://facebook.com/glazing.me' }
//   ],
//   map: {
//     iframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d...'
//   },
//   formFields: [
//     { name: 'nombre', label: 'Nombre', type: 'text', required: true },
//     { name: 'email', label: 'Email', type: 'email', required: true },
//     { name: 'telefono', label: 'Teléfono', type: 'tel', required: false },
//     { name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true }
//   ]
// };

@Injectable({ providedIn: 'root' })
export class ContactPageService {
  readonly data = signal(CONTACT_PAGE_MOCK);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async fetchData(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    console.log('Fetching contact page data...', this.data);

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
    address: 'Madrid, España & Buenos Aires, Argentina',
    horario: 'Lunes a Viernes de 9 a 18hs'
  },
  social: [
    { icon: 'fab fa-whatsapp', label: 'WhatsApp', url: 'https://wa.me/34123456789' },
    { icon: 'fab fa-instagram', label: 'Instagram', url: 'https://instagram.com/glazing.me' },
    { icon: 'fab fa-facebook', label: 'Facebook', url: 'https://facebook.com/glazing.me' }
  ],
  map: {
    iframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.584!2d-64.19478!3d-31.40557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9432a28cb2b5d2f3%3A0x5e8b9c0d1e2f3a4b!2sPolarizados%20C%C3%B3rdoba%2C%20Blvd.%20Las%20Heras%20708%2C%20C%C3%B3rdoba%2C%20Argentina!5e0!3m2!1ses!2sar!4v1725545200000!5m2!1ses!2sar'
  },
  formFields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'telefono', label: 'Teléfono', type: 'tel', required: false },
    { name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true }
  ]
};



