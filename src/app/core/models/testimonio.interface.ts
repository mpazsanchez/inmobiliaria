// =============================================
// CONTENIDO ADMINISTRABLE - INTERFACES
// =============================================

export interface Testimonio {
  id: number;
  nombre: string;
  ubicacion: string;
  texto: string;
  fotoUrl: string;
  calificacion?: number;
  activo?: boolean;
  orden?: number;
}

export interface Beneficio {
  id: number;
  icono: string;
  titulo: string;
  descripcion: string;
  orden: number;
  activo?: boolean;
}

export interface FAQ {
  id: number;
  pregunta: string;
  respuesta: string;
  categoria?: string;
  orden: number;
  activo: boolean;
}

export interface Banner {
  id: number;
  titulo: string;
  subtitulo?: string;
  imagenUrl: string;
  imagenMovilUrl?: string;
  enlace?: string;
  textoBoton?: string;
  pagina: 'home' | 'properties' | 'about' | 'contact' | 'team' | 'services'; // Página donde se muestra
  posicion: 'hero' | 'secundario' | 'promocional'; // Posición dentro de la página
  orden: number;
  activo: boolean;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface ContenidoResponse {
  testimonios: Testimonio[];
  beneficios: Beneficio[];
  faqs?: FAQ[];
  banners?: Banner[];
}
