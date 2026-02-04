import type { Agente } from '../../models/agent.interface';

// =============================================
// DATOS MOCK DE AGENTES INMOBILIARIOS
// =============================================

export const AGENTES_MOCK: Agente[] = [
  {
    id: 999,
    usuarioId: 999,
    nombre: 'Administrador',
    apellido: 'Fairway',
    cargo: 'Administrador del Sistema',
    email: 'admin@fairway.com',
    telefono: '+54 11 4555-0000',
    whatsapp: '541145550000',
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    especialidad: 'Gestión y Administración Inmobiliaria',
    slogan: 'Liderando el equipo Fairway',
    biografia: 'Administrador general de Fairway Real Estate, encargado de la gestión del equipo y supervisión de operaciones.',
    experienciaAnios: 20,
    idiomas: ['Español', 'Inglés'],
    linkedin: 'https://linkedin.com/in/admin-fairway',
    propiedadesVendidas: 0,
    propiedadesActivas: 0,
    clientesSatisfechos: 0,
    activo: true,
    destacado: false
  },
  {
    id: 1,
    usuarioId: 1,
    nombre: 'María',
    apellido: 'González',
    cargo: 'Broker Asociado',
    email: 'maria.gonzalez@fairway.com.ar',
    telefono: '+54 9 11 2345-6789',
    whatsapp: '5491123456789',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    especialidad: 'Propiedades de Lujo y Barrios Cerrados',
    slogan: 'Tu inversión en las mejores manos',
    biografia: 'Con más de 15 años de experiencia en el mercado inmobiliario de Buenos Aires, me especializo en propiedades de alto valor y desarrollos exclusivos. Mi compromiso es brindar un servicio personalizado que supere las expectativas de mis clientes, tanto en la compra como en la venta de propiedades premium.',
    experienciaAnios: 15,
    idiomas: ['Español', 'Inglés', 'Portugués'],
    linkedin: 'https://linkedin.com/in/maria-gonzalez',
    instagram: 'https://instagram.com/mariagonzalez.realestate',
    propiedadesVendidas: 127,
    propiedadesActivas: 8,
    clientesSatisfechos: 95,
    certificaciones: ['Certified International Property Specialist', 'Luxury Home Marketing Specialist'],
    premios: ['Top Producer 2024', 'Excellence Award 2023'],
    activo: true,
    destacado: true
  },
  {
    id: 2,
    usuarioId: 2,
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    cargo: 'Agente Inmobiliario Senior',
    email: 'carlos.rodriguez@fairway.com.ar',
    telefono: '+54 9 11 8765-4321',
    whatsapp: '5491187654321',
    fotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    especialidad: 'Primera Vivienda e Inversiones',
    slogan: 'Haciendo realidad tu primer hogar',
    biografia: 'Especialista en acompañar a familias en la búsqueda de su primera vivienda. Entiendo la importancia de este paso y trabajo con dedicación para encontrar la propiedad perfecta que se ajuste a tus necesidades y presupuesto. Mi experiencia de 10 años me permite ofrecer asesoramiento integral en cada etapa del proceso.',
    experienciaAnios: 10,
    idiomas: ['Español', 'Inglés'],
    linkedin: 'https://linkedin.com/in/carlos-rodriguez',
    facebook: 'https://facebook.com/carlos.rodriguez.realtor',
    propiedadesVendidas: 89,
    propiedadesActivas: 12,
    clientesSatisfechos: 78,
    certificaciones: ['Accredited Buyer\'s Representative', 'Real Estate Negotiation Expert'],
    activo: true,
    destacado: true
  },
  {
    id: 3,    usuarioId: 5,    nombre: 'Ana',
    apellido: 'Martínez',
    cargo: 'Especialista en Propiedades Comerciales',
    email: 'ana.martinez@fairway.com.ar',
    telefono: '+54 9 11 4567-8901',
    whatsapp: '5491145678901',
    fotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    especialidad: 'Inmuebles Comerciales y Oficinas',
    slogan: 'Potenciando tu negocio con la ubicación ideal',
    biografia: 'Con formación en administración de empresas y 8 años en el sector inmobiliario comercial, me dedico a ayudar a empresarios y emprendedores a encontrar el espacio perfecto para sus negocios. Conozco profundamente el mercado de locales, oficinas y espacios comerciales en las principales zonas empresariales de la ciudad.',
    experienciaAnios: 8,
    idiomas: ['Español', 'Inglés', 'Francés'],
    linkedin: 'https://linkedin.com/in/ana-martinez',
    instagram: 'https://instagram.com/anamartinez.commercial',
    propiedadesVendidas: 64,
    propiedadesActivas: 6,
    clientesSatisfechos: 52,
    certificaciones: ['Commercial Real Estate Specialist', 'Investment Property Advisor'],
    premios: ['Rising Star Award 2024'],
    activo: true,
    destacado: true
  },
  {
    id: 4,    usuarioId: 6,    nombre: 'Roberto',
    apellido: 'Fernández',
    cargo: 'Agente Inmobiliario',
    email: 'roberto.fernandez@fairway.com.ar',
    telefono: '+54 9 11 3456-7890',
    whatsapp: '5491134567890',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    especialidad: 'Departamentos y Propiedades en Zona Norte',
    slogan: 'Conocimiento local, servicio global',
    biografia: 'Nacido y criado en Zona Norte, conozco cada rincón de Olivos, San Isidro y Vicente López. Mi experiencia de 6 años me permite ofrecer un asesoramiento único sobre las mejores opciones de departamentos y casas en esta zona premium de Buenos Aires.',
    experienciaAnios: 6,
    idiomas: ['Español', 'Inglés'],
    linkedin: 'https://linkedin.com/in/roberto-fernandez',
    propiedadesVendidas: 45,
    propiedadesActivas: 9,
    clientesSatisfechos: 42,
    activo: true,
    destacado: false
  },
  {
    id: 5,    usuarioId: 3,    nombre: 'Laura',
    apellido: 'Sánchez',
    cargo: 'Agente Inmobiliario',
    email: 'laura.sanchez@fairway.com.ar',
    telefono: '+54 9 11 2345-9876',
    whatsapp: '5491123459876',
    fotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    especialidad: 'Tasaciones y Oportunidades de Inversión',
    slogan: 'Inversiones inteligentes en el momento correcto',
    biografia: 'Especialista en tasaciones y análisis de mercado, ayudo a inversores a identificar las mejores oportunidades del momento. Mi formación en economía y mi experiencia de 7 años me permiten ofrecer un análisis detallado de cada inversión inmobiliaria.',
    experienciaAnios: 7,
    idiomas: ['Español', 'Inglés'],
    linkedin: 'https://linkedin.com/in/laura-sanchez',
    propiedadesVendidas: 53,
    propiedadesActivas: 7,
    clientesSatisfechos: 48,
    certificaciones: ['Certified Property Appraiser'],
    activo: true,
    destacado: false
  },
  {
    id: 6,    usuarioId: 4,    nombre: 'Diego',
    apellido: 'Torres',
    cargo: 'Agente Inmobiliario Junior',
    email: 'diego.torres@fairway.com.ar',
    telefono: '+54 9 11 5678-1234',
    whatsapp: '5491156781234',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    especialidad: 'Alquileres y Propiedades para Jóvenes Profesionales',
    slogan: 'Tu primer departamento, mi prioridad',
    biografia: 'Como agente joven, entiendo las necesidades de profesionales y estudiantes que buscan su primer departamento en alquiler. Mi energía y compromiso me impulsan a encontrar las mejores opciones en zonas estratégicas de la ciudad, con excelente conectividad y servicios.',
    experienciaAnios: 3,
    idiomas: ['Español'],
    instagram: 'https://instagram.com/diegotorres.propiedades',
    propiedadesVendidas: 18,
    propiedadesActivas: 11,
    clientesSatisfechos: 16,
    activo: true,
    destacado: false
  }
];

// Interfaces legacy para compatibilidad
export interface Asesor {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  whatsapp: string;
  fotoUrl: string;
  activo: boolean;
}

export const MOCK_ASESORES: Asesor[] = AGENTES_MOCK.map(a => ({
  id: a.id,
  nombre: `${a.nombre} ${a.apellido}`,
  email: a.email,
  telefono: a.telefono,
  whatsapp: a.whatsapp || a.telefono.replace(/\D/g, ''),
  fotoUrl: a.fotoUrl,
  activo: a.activo
}));

// Helper para obtener asesor por ID
export function getAsesorById(id: number): Asesor | undefined {
  return MOCK_ASESORES.find(a => a.id === id);
}

// Helper para obtener agente completo por ID
export function getAgenteById(id: number): Agente | undefined {
  return AGENTES_MOCK.find(a => a.id === id);
}
