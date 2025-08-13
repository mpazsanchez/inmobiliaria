// Mock de datos para la página de Contacto
export const CONTACT_PAGE_MOCK = {
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
    iframeUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d...' // Reemplazar por el embed real
  },
  formFields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'telefono', label: 'Teléfono', type: 'tel', required: false },
    { name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true }
  ]
};
