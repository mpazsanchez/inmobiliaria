import { Coordenadas } from './property.interface';

export interface ResultadoGeocoding {
  coordenadas: Coordenadas;
  direccionFormateada: string;
  ciudad?: string;
  departamento?: string;
  pais?: string;
  codigoPostal?: string;
}

export interface OpcionesGeocoding {
  proveedor: 'nominatim' | 'google';
  apiKey?: string; // Solo para Google Maps
}

// Interfaz interna para compatibilidad con código legacy
export interface CoordenadasLegacy {
  latitud: number;
  longitud: number;
}
