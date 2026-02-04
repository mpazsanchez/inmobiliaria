// =============================================
// INTERFACE DE AGENTE INMOBILIARIO (LEGACY)
// =============================================
// NOTA: Este modelo se mantiene por compatibilidad con el perfil público
// El sistema de gestión de usuarios ahora usa Usuario + PerfilAsesor
// Ver: user.interface.ts

import { PerfilAsesor } from './user.interface';

export interface Agente {
  id: number;
  usuarioId: number; // Relación con el usuario
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fotoUrl: string;
  
  // Perfil público (delegado a PerfilAsesor en el nuevo sistema)
  cargo: string;
  especialidad?: string;
  slogan?: string;
  biografia?: string;
  experienciaAnios?: number;
  
  // Idiomas
  idiomas?: string[];
  
  // Redes sociales
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
  destacado?: boolean;
}

// Función helper para convertir Usuario + PerfilAsesor a Agente (para vistas públicas)
export function usuarioToAgente(usuario: any): Agente {
  const perfil = usuario.perfilAsesor || {};
  
  return {
    id: usuario.id,
    usuarioId: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    telefono: usuario.telefono,
    fotoUrl: usuario.fotoUrl,
    cargo: perfil.cargo || 'Asesor Inmobiliario',
    especialidad: perfil.especialidad,
    slogan: perfil.slogan,
    biografia: perfil.biografia,
    experienciaAnios: perfil.experienciaAnios,
    idiomas: perfil.idiomas,
    whatsapp: perfil.whatsapp,
    linkedin: perfil.linkedin,
    instagram: perfil.instagram,
    facebook: perfil.facebook,
    propiedadesVendidas: perfil.propiedadesVendidas,
    propiedadesActivas: 0, // Se calcula dinámicamente
    clientesSatisfechos: perfil.clientesSatisfechos,
    certificaciones: perfil.certificaciones,
    premios: perfil.premios,
    activo: usuario.activo,
    destacado: perfil.destacado
  };
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
