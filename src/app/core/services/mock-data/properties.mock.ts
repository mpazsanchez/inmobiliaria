import { Propiedad } from '../../models/property.interface';

export const MOCK_PROPIEDADES: Propiedad[] = [
  {
    id: 1,
    titulo: 'Casa 4 Ambientes con Jardin en Palermo',
    descripcion: `Hermosa casa de 4 ambientes ubicada en el corazon de Palermo Hollywood.
    Cuenta con living-comedor amplio con salida al jardin, cocina totalmente equipada,
    3 dormitorios (uno en suite), 2 banos completos. El jardin de 50m2 es ideal para
    disfrutar al aire libre. Cochera para 2 autos. Excelente estado de conservacion.
    Cercana a restaurantes, bares y transporte publico. Ideal para familias.`,
    tipoPropiedad: 'casa',
    operacion: 'venta',
    precio: 320000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Humboldt 1850',
      barrio: 'Palermo Hollywood',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420307/fairway/properties/ybr2lwdyezmae8o2pqpg.jpg', descripcion: 'Frente' },
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420309/fairway/properties/b6nx9y4hvwizdbwyuzjc.jpg', descripcion: 'Living' },
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420311/fairway/properties/hahhacelgrjutvxyljua.jpg', descripcion: 'Jardin' }
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
    Edificio con amenities: pileta, gym, SUM. Excelente ubicacion cerca de transporte,
    colegios y comercios. Piso alto con vista despejada. Ideal para familias o parejas.`,
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 185000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Cabildo 2100',
      barrio: 'Belgrano R',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420312/fairway/properties/igxtaeapoitbcam6ukoy.jpg', descripcion: 'Living' },
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420314/fairway/properties/kidonzo2x5ekkbnf9wxp.jpg', descripcion: 'Dormitorio' }
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
    con cocina americana, dormitorio con placard, bano completo. Patio propio de 15m2
    con parrilla. Ideal para jovenes profesionales o pareja. Sin expensas.
    A cuadras de Av. Corrientes y Scalabrini Ortiz, excelente conectividad.`,
    tipoPropiedad: 'ph',
    operacion: 'alquiler',
    precio: 350000,
    moneda: 'ARS',
    ubicacion: {
      direccion: 'Thames 500',
      barrio: 'Villa Crespo',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420315/fairway/properties/ezdw1ybxvltph9krj1wj.jpg', descripcion: 'Living' }
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
    Planta libre de 120m2, 2 banos, office, sala de reuniones. Vista panoramica
    al rio desde piso 15. Ideal para estudios juridicos o empresas financieras.
    Edificio con seguridad 24hs, recepcion con conserjeria y aire acondicionado central.
    Cocheras opcionales disponibles en el mismo edificio.`,
    tipoPropiedad: 'oficina',
    operacion: 'alquiler',
    precio: 2500,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Av. Corrientes 300',
      barrio: 'Microcentro',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420317/fairway/properties/emkqn5wxu8rettuqmqg7.jpg', descripcion: 'Vista general' }
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
    descripcion: `Terreno de 800m2 en excelente ubicacion de Zona Norte, San Isidro.
    Ideal para desarrollo inmobiliario o construccion de vivienda unifamiliar.
    Todos los servicios disponibles: agua, gas, cloacas y electricidad.
    Frente de 20m sobre avenida principal. Zonificacion residencial mixta.
    A 5 minutos de la estacion de tren y accesos rapidos a Panamericana.`,
    tipoPropiedad: 'terreno',
    operacion: 'venta',
    precio: 150000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Av. del Libertador 15000',
      barrio: 'La Horqueta',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420319/fairway/properties/vakptdjytbfcjsd3a2qo.jpg', descripcion: 'Vista' }
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
    titulo: 'Departamento 2 Ambientes a Estrenar en Nunez',
    descripcion: `Departamento a estrenar en edificio de categoria en Nunez. Living con balcon
    al frente, dormitorio en suite con placard vestidor, cocina integrada con mesada de granito
    y electrodomesticos incluidos. Amenities completos: pileta descubierta, solarium, gimnasio
    equipado, laundry y SUM. Piso 8 con vista panoramica. Seguridad 24hs con camaras.`,
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 125000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Av. Cabildo 4500',
      barrio: 'Nunez',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420320/fairway/properties/ydpom30s2vfwb3bipdpk.jpg', descripcion: 'Living' },
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420322/fairway/properties/zqvwyrcunakc9bhojwle.jpg', descripcion: 'Dormitorio' }
    ],
    estado: 'disponible',
    destacada: true,
    visible: true,
    asesorId: 3,
    fechaPublicacion: '2024-01-18',
    ultimaActualizacion: '2024-01-22'
  },
  {
    id: 7,
    titulo: 'Loft Moderno en Palermo Soho',
    descripcion: `Loft de diseno con doble altura y grandes ventanales, ideal para jovenes
    profesionales o pareja. Ambiente unico de 45m2 con entrepiso para dormitorio,
    cocina integrada con barra desayunadora, bano completo con ducha de lluvia.
    Terraza privada en planta alta. Ubicado en la zona mas trendy de Palermo Soho,
    rodeado de tiendas de diseno, galerias de arte y gastronomia de autor.`,
    tipoPropiedad: 'departamento',
    operacion: 'alquiler',
    precio: 450000,
    moneda: 'ARS',
    ubicacion: {
      direccion: 'Honduras 4800',
      barrio: 'Palermo Soho',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420312/fairway/properties/igxtaeapoitbcam6ukoy.jpg', descripcion: 'Interior' }
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
    descripcion: `Hermoso 3 ambientes con terraza propia de 30m2 en Palermo Hollywood.
    Living-comedor con salida directa a la terraza con parrilla, cocina separada completa,
    2 dormitorios amplios con placard, bano principal y toilette. Edificio de solo 6 pisos,
    muy luminoso. A metros de estudios de TV, productoras y la mejor gastronomia de la zona.
    Ideal para quienes buscan espacio al aire libre en plena ciudad.`,
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 195000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Fitz Roy 1900',
      barrio: 'Palermo Hollywood',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420309/fairway/properties/b6nx9y4hvwizdbwyuzjc.jpg', descripcion: 'Terraza' }
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
    descripcion: `Monoambiente divisible con excelente luz natural en Palermo Viejo.
    Ambiente principal de 32m2 con posibilidad de separar dormitorio, cocina americana
    con muebles de diseno, bano completo con vanitory. Piso 6 contrafrente, muy silencioso.
    Expensas bajas. A 3 cuadras de Plaza Serrano y transporte publico.
    Perfecto para estudiantes, profesionales independientes o como inversion para renta.`,
    tipoPropiedad: 'departamento',
    operacion: 'alquiler',
    precio: 280000,
    moneda: 'ARS',
    ubicacion: {
      direccion: 'Gorriti 5500',
      barrio: 'Palermo Viejo',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420315/fairway/properties/ezdw1ybxvltph9krj1wj.jpg', descripcion: 'Interior' }
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
    descripcion: `PH reciclado a nuevo con patio y parrilla propia en Palermo Viejo.
    Planta baja: living-comedor amplio, cocina equipada y lavadero. Planta alta:
    2 dormitorios con placard y bano completo. Patio trasero de 25m2 con parrilla
    y deck de madera. Sin expensas. Calle arbolada y tranquila.
    A pocas cuadras de Plaza Armenia y los mejores locales de Palermo.`,
    tipoPropiedad: 'ph',
    operacion: 'venta',
    precio: 245000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Armenia 1700',
      barrio: 'Palermo Viejo',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420311/fairway/properties/hahhacelgrjutvxyljua.jpg', descripcion: 'Patio' }
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
    descripcion: `Espectacular duplex de 5 ambientes en edificio premium de Palermo Chico.
    Planta inferior: living-comedor con doble altura, cocina con isla central, dormitorio
    de servicio con bano. Planta superior: suite principal con vestidor y jacuzzi, 2 dormitorios
    con bano compartido. Amenities de primer nivel: pileta climatizada, spa con sauna,
    gimnasio equipado y seguridad 24 horas. Cochera doble cubierta incluida.
    Una de las zonas mas exclusivas de Buenos Aires, lindero al Jardin Japones.`,
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 520000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Av. del Libertador 2800',
      barrio: 'Palermo Chico',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420307/fairway/properties/ybr2lwdyezmae8o2pqpg.jpg', descripcion: 'Vista' }
    ],
    estado: 'disponible',
    destacada: true,
    visible: true,
    asesorId: 2,
    fechaPublicacion: '2024-01-18',
    ultimaActualizacion: '2024-01-18'
  },
  {
    id: 12,
    titulo: 'Departamento Clasico en Recoleta',
    descripcion: `Elegante departamento de 4 ambientes en edificio frances de Recoleta.
    Living-comedor de 40m2 con pisos de roble originales y molduras en techos,
    3 dormitorios amplios, 2 banos completos con artefactos de primera calidad.
    Cocina independiente con lavadero. Balcon frances al frente con vista a Av. Alvear.
    Edificio con porteria permanente y ascensor restaurado. A pasos del Museo de Bellas
    Artes, la Biblioteca Nacional y los mejores restaurantes de la zona.`,
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 380000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Av. Alvear 1500',
      barrio: 'Recoleta',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420314/fairway/properties/kidonzo2x5ekkbnf9wxp.jpg', descripcion: 'Living' }
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
    descripcion: `Increible penthouse frente a Plaza Francia en Recoleta, una oportunidad unica.
    6 ambientes distribuidos en 300m2 cubiertos: gran living con chimenea, comedor formal,
    suite principal con vestidor y bano de marmol, 3 dormitorios adicionales, escritorio,
    dependencia de servicio completa. Terraza perimetral de 50m2 con pileta privada
    y vista panoramica a los Bosques de Palermo. 3 cocheras cubiertas.
    Seguridad 24 horas con circuito cerrado. El mejor penthouse de la zona.`,
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 750000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Posadas 1300',
      barrio: 'Recoleta',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420309/fairway/properties/b6nx9y4hvwizdbwyuzjc.jpg', descripcion: 'Terraza' }
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
    descripcion: `Departamento a estrenar de 2 ambientes en Recoleta, edificio con amenities.
    Living-comedor con balcon al contrafrente, dormitorio con placard empotrado,
    bano completo con mampara y griferia de primera. Cocina integrada con mesada de cuarzo.
    Edificio nuevo con gimnasio equipado, laundry compartido y cochera opcional.
    Ubicacion estrategica sobre calle Junin, a metros de la Facultad de Medicina
    y del shopping Patio Bullrich. Ideal para profesionales o inversion.`,
    tipoPropiedad: 'departamento',
    operacion: 'alquiler',
    precio: 550000,
    moneda: 'ARS',
    ubicacion: {
      direccion: 'Junin 1200',
      barrio: 'Recoleta',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420312/fairway/properties/igxtaeapoitbcam6ukoy.jpg', descripcion: 'Living' }
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
    descripcion: `Lujoso semipiso de 5 ambientes con vista panoramica en Av. Quintana, Recoleta.
    200m2 cubiertos con distribucion clasica: recepcion, living con hogar, comedor independiente,
    3 dormitorios (suite principal con vestidor), escritorio, dependencia de servicio.
    2 banos completos y toilette. Balcon corrido con vista a la Embajada de Francia.
    Pisos de roble, molduras originales, carpinteria de cedro. Cochera doble.
    Edificio con porteria las 24 horas y mantenimiento impecable.`,
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 620000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Av. Quintana 500',
      barrio: 'Recoleta',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420311/fairway/properties/hahhacelgrjutvxyljua.jpg', descripcion: 'Living' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 2,
    fechaPublicacion: '2024-01-14',
    ultimaActualizacion: '2024-01-14'
  },
  {
    id: 16,
    titulo: 'Oficina en Edificio Inteligente',
    descripcion: `Oficina equipada de 80m2 en edificio corporativo inteligente de Microcentro.
    Planta libre con piso tecnico, cableado estructurado y fibra optica incluida.
    Sistema de climatizacion central individual por piso. Bano privado.
    Edificio clase A con certificacion LEED, seguridad 24 horas con control biometrico,
    recepcion con conserjeria y sala de reuniones compartida.
    Ubicacion premium sobre Reconquista, a metros de la Bolsa de Comercio y tribunales.`,
    tipoPropiedad: 'oficina',
    operacion: 'alquiler',
    precio: 1800,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Reconquista 200',
      barrio: 'Microcentro',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420317/fairway/properties/emkqn5wxu8rettuqmqg7.jpg', descripcion: 'Oficina' }
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
    descripcion: `Excelente local comercial de 120m2 sobre la peatonal Florida, en pleno
    centro comercial de Buenos Aires. Planta baja con gran vidriera al frente de 8 metros
    lineales, ideal para retail, gastronomia o showroom. Entrepiso de 40m2 utilizable
    como deposito u oficina. Bano completo. Instalacion electrica trifasica.
    Zona de altisimo transito peatonal, a metros de Galerias Pacifico.
    Contrato directo con propietario.`,
    tipoPropiedad: 'local',
    operacion: 'alquiler',
    precio: 5000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Florida 400',
      barrio: 'Microcentro',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420323/fairway/properties/uwkj6alfmgwqb6v9kcpb.jpg', descripcion: 'Local' }
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
    descripcion: `Departamento de 1 ambiente de 28m2 en Microcentro, ideal como inversion.
    Actualmente alquilado con renta mensual asegurada. Ambiente unico con kitchenette
    y bano completo. Edificio con encargado y ascensor. Ubicado sobre calle Sarmiento,
    a metros de Av. 9 de Julio y estacion de subte. Zona con alta demanda de alquiler
    por cercanias a oficinas, universidades y transporte. Excelente relacion precio/renta.`,
    tipoPropiedad: 'departamento',
    operacion: 'venta',
    precio: 55000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Sarmiento 600',
      barrio: 'Microcentro',
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
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420315/fairway/properties/ezdw1ybxvltph9krj1wj.jpg', descripcion: 'Interior' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 4,
    fechaPublicacion: '2024-01-11',
    ultimaActualizacion: '2024-01-11'
  },
  // =============================================
  // PROPIEDADES EN TANDIL
  // =============================================
  {
    id: 19,
    titulo: 'Casa con Vista a las Sierras en Villa del Lago',
    descripcion: `Espectacular casa de 5 ambientes con vista panoramica a las sierras de Tandil.
    Ubicada en el exclusivo barrio Villa del Lago, a metros del Lago del Fuerte.
    Living-comedor con hogar a lena y ventanales de piso a techo, cocina equipada con isla,
    suite principal con vestidor y bano con hidromasaje, 3 dormitorios adicionales,
    2 banos completos. Gran parque de 800m2 con pileta, quincho con parrilla y horno de barro.
    Cochera doble. Calefaccion central por losa radiante. Alarma perimetral.
    Una propiedad unica en la zona mas codiciada de Tandil.`,
    tipoPropiedad: 'casa',
    operacion: 'venta',
    precio: 280000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Av. Don Bosco 1200',
      barrio: 'Villa del Lago',
      ciudad: 'Tandil',
      provincia: 'Buenos Aires',
      pais: 'Argentina',
      coordenadas: { lat: -37.3350, lng: -59.1180 }
    },
    caracteristicas: {
      ambientes: 5,
      dormitorios: 4,
      banos: 3,
      superficie_cubierta: 220,
      superficie_total: 1000,
      antiguedad: 8,
      garage: 2,
      amenidades: ['pileta', 'parrilla', 'jardin', 'calefaccion', 'alarma']
    },
    imagenes: [
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420307/fairway/properties/ybr2lwdyezmae8o2pqpg.jpg', descripcion: 'Frente de la casa' },
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420311/fairway/properties/hahhacelgrjutvxyljua.jpg', descripcion: 'Parque y pileta' },
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420309/fairway/properties/b6nx9y4hvwizdbwyuzjc.jpg', descripcion: 'Living con vista a las sierras' }
    ],
    estado: 'disponible',
    destacada: true,
    visible: true,
    asesorId: 2,
    fechaPublicacion: '2024-02-01',
    ultimaActualizacion: '2024-02-10'
  },
  {
    id: 20,
    titulo: 'Departamento 2 Ambientes en el Centro de Tandil',
    descripcion: `Moderno departamento de 2 ambientes en pleno centro de Tandil, sobre calle 9 de Julio.
    Living-comedor luminoso con balcon al frente, dormitorio amplio con placard,
    bano completo y cocina separada con lavadero. Edificio de 4 pisos con ascensor.
    A una cuadra de la Plaza Independencia y a pasos de bancos, comercios y restaurantes.
    Ideal para profesionales, pareja o como inversion con renta turistica.
    Expensas bajas. Disponible inmediato.`,
    tipoPropiedad: 'departamento',
    operacion: 'alquiler',
    precio: 320000,
    moneda: 'ARS',
    ubicacion: {
      direccion: '9 de Julio 750',
      barrio: 'Centro',
      ciudad: 'Tandil',
      provincia: 'Buenos Aires',
      pais: 'Argentina',
      coordenadas: { lat: -37.3217, lng: -59.1332 }
    },
    caracteristicas: {
      ambientes: 2,
      dormitorios: 1,
      banos: 1,
      superficie_cubierta: 55,
      superficie_total: 60,
      antiguedad: 5,
      garage: 0,
      amenidades: ['balcon']
    },
    imagenes: [
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420312/fairway/properties/igxtaeapoitbcam6ukoy.jpg', descripcion: 'Living comedor' },
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420314/fairway/properties/kidonzo2x5ekkbnf9wxp.jpg', descripcion: 'Dormitorio' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 4,
    fechaPublicacion: '2024-02-05',
    ultimaActualizacion: '2024-02-05'
  },
  {
    id: 21,
    titulo: 'Cabana Turistica cerca del Cerro Centinela',
    descripcion: `Encantadora cabana de 3 ambientes ideal para renta turistica o vivienda permanente.
    Construccion en piedra y madera tipica serrana, integrada al entorno natural.
    Living con hogar a lena y vista al cerro, cocina comedor equipada, 2 dormitorios,
    bano completo con banadera. Deck exterior con parrilla y vista a las sierras.
    Terreno de 600m2 arbolado con pinos y eucaliptos. A solo 5 minutos del Cerro Centinela
    y las principales atracciones turisticas. Alta demanda de alquiler temporario todo el ano.
    Incluye muebles y electrodomesticos.`,
    tipoPropiedad: 'casa',
    operacion: 'venta',
    precio: 120000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Camino al Centinela km 3',
      barrio: 'Cerro Centinela',
      ciudad: 'Tandil',
      provincia: 'Buenos Aires',
      pais: 'Argentina',
      coordenadas: { lat: -37.3500, lng: -59.0950 }
    },
    caracteristicas: {
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      superficie_cubierta: 75,
      superficie_total: 600,
      antiguedad: 12,
      garage: 1,
      amenidades: ['parrilla', 'jardin', 'calefaccion']
    },
    imagenes: [
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420320/fairway/properties/ydpom30s2vfwb3bipdpk.jpg', descripcion: 'Frente de la cabana' },
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420322/fairway/properties/zqvwyrcunakc9bhojwle.jpg', descripcion: 'Interior con hogar' }
    ],
    estado: 'disponible',
    destacada: true,
    visible: true,
    asesorId: 3,
    fechaPublicacion: '2024-02-08',
    ultimaActualizacion: '2024-02-12'
  },
  {
    id: 22,
    titulo: 'Terreno 1200m2 en Las Tunitas con Vista Serrana',
    descripcion: `Terreno de 1200m2 en el codiciado barrio Las Tunitas, zona de sierras de Tandil.
    Lote con pendiente suave ideal para construccion con vista panoramica a las sierras.
    Frente de 25 metros sobre calle consolidada. Todos los servicios: agua corriente,
    electricidad y gas natural. Escritura inmediata. Zonificacion residencial.
    Entorno natural rodeado de vegetacion autoctona, a 10 minutos del centro de Tandil.
    Oportunidad unica para construir la casa de tus suenos con las mejores vistas de la zona.`,
    tipoPropiedad: 'terreno',
    operacion: 'venta',
    precio: 45000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Calle Las Acacias s/n',
      barrio: 'Las Tunitas',
      ciudad: 'Tandil',
      provincia: 'Buenos Aires',
      pais: 'Argentina',
      coordenadas: { lat: -37.3450, lng: -59.1050 }
    },
    caracteristicas: {
      ambientes: 0,
      dormitorios: 0,
      banos: 0,
      superficie_cubierta: 0,
      superficie_total: 1200,
      antiguedad: 0,
      garage: 0,
      amenidades: []
    },
    imagenes: [
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420319/fairway/properties/vakptdjytbfcjsd3a2qo.jpg', descripcion: 'Vista del terreno' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 3,
    fechaPublicacion: '2024-02-03',
    ultimaActualizacion: '2024-02-03'
  },
  {
    id: 23,
    titulo: 'Casa 3 Ambientes en Barrio Golf',
    descripcion: `Linda casa de 3 ambientes en el tradicional Barrio Golf de Tandil.
    Living-comedor con salida al jardin, cocina comedor diaria, 2 dormitorios amplios,
    bano completo y toilette. Garage para un auto. Jardin al frente y patio trasero
    con parrilla y lavadero cubierto. Calefaccion por radiadores. Pisos de ceramica.
    Barrio tranquilo y familiar, a pocas cuadras del Tandil Golf Club y del
    Parque Independencia. Ideal para familia con chicos o pareja que busca tranquilidad.`,
    tipoPropiedad: 'casa',
    operacion: 'venta',
    precio: 95000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Constituyentes 850',
      barrio: 'Barrio Golf',
      ciudad: 'Tandil',
      provincia: 'Buenos Aires',
      pais: 'Argentina',
      coordenadas: { lat: -37.3150, lng: -59.1250 }
    },
    caracteristicas: {
      ambientes: 3,
      dormitorios: 2,
      banos: 1,
      superficie_cubierta: 95,
      superficie_total: 300,
      antiguedad: 25,
      garage: 1,
      amenidades: ['jardin', 'parrilla', 'lavadero', 'calefaccion']
    },
    imagenes: [
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420307/fairway/properties/ybr2lwdyezmae8o2pqpg.jpg', descripcion: 'Frente' },
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420315/fairway/properties/ezdw1ybxvltph9krj1wj.jpg', descripcion: 'Living' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 4,
    fechaPublicacion: '2024-02-06',
    ultimaActualizacion: '2024-02-06'
  },
  {
    id: 24,
    titulo: 'Local Comercial sobre Av. Espana',
    descripcion: `Local comercial de 90m2 sobre Av. Espana, una de las arterias comerciales
    mas importantes de Tandil. Gran vidriera al frente de 6 metros lineales,
    salon principal diafano, deposito trasero de 20m2 y bano. Instalacion electrica
    trifasica, habilitacion comercial al dia. Zona de alto transito vehicular y peatonal,
    rodeado de comercios consolidados. Ideal para gastronomia, indumentaria o servicios.
    Contrato de 3 anos con opcion a renovacion.`,
    tipoPropiedad: 'local',
    operacion: 'alquiler',
    precio: 450000,
    moneda: 'ARS',
    ubicacion: {
      direccion: 'Av. Espana 600',
      barrio: 'Centro',
      ciudad: 'Tandil',
      provincia: 'Buenos Aires',
      pais: 'Argentina',
      coordenadas: { lat: -37.3230, lng: -59.1370 }
    },
    caracteristicas: {
      ambientes: 1,
      dormitorios: 0,
      banos: 1,
      superficie_cubierta: 90,
      superficie_total: 90,
      antiguedad: 30,
      garage: 0,
      amenidades: []
    },
    imagenes: [
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420323/fairway/properties/uwkj6alfmgwqb6v9kcpb.jpg', descripcion: 'Frente del local' },
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420317/fairway/properties/emkqn5wxu8rettuqmqg7.jpg', descripcion: 'Interior' }
    ],
    estado: 'disponible',
    destacada: false,
    visible: true,
    asesorId: 3,
    fechaPublicacion: '2024-02-04',
    ultimaActualizacion: '2024-02-04'
  },
  {
    id: 25,
    titulo: 'Chalet en Barrio Universitario',
    descripcion: `Amplio chalet de 4 ambientes en el Barrio Universitario de Tandil,
    a pocas cuadras del campus de la UNICEN. Living-comedor con hogar a lena,
    cocina comedor diaria equipada, 3 dormitorios (uno en suite), 2 banos completos.
    Garage cubierto para 2 autos. Patio con parrilla, pileta de fibra y jardin parquizado.
    Calefaccion central. Aberturas de aluminio con DVH. Muy buen estado de conservacion.
    Zona residencial tranquila con excelente acceso al centro y a las sierras.`,
    tipoPropiedad: 'casa',
    operacion: 'venta',
    precio: 155000,
    moneda: 'USD',
    ubicacion: {
      direccion: 'Av. Lanusse 300',
      barrio: 'Barrio Universitario',
      ciudad: 'Tandil',
      provincia: 'Buenos Aires',
      pais: 'Argentina',
      coordenadas: { lat: -37.3100, lng: -59.1200 }
    },
    caracteristicas: {
      ambientes: 4,
      dormitorios: 3,
      banos: 2,
      superficie_cubierta: 140,
      superficie_total: 450,
      antiguedad: 18,
      garage: 2,
      amenidades: ['pileta', 'parrilla', 'jardin', 'calefaccion', 'cochera']
    },
    imagenes: [
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420309/fairway/properties/b6nx9y4hvwizdbwyuzjc.jpg', descripcion: 'Living con hogar' },
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420311/fairway/properties/hahhacelgrjutvxyljua.jpg', descripcion: 'Patio y pileta' },
      { url: 'https://res.cloudinary.com/dvbhqr8nu/image/upload/v1770420314/fairway/properties/kidonzo2x5ekkbnf9wxp.jpg', descripcion: 'Dormitorio principal' }
    ],
    estado: 'disponible',
    destacada: true,
    visible: true,
    asesorId: 2,
    fechaPublicacion: '2024-02-07',
    ultimaActualizacion: '2024-02-11'
  }
];
