import { Propiedad } from '../../models/property.interface';

export const MOCK_PROPIEDADES: Propiedad[] = [
  {
    id: 1,
    titulo: 'Casa 4 Ambientes con Jardin en Palermo',
    descripcion: `Hermosa casa de 4 ambientes ubicada en el corazon de Palermo Hollywood.
    Cuenta con living-comedor amplio con salida al jardin, cocina totalmente equipada,
    3 dormitorios (uno en suite), 2 banos completos. El jardin de 50m2 es ideal para
    disfrutar al aire libre. Cochera para 2 autos. Excelente estado de conservacion.`,
    tipoPropiedad: 'casa',
    operacion: 'venta',
    precio: 320000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Humboldt 1850',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.5875, lng: -58.4311 }
    },
    caracteristicas: {
      ambientes: 4,
      dormitorios: 3,
      banos: 2,
      superficie_cubierta: 180,
      superficie_total: 250,
      antiguedad: 15,
      garage: 2,
      amenidades: ['jardin', 'parrilla', 'cochera', 'lavadero']
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', descripcion: 'Frente' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', descripcion: 'Living' },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', descripcion: 'Jardin' }
    ],
    estado: 'disponible',
    destacada: true,
    visible: true,
    asesorId: 2,
    fechaPublicacion: '2024-01-15',
    ultimaActualizacion: '2024-01-20'
  },
  {
    id: 2,
    titulo: 'Departamento 3 Ambientes con Balcon en Belgrano',
    descripcion: `Luminoso departamento de 3 ambientes en Belgrano R, a pasos de Av. Cabildo.
    Living-comedor con balcon corrido, cocina separada, 2 dormitorios, bano completo.
    Edificio con amenities: pileta, gym, SUM. Excelente ubicacion cerca de transporte.`,
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 185000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Cabildo 2100',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.5614, lng: -58.4567 }
    },
    caracteristicas: {
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      superficie_cubierta: 75,
      superficie_total: 82,
      antiguedad: 8,
      garage: 0,
      amenidades: ['balcon', 'pileta', 'gym', 'sum', 'seguridad-24hs']
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', descripcion: 'Living' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', descripcion: 'Dormitorio' }
    ],
    estado: 'disponible',
    destacada: true,
    visible: true,
    asesorId: 2,
    fechaPublicacion: '2024-01-10',
    ultimaActualizacion: '2024-01-18'
  },
  {
    id: 3,
    titulo: 'PH 2 Ambientes Reciclado en Villa Crespo',
    descripcion: `PH reciclado a nuevo en el corazon de Villa Crespo. Ambiente integrado
    con cocina americana, dormitorio con placard, bano completo. Patio propio de 15m2.
    Ideal para jovenes profesionales o pareja. Sin expensas.`,
    tipoPropiedad: 'ph',
    operacion: 'alquiler',
    precio: 350000,
    moneda: 'ARS',
    ubicacion: {
      direccion: 'Thames 500',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.5989, lng: -58.4389 }
    },
    caracteristicas: {
      ambientes: 2,
      dormitorios: 1,
      banos: 1,
      superficie_cubierta: 42,
      superficie_total: 57,
      antiguedad: 0,
      garage: 0,
      amenidades: ['patio', 'parrilla']
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop', descripcion: 'Living' }
    ],
    estado: 'disponible',
    destacada: true,
    visible: true,
    asesorId: 2,
    fechaPublicacion: '2024-01-20',
    ultimaActualizacion: '2024-01-20'
  },
  {
    id: 4,
    titulo: 'Oficina Premium en Microcentro',
    descripcion: `Oficina de categoria en edificio AAA del microcentro porteno.
    Planta libre de 120m2, 2 banos, office, sala de reuniones. Vista panoramica.
    Ideal para estudios juridicos o empresas financieras.`,
    tipoPropiedad: 'oficina',
    operacion: 'alquiler',
    precio: 2500,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Av. Corrientes 300',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.6037, lng: -58.3816 }
    },
    caracteristicas: {
      ambientes: 1,
      dormitorios: 0,
      banos: 2,
      superficie_cubierta: 120,
      superficie_total: 120,
      antiguedad: 5,
      garage: 2,
      amenidades: ['aire-acondicionado', 'seguridad-24hs', 'recepcion']
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', descripcion: 'Vista general' }
    ],
    estado: 'disponible',
    destacada: true,
    visible: true,
    asesorId: 3,
    fechaPublicacion: '2024-01-05',
    ultimaActualizacion: '2024-01-15'
  },
  {
    id: 5,
    titulo: 'Terreno 800m2 en Zona Norte - Ideal Emprendimiento',
    descripcion: `Terreno de 800m2 en excelente ubicacion de Zona Norte.
    Ideal para desarrollo inmobiliario o construccion de vivienda unifamiliar.
    Todos los servicios. Frente de 20m.`,
    tipoPropiedad: 'terreno',
    operacion: 'venta',
    precio: 150000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Av. del Libertador 15000',
      ciudad: 'San Isidro',
      provincia: 'Buenos Aires',
      pais: 'Argentina',
      coordenadas: { lat: -34.4921, lng: -58.5091 }
    },
    caracteristicas: {
      ambientes: 0,
      dormitorios: 0,
      banos: 0,
      superficie_cubierta: 0,
      superficie_total: 800,
      antiguedad: 0,
      garage: 0,
      amenidades: []
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop', descripcion: 'Vista' }
    ],
    estado: 'disponible',
    destacada: true,
    visible: true,
    asesorId: 3,
    fechaPublicacion: '2024-01-12',
    ultimaActualizacion: '2024-01-19'
  },
  {
    id: 6,
    titulo: 'Departamento 2 Ambientes a Estrenar en Nuñez',
    descripcion: `Departamento a estrenar en edificio de categoria. Living con balcon,
    dormitorio en suite, cocina integrada con mesada de granito.
    Amenities completos: pileta, solarium, gym, laundry.`,
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 125000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Av. Cabildo 4500',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.5456, lng: -58.4634 }
    },
    caracteristicas: {
      ambientes: 2,
      dormitorios: 1,
      banos: 1,
      superficie_cubierta: 52,
      superficie_total: 58,
      antiguedad: 0,
      garage: 1,
      amenidades: ['balcon', 'pileta', 'gym', 'solarium', 'laundry', 'seguridad-24hs']
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop', descripcion: 'Living' },
      { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop', descripcion: 'Dormitorio' }
    ],
    estado: 'disponible',
    destacada: true,
    visible: true,
    asesorId: 3,
    fechaPublicacion: '2024-01-18',
    ultimaActualizacion: '2024-01-22'
  },
  // Propiedades adicionales en Palermo para clustering
  {
    id: 7,
    titulo: 'Loft Moderno en Palermo Soho',
    descripcion: 'Loft de diseño con doble altura, ideal para jóvenes profesionales.',
    tipoPropiedad: 'departamento',
    operacion: 'alquiler',
    precio: 450000,
    moneda: 'ARS',
    ubicacion: {
      direccion: 'Honduras 4800',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.5862, lng: -58.4298 }
    },
    caracteristicas: {
      ambientes: 1,
      dormitorios: 1,
      banos: 1,
      superficie_cubierta: 45,
      superficie_total: 45,
      antiguedad: 5,
      garage: 0,
      amenidades: ['terraza']
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', descripcion: 'Interior' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 3,
    fechaPublicacion: '2024-01-22',
    ultimaActualizacion: '2024-01-22'
  },
  {
    id: 8,
    titulo: 'Departamento con Terraza en Palermo Hollywood',
    descripcion: 'Hermoso 3 ambientes con terraza propia de 30m2.',
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 195000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Fitz Roy 1900',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.5855, lng: -58.4335 }
    },
    caracteristicas: {
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      superficie_cubierta: 70,
      superficie_total: 100,
      antiguedad: 10,
      garage: 0,
      amenidades: ['terraza', 'parrilla']
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', descripcion: 'Terraza' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 3,
    fechaPublicacion: '2024-01-21',
    ultimaActualizacion: '2024-01-21'
  },
  {
    id: 9,
    titulo: 'Monoambiente Luminoso en Palermo',
    descripcion: 'Monoambiente divisible con excelente luz natural.',
    tipoPropiedad: 'departamento',
    operacion: 'alquiler',
    precio: 280000,
    moneda: 'ARS',
    ubicacion: {
      direccion: 'Gorriti 5500',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.5870, lng: -58.4325 }
    },
    caracteristicas: {
      ambientes: 1,
      dormitorios: 0,
      banos: 1,
      superficie_cubierta: 32,
      superficie_total: 32,
      antiguedad: 3,
      garage: 0,
      amenidades: []
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop', descripcion: 'Interior' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 4,
    fechaPublicacion: '2024-01-20',
    ultimaActualizacion: '2024-01-20'
  },
  {
    id: 10,
    titulo: 'PH de 3 Ambientes en Palermo Viejo',
    descripcion: 'PH reciclado con patio y parrilla propia.',
    tipoPropiedad: 'ph',
    operacion: 'venta',
    precio: 245000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Armenia 1700',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.5880, lng: -58.4290 }
    },
    caracteristicas: {
      ambientes: 3,
      dormitorios: 2,
      banos: 2,
      superficie_cubierta: 90,
      superficie_total: 120,
      antiguedad: 0,
      garage: 0,
      amenidades: ['patio', 'parrilla', 'lavadero']
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', descripcion: 'Patio' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 3,
    fechaPublicacion: '2024-01-19',
    ultimaActualizacion: '2024-01-19'
  },
  {
    id: 11,
    titulo: 'Duplex con Pileta en Palermo Chico',
    descripcion: 'Espectacular duplex en edificio con amenities premium.',
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 520000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Av. del Libertador 2800',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.5765, lng: -58.4095 }
    },
    caracteristicas: {
      ambientes: 5,
      dormitorios: 3,
      banos: 3,
      superficie_cubierta: 180,
      superficie_total: 200,
      antiguedad: 2,
      garage: 2,
      amenidades: ['pileta', 'gym', 'spa', 'seguridad-24hs']
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop', descripcion: 'Vista' }
    ],
    estado: 'disponible',
    destacada: true,
    visible: true,
    asesorId: 2,
    fechaPublicacion: '2024-01-18',
    ultimaActualizacion: '2024-01-18'
  },
  // Propiedades en Recoleta para otro cluster
  {
    id: 12,
    titulo: 'Departamento Clásico en Recoleta',
    descripcion: 'Elegante 4 ambientes en edificio francés.',
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 380000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Av. Alvear 1500',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.5875, lng: -58.3935 }
    },
    caracteristicas: {
      ambientes: 4,
      dormitorios: 3,
      banos: 2,
      superficie_cubierta: 150,
      superficie_total: 150,
      antiguedad: 80,
      garage: 1,
      amenidades: ['balcon']
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop', descripcion: 'Living' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 4,
    fechaPublicacion: '2024-01-17',
    ultimaActualizacion: '2024-01-17'
  },
  {
    id: 13,
    titulo: 'Penthouse con Vista al Parque',
    descripcion: 'Increíble penthouse frente a Plaza Francia.',
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 750000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Posadas 1300',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.5890, lng: -58.3920 }
    },
    caracteristicas: {
      ambientes: 6,
      dormitorios: 4,
      banos: 4,
      superficie_cubierta: 300,
      superficie_total: 350,
      antiguedad: 15,
      garage: 3,
      amenidades: ['terraza', 'pileta-privada', 'seguridad-24hs']
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop', descripcion: 'Terraza' }
    ],
    estado: 'disponible',
    destacada: true,
    visible: true,
    asesorId: 3,
    fechaPublicacion: '2024-01-16',
    ultimaActualizacion: '2024-01-16'
  },
  {
    id: 14,
    titulo: '2 Ambientes Moderno en Recoleta',
    descripcion: 'Departamento a estrenar con amenities.',
    tipoPropiedad: 'departamento',
    operacion: 'alquiler',
    precio: 550000,
    moneda: 'ARS',
    ubicacion: {
      direccion: 'Junín 1200',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.5905, lng: -58.3945 }
    },
    caracteristicas: {
      ambientes: 2,
      dormitorios: 1,
      banos: 1,
      superficie_cubierta: 48,
      superficie_total: 52,
      antiguedad: 0,
      garage: 0,
      amenidades: ['gym', 'laundry']
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop', descripcion: 'Living' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 2,
    fechaPublicacion: '2024-01-15',
    ultimaActualizacion: '2024-01-15'
  },
  {
    id: 15,
    titulo: 'Semipiso en Av. Quintana',
    descripcion: 'Lujoso semipiso con vista panorámica.',
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 620000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Av. Quintana 500',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.5868, lng: -58.3905 }
    },
    caracteristicas: {
      ambientes: 5,
      dormitorios: 3,
      banos: 3,
      superficie_cubierta: 200,
      superficie_total: 220,
      antiguedad: 25,
      garage: 2,
      amenidades: ['balcon', 'dependencia']
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop', descripcion: 'Living' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 2,
    fechaPublicacion: '2024-01-14',
    ultimaActualizacion: '2024-01-14'
  },
  // Más propiedades en Microcentro para otro cluster
  {
    id: 16,
    titulo: 'Oficina en Edificio Inteligente',
    descripcion: 'Oficina equipada en edificio corporativo.',
    tipoPropiedad: 'oficina',
    operacion: 'alquiler',
    precio: 1800,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Reconquista 200',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.6025, lng: -58.3750 }
    },
    caracteristicas: {
      ambientes: 1,
      dormitorios: 0,
      banos: 1,
      superficie_cubierta: 80,
      superficie_total: 80,
      antiguedad: 3,
      garage: 0,
      amenidades: ['aire-acondicionado', 'seguridad-24hs']
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', descripcion: 'Oficina' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 2,
    fechaPublicacion: '2024-01-13',
    ultimaActualizacion: '2024-01-13'
  },
  {
    id: 17,
    titulo: 'Local Comercial en Florida',
    descripcion: 'Excelente local sobre peatonal Florida.',
    tipoPropiedad: 'local',
    operacion: 'alquiler',
    precio: 5000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Florida 400',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.6040, lng: -58.3780 }
    },
    caracteristicas: {
      ambientes: 1,
      dormitorios: 0,
      banos: 1,
      superficie_cubierta: 120,
      superficie_total: 120,
      antiguedad: 50,
      garage: 0,
      amenidades: []
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop', descripcion: 'Local' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 3,
    fechaPublicacion: '2024-01-12',
    ultimaActualizacion: '2024-01-12'
  },
  {
    id: 18,
    titulo: 'Departamento 1 Ambiente en Microcentro',
    descripcion: 'Ideal inversión, alquilado con renta.',
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 55000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Sarmiento 600',
      ciudad: 'Buenos Aires',
      provincia: 'CABA',
      pais: 'Argentina',
      coordenadas: { lat: -34.6050, lng: -58.3795 }
    },
    caracteristicas: {
      ambientes: 1,
      dormitorios: 0,
      banos: 1,
      superficie_cubierta: 28,
      superficie_total: 28,
      antiguedad: 40,
      garage: 0,
      amenidades: []
    },
    imagenes: [
      { url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=600&fit=crop', descripcion: 'Interior' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 4,
    fechaPublicacion: '2024-01-11',
    ultimaActualizacion: '2024-01-11'
  }
];
