export interface Testimonio {
  id: number;
  nombre: string;
  ubicacion: string;
  texto: string;
  fotoUrl: string;
  calificacion?: number;
}

export interface Beneficio {
  id: number;
  icono: string;
  titulo: string;
  descripcion: string;
  orden: number;
}

export interface ContenidoResponse {
  testimonios: Testimonio[];
  beneficios: Beneficio[];
}
