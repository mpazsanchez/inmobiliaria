/**
 * Interfaz para contenido estático de páginas informativas
 * Permite editar contenido desde el admin sin tocar código
 */
export interface ContenidoEstatico {
  /** Identificador único de la página (ej: "nosotros", "contacto", "terminos") */
  pagina: string;
  
  /** Título de la página */
  titulo: string;
  
  /** Contenido en formato HTML editable */
  contenidoHtml: string;
  
  /** Fecha de última actualización (ISO 8601) */
  ultimaActualizacion: string;
  
  /** ID del usuario/admin que editó por última vez */
  editadoPor?: number;
  
  /** Metadatos SEO opcionales */
  metaDescripcion?: string;
  metaKeywords?: string;
  
  /** Indica si la página está publicada o en borrador */
  publicada?: boolean;
}

/**
 * Tipos de páginas estáticas disponibles
 */
export type TipoPaginaEstatica = 
  | 'nosotros'
  | 'contacto'
  | 'terminos'
  | 'privacidad'
  | 'faqs'
  | 'servicios';
