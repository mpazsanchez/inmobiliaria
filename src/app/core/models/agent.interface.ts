// =============================================
// DTO PÚBLICO DE AGENTE INMOBILIARIO
// =============================================
// Este es el modelo que consume el sitio público (agent-listing, agent-profile, etc).
// Representa lo que devolvería GET /api/v1/agentes — datos seguros, sin info interna.
// El panel admin trabaja con Usuario + PerfilAsesor (ver user.interface.ts).
// En modo mock, usuarioToAgente() convierte de Usuario → Agente.

import { PerfilAsesor } from './user.interface';

export interface Agente {
  id: number;
  usuarioId: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fotoUrl: string;

  // Perfil profesional público
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

// Convierte Usuario (modelo interno) → Agente (DTO público).
// Solo se usa en modo mock. Con backend real, GET /api/v1/agentes devuelve Agente directamente.
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
