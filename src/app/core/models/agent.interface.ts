// =============================================
// INTERFACE DE AGENTE INMOBILIARIO
// =============================================

export interface Agente {
  id: number;
  nombre: string;
  apellido: string;
  cargo: string; // "Agente Asociado", "Broker", "Especialista en Propiedades Comerciales", etc.
  email: string;
  telefono: string;
  fotoUrl: string;
  
  // Información profesional
  especialidad?: string; // "Propiedades de lujo", "Primera vivienda", "Inversiones", etc.
  slogan?: string; // Frase breve para el listado
  biografia?: string; // Biografía completa para el perfil
  experienciaAnios?: number;
  
  // Idiomas
  idiomas?: string[]; // ["Español", "Inglés", "Portugués"]
  
  // Redes sociales y contacto adicional
  whatsapp?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  
  // Estadísticas
  propiedadesVendidas?: number;
  propiedadesActivas?: number;
  clientesSatisfechos?: number;
  
  // Certificaciones y logros
  certificaciones?: string[];
  premios?: string[];
  
  // Estado
  activo: boolean;
  destacado?: boolean; // Para mostrar primero en el listado
}

export interface EstadisticasAgente {
  totalPropiedades: number;
  propiedadesVenta: number;
  propiedadesAlquiler: number;
  valorTotalCartera: number;
  moneda: string;
}

export interface ValoracionAgente {
  id: number;
  agenteId: number;
  clienteNombre: string;
  clienteAvatar?: string;
  comentario: string;
  calificacion: number; // 1-5 estrellas
  fecha: Date;
  propiedad?: string; // Título de la propiedad relacionada
}
