import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { ResultadoGeocoding, OpcionesGeocoding } from '../models/geocoding.interface';
import { Coordenadas } from '../models/property.interface';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private http = inject(HttpClient);
  
  // Configuración por defecto: Nominatim (OpenStreetMap) - Gratis
  private opcionesPorDefecto: OpcionesGeocoding = {
    proveedor: 'nominatim'
  };

  /**
   * Geocodifica una dirección y devuelve las coordenadas
   * @param direccion Dirección completa a geocodificar
   * @param opciones Opciones de geocoding (proveedor, API key)
   */
  geocodificar(direccion: string, opciones?: OpcionesGeocoding): Observable<ResultadoGeocoding | null> {
    if (!direccion || direccion.trim().length === 0) {
      return of(null);
    }

    const opts = { ...this.opcionesPorDefecto, ...opciones };

    if (opts.proveedor === 'google') {
      return this.geocodificarConGoogle(direccion, opts.apiKey);
    } else {
      return this.geocodificarConNominatim(direccion);
    }
  }

  /**
   * Geocoding usando Nominatim (OpenStreetMap) - Gratis
   */
  private geocodificarConNominatim(direccion: string): Observable<ResultadoGeocoding | null> {
    const url = 'https://nominatim.openstreetmap.org/search';
    const params = {
      q: direccion,
      format: 'json',
      limit: '1',
      addressdetails: '1'
    };

    // Nominatim requiere un User-Agent personalizado
    const headers = {
      'User-Agent': 'Fairway Servicios Inmobiliarios'
    };

    return this.http.get<any[]>(url, { params, headers }).pipe(
      // Delay de 1 segundo para respetar el rate limit de Nominatim (1 req/sec)
      delay(1000),
      map(results => {
        if (!results || results.length === 0) {
          return null;
        }

        const result = results[0];
        return {
          coordenadas: {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
          },
          direccionFormateada: result.display_name,
          ciudad: result.address?.city || result.address?.town || result.address?.village,
          departamento: result.address?.state,
          pais: result.address?.country,
          codigoPostal: result.address?.postcode
        };
      }),
      catchError(error => {
        console.error('Error en geocoding con Nominatim:', error);
        return of(null);
      })
    );
  }

  /**
   * Geocoding usando Google Maps Geocoding API - Requiere API key
   */
  private geocodificarConGoogle(direccion: string, apiKey?: string): Observable<ResultadoGeocoding | null> {
    if (!apiKey) {
      console.error('Se requiere una API key de Google Maps para usar este proveedor');
      return throwError(() => new Error('API key de Google Maps no proporcionada'));
    }

    const url = 'https://maps.googleapis.com/maps/api/geocode/json';
    const params = {
      address: direccion,
      key: apiKey
    };

    return this.http.get<any>(url, { params }).pipe(
      map(response => {
        if (response.status !== 'OK' || !response.results || response.results.length === 0) {
          return null;
        }

        const result = response.results[0];
        const location = result.geometry.location;
        const addressComponents = result.address_components;

        // Extraer componentes de dirección
        const getCityComponent = (type: string) => {
          const component = addressComponents.find((c: any) => c.types.includes(type));
          return component?.long_name;
        };

        return {
          coordenadas: {
            lat: location.lat,
            lng: location.lng
          },
          direccionFormateada: result.formatted_address,
          ciudad: getCityComponent('locality') || getCityComponent('administrative_area_level_2'),
          departamento: getCityComponent('administrative_area_level_1'),
          pais: getCityComponent('country'),
          codigoPostal: getCityComponent('postal_code')
        };
      }),
      catchError(error => {
        console.error('Error en geocoding con Google Maps:', error);
        return of(null);
      })
    );
  }

  /**
   * Geocodifica una dirección específica de Argentina
   * Agrega automáticamente ", Argentina" para mejorar precisión
   */
  geocodificarArgentina(direccion: string, ciudad?: string, provincia?: string): Observable<ResultadoGeocoding | null> {
    let direccionCompleta = direccion;

    if (ciudad) {
      direccionCompleta += `, ${ciudad}`;
    }

    if (provincia) {
      direccionCompleta += `, ${provincia}`;
    }

    direccionCompleta += ', Argentina';

    return this.geocodificar(direccionCompleta);
  }

  /**
   * Geocodificación inversa: convertir coordenadas a dirección
   */
  geocodificacionInversa(coordenadas: Coordenadas): Observable<ResultadoGeocoding | null> {
    const url = 'https://nominatim.openstreetmap.org/reverse';
    const params = {
      lat: coordenadas.lat.toString(),
      lon: coordenadas.lng.toString(),
      format: 'json',
      addressdetails: '1'
    };

    const headers = {
      'User-Agent': 'Fairway Servicios Inmobiliarios'
    };

    return this.http.get<any>(url, { params, headers }).pipe(
      delay(1000),
      map(result => {
        if (!result) {
          return null;
        }

        return {
          coordenadas: {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
          },
          direccionFormateada: result.display_name,
          ciudad: result.address?.city || result.address?.town || result.address?.village,
          departamento: result.address?.state,
          pais: result.address?.country,
          codigoPostal: result.address?.postcode
        };
      }),
      catchError(error => {
        console.error('Error en geocodificación inversa:', error);
        return of(null);
      })
    );
  }

  /**
   * Valida si unas coordenadas son válidas
   */
  validarCoordenadas(coordenadas: Coordenadas): boolean {
    return (
      coordenadas &&
      coordenadas.lat >= -90 &&
      coordenadas.lat <= 90 &&
      coordenadas.lng >= -180 &&
      coordenadas.lng <= 180
    );
  }

  /**
   * Calcula la distancia entre dos coordenadas usando la fórmula Haversine
   * @returns Distancia en kilómetros
   */
  calcularDistancia(coord1: Coordenadas, coord2: Coordenadas): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(coord2.lat - coord1.lat);
    const dLon = this.toRad(coord2.lng - coord1.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(coord1.lat)) * Math.cos(this.toRad(coord2.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
