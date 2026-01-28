/**
 * Tipos de notificaciones disponibles en el sistema
 */
export type TipoNotificacion =
  | 'nueva_consulta'        // Nuevo lead/consulta recibido
  | 'propiedad_vendida'     // Propiedad marcada como vendida
  | 'propiedad_alquilada'   // Propiedad marcada como alquilada
  | 'nuevo_usuario'         // Nuevo usuario registrado
  | 'usuario_pendiente'     // Usuario pendiente de aprobación
  | 'asignacion_lead'       // Lead asignado a un asesor
  | 'mensaje_nuevo'         // Nuevo mensaje/comentario
  | 'propiedad_destacada'   // Propiedad marcada como destacada
  | 'vencimiento_propiedad' // Propiedad próxima a vencer
  | 'sistema';              // Notificación del sistema

/**
 * Prioridad de la notificación
 */
export type PrioridadNotificacion = 'baja' | 'media' | 'alta' | 'urgente';

/**
 * Interface para Notificaciones
 */
export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  prioridad: PrioridadNotificacion;
  leida: boolean;
  fechaCreacion: string;
  usuarioId: number;
  
  // Datos adicionales según el tipo
  enlace?: string;          // URL para navegar al hacer click
  icono?: string;           // Icono Bootstrap
  entidadId?: number;       // ID de la entidad relacionada (propiedad, lead, etc.)
  entidadTipo?: string;     // Tipo de entidad ('propiedad', 'lead', 'usuario')
}

/**
 * Resumen de notificaciones para badge
 */
export interface ResumenNotificaciones {
  total: number;
  noLeidas: number;
  porTipo: {
    [key in TipoNotificacion]?: number;
  };
}

/**
 * Filtros para notificaciones
 */
export interface FiltrosNotificaciones {
  tipo?: TipoNotificacion;
  leida?: boolean;
  prioridad?: PrioridadNotificacion;
  desde?: string;
  hasta?: string;
  limite?: number;
}
