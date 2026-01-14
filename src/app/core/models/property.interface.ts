export interface Propiedad {
  id: number;
  titulo: string;
  descripcion: string;
  tipoPropiedad: string;
  operacion: string;
  precio: number;
  moneda: string;
  ubicacion: Ubicacion;
  caracteristicas: Caracteristicas;
  imagenes: Imagen[];
  estado: string;
  destacada: boolean;
  asesorId: number;
  fechaPublicacion: string;
  ultimaActualizacion: string;
}

export interface Ubicacion {
  direccion: string;
  ciudad: string;
  provincia: string;
  pais: string;
  coordenadas: Coordenadas;
}

export interface Coordenadas {
  lat: number;
  lng: number;
}

export interface Caracteristicas {
  ambientes: number;
  dormitorios: number;
  banos: number;
  superficie_cubierta: number;
  superficie_total: number;
  antiguedad: number;
  garage: number;
  amenidades: string[];
}

export interface Imagen {
  url: string;
  descripcion: string;
}
