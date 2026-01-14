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
      { url: 'assets/images/properties/casa-palermo-1.jpg', descripcion: 'Frente' },
      { url: 'assets/images/properties/casa-palermo-2.jpg', descripcion: 'Living' },
      { url: 'assets/images/properties/casa-palermo-3.jpg', descripcion: 'Jardin' }
    ],
    estado: 'disponible',
    destacada: true,
    asesorId: 1,
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
      { url: 'assets/images/properties/depto-belgrano-1.jpg', descripcion: 'Living' },
      { url: 'assets/images/properties/depto-belgrano-2.jpg', descripcion: 'Dormitorio' }
    ],
    estado: 'disponible',
    destacada: true,
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
      { url: 'assets/images/properties/ph-vcrespo-1.jpg', descripcion: 'Living' }
    ],
    estado: 'disponible',
    destacada: false,
    asesorId: 1,
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
      { url: 'assets/images/properties/oficina-micro-1.jpg', descripcion: 'Vista general' }
    ],
    estado: 'disponible',
    destacada: true,
    asesorId: 2,
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
      { url: 'assets/images/properties/terreno-norte-1.jpg', descripcion: 'Vista' }
    ],
    estado: 'disponible',
    destacada: false,
    asesorId: 1,
    fechaPublicacion: '2024-01-12',
    ultimaActualizacion: '2024-01-12'
  },
  {
    id: 6,
    titulo: 'Departamento 2 Ambientes a Estrenar en Nuniez',
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
      { url: 'assets/images/properties/depto-nunez-1.jpg', descripcion: 'Living' },
      { url: 'assets/images/properties/depto-nunez-2.jpg', descripcion: 'Dormitorio' }
    ],
    estado: 'disponible',
    destacada: true,
    asesorId: 2,
    fechaPublicacion: '2024-01-18',
    ultimaActualizacion: '2024-01-22'
  }
];
