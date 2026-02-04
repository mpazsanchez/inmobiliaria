// =============================================
// TIPOS DE ROL
// =============================================
export type RolUsuario = 'admin' | 'asesor';

// =============================================
// INTERFACE DE USUARIO BASE
// =============================================
export interface Usuario {
  id: number;
  
  // Autenticación
  email: string;
  passwordHash: string;
  rol: RolUsuario;
  activo: boolean;
  
  // Datos personales básicos
  nombre: string;
  apellido: string;
  telefono: string;
  fotoUrl: string;
  
  // Fechas de control
  fechaRegistro: string;
  ultimoAcceso?: string;
  
  // Visibilidad (para asesores destacados)
  destacado?: boolean;
  
  // Extensión de perfil público (solo para asesores)
  perfilAsesor?: PerfilAsesor;
}

// =============================================
// PERFIL PÚBLICO DE ASESOR
// =============================================
export interface PerfilAsesor {
  // Información profesional
  cargo: string; // "Agente Asociado", "Broker", etc.
  especialidad?: string; // "Propiedades de lujo", "Primera vivienda", etc.
  slogan?: string; // Frase breve para el listado
  biografia?: string; // Biografía completa para el perfil público
  experienciaAnios?: number;
  
  // Idiomas
  idiomas?: string[]; // ["Español", "Inglés", "Portugués"]
  
  // Redes sociales y contacto adicional
  whatsapp?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  
  // Estadísticas públicas
  propiedadesVendidas?: number;
  propiedadesActivas?: number;
  clientesSatisfechos?: number;
  
  // Certificaciones y logros
  certificaciones?: string[];
  premios?: string[];
  
  // Visibilidad
  destacado?: boolean; // Para mostrar primero en el listado público
}

// =============================================
// DTO PARA CREAR USUARIO
// =============================================
export interface CrearUsuarioDto {
  email: string;
  password: string;
  rol: RolUsuario;
  nombre: string;
  apellido: string;
  telefono: string;
  fotoUrl?: string;
  perfilAsesor?: Partial<PerfilAsesor>;
}

// =============================================
// DTO PARA ACTUALIZAR USUARIO
// =============================================
export interface ActualizarUsuarioDto {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  fotoUrl?: string;
  activo?: boolean;
  destacado?: boolean;
  perfilAsesor?: Partial<PerfilAsesor>;
}

// =============================================
// TOKEN DE RECUPERACIÓN DE CONTRASEÑA
// =============================================
export interface TokenRecuperacion {
  id: number;
  usuarioId: number;
  token: string;
  fechaCreacion: Date;
  fechaExpiracion: Date;
  usado: boolean;
}

// =============================================
// DTO PARA SOLICITAR RECUPERACIÓN
// =============================================
export interface SolicitarRecuperacionDto {
  email: string;
}

// =============================================
// DTO PARA RESETEAR CONTRASEÑA
// =============================================
export interface ResetearPasswordDto {
  token: string;
  nuevaPassword: string;
}

// =============================================
// ESTADÍSTICAS DE ASESOR
// =============================================
export interface EstadisticasAsesor {
  totalPropiedades: number;
  propiedadesVenta: number;
  propiedadesAlquiler: number;
  valorTotalCartera: number;
  moneda: string;
  consultasRecibidas?: number;
}

// =============================================
// RESPUESTA DE REASIGNACIÓN
// =============================================
export interface ReasignacionPropiedadesDto {
  usuarioOrigenId: number;
  usuarioDestinoId: number;
  propiedadesIds: number[];
}
