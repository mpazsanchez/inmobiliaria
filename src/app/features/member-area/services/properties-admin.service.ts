import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, delay, tap } from 'rxjs/operators';
import { Propiedad, Imagen } from '../../../core/models/property.interface';
import { MOCK_PROPIEDADES } from '../../../core/services/mock-data/properties.mock';
import { CloudinaryService } from '../../../core/services/cloudinary.service';

// =============================================
// INTERFACES
// =============================================
export interface PropertyFilters {
  search?: string;
  operacion?: string;
  tipoPropiedad?: string;
  estado?: string;
  asesorId?: number;
}

export interface PropertyStats {
  total: number;
  disponibles: number;
  reservadas: number;
  vendidas: number;
  alquiladas: number;
  destacadas: number;
}

// =============================================
// SERVICIO DE PROPIEDADES (ADMIN)
// =============================================
@Injectable({ providedIn: 'root' })
export class PropertiesAdminService {
  private http = inject(HttpClient);
  private cloudinary = inject(CloudinaryService);

  // Flag para cambiar entre mock y API real
  private useMockData = true;

  // URLs
  private readonly API_URL = '/api/v1/admin/properties';

  // Estado local de propiedades (para mock CRUD)
  private propiedadesSubject = new BehaviorSubject<Propiedad[]>([...MOCK_PROPIEDADES]);
  propiedades$ = this.propiedadesSubject.asObservable();

  /**
   * Obtiene todas las propiedades (con filtros opcionales)
   */
  getProperties(filters?: PropertyFilters): Observable<Propiedad[]> {
    if (this.useMockData) {
      return this.getPropertiesMock(filters);
    }
    return this.http.get<Propiedad[]>(this.API_URL, { params: filters as any });
  }

  /**
   * Obtiene propiedades desde mock data con filtros
   */
  private getPropertiesMock(filters?: PropertyFilters): Observable<Propiedad[]> {
    return this.propiedades$.pipe(
      map(propiedades => {
        let filtered = [...propiedades];

        if (filters?.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(p =>
            p.titulo.toLowerCase().includes(search) ||
            p.ubicacion.direccion.toLowerCase().includes(search) ||
            p.ubicacion.ciudad.toLowerCase().includes(search)
          );
        }

        if (filters?.operacion) {
          filtered = filtered.filter(p => p.operacion === filters.operacion);
        }

        if (filters?.tipoPropiedad) {
          filtered = filtered.filter(p => p.tipoPropiedad === filters.tipoPropiedad);
        }

        if (filters?.estado) {
          filtered = filtered.filter(p => p.estado === filters.estado);
        }

        if (filters?.asesorId) {
          filtered = filtered.filter(p => p.asesorId === filters.asesorId);
        }

        // Ordenar por fecha de actualización (más reciente primero)
        filtered.sort((a, b) =>
          new Date(b.ultimaActualizacion).getTime() - new Date(a.ultimaActualizacion).getTime()
        );

        return filtered;
      }),
      delay(300) // Simular latencia de red
    );
  }

  /**
   * Obtiene una propiedad por ID
   */
  getPropertyById(id: number): Observable<Propiedad | null> {
    if (this.useMockData) {
      const propiedades = this.propiedadesSubject.getValue();
      const propiedad = propiedades.find(p => p.id === id) || null;
      return of(propiedad).pipe(delay(200));
    }
    return this.http.get<Propiedad>(`${this.API_URL}/${id}`);
  }

  /**
   * Crea una nueva propiedad
   */
  createProperty(propiedad: Partial<Propiedad>): Observable<Propiedad> {
    if (this.useMockData) {
      return this.createPropertyMock(propiedad);
    }
    return this.http.post<Propiedad>(this.API_URL, propiedad);
  }

  private createPropertyMock(data: Partial<Propiedad>): Observable<Propiedad> {
    const propiedades = this.propiedadesSubject.getValue();
    const maxId = Math.max(...propiedades.map(p => p.id), 0);

    const newProperty: Propiedad = {
      id: maxId + 1,
      titulo: data.titulo || '',
      descripcion: data.descripcion || '',
      tipoPropiedad: data.tipoPropiedad || 'departamento',
      operacion: data.operacion || 'venta',
      precio: data.precio || 0,
      moneda: data.moneda || 'USD',
      ubicacion: data.ubicacion || {
        direccion: '',
        ciudad: '',
        provincia: '',
        pais: 'Argentina',
        coordenadas: { lat: -34.6037, lng: -58.3816 }
      },
      caracteristicas: data.caracteristicas || {
        ambientes: 0,
        dormitorios: 0,
        banos: 0,
        superficie_cubierta: 0,
        superficie_total: 0,
        antiguedad: 0,
        garage: 0,
        amenidades: []
      },
      imagenes: data.imagenes || [],
      estado: data.estado || 'disponible',
      destacada: data.destacada || false,
      asesorId: data.asesorId || 1,
      fechaPublicacion: new Date().toISOString().split('T')[0],
      ultimaActualizacion: new Date().toISOString().split('T')[0],
      agente: data.agente
    };

    this.propiedadesSubject.next([newProperty, ...propiedades]);
    return of(newProperty).pipe(delay(300));
  }

  /**
   * Actualiza una propiedad existente
   */
  updateProperty(id: number, data: Partial<Propiedad>): Observable<Propiedad> {
    if (this.useMockData) {
      return this.updatePropertyMock(id, data);
    }
    return this.http.put<Propiedad>(`${this.API_URL}/${id}`, data);
  }

  private updatePropertyMock(id: number, data: Partial<Propiedad>): Observable<Propiedad> {
    const propiedades = this.propiedadesSubject.getValue();
    const index = propiedades.findIndex(p => p.id === id);

    if (index === -1) {
      throw new Error('Propiedad no encontrada');
    }

    const updated: Propiedad = {
      ...propiedades[index],
      ...data,
      ultimaActualizacion: new Date().toISOString().split('T')[0]
    };

    propiedades[index] = updated;
    this.propiedadesSubject.next([...propiedades]);

    return of(updated).pipe(delay(300));
  }

  /**
   * Elimina una propiedad
   */
  deleteProperty(id: number): Observable<boolean> {
    if (this.useMockData) {
      return this.deletePropertyMock(id);
    }
    return this.http.delete<boolean>(`${this.API_URL}/${id}`);
  }

  private deletePropertyMock(id: number): Observable<boolean> {
    const propiedades = this.propiedadesSubject.getValue();
    const filtered = propiedades.filter(p => p.id !== id);
    this.propiedadesSubject.next(filtered);
    return of(true).pipe(delay(300));
  }

  /**
   * Cambia el estado de una propiedad
   */
  changeStatus(id: number, estado: string): Observable<Propiedad> {
    return this.updateProperty(id, { estado });
  }

  /**
   * Toggle destacada
   */
  toggleDestacada(id: number): Observable<Propiedad> {
    const propiedades = this.propiedadesSubject.getValue();
    const propiedad = propiedades.find(p => p.id === id);
    if (!propiedad) {
      throw new Error('Propiedad no encontrada');
    }
    return this.updateProperty(id, { destacada: !propiedad.destacada });
  }

  /**
   * Obtiene estadísticas de propiedades
   */
  getStats(asesorId?: number): Observable<PropertyStats> {
    return this.propiedades$.pipe(
      map(propiedades => {
        let filtered = asesorId
          ? propiedades.filter(p => p.asesorId === asesorId)
          : propiedades;

        return {
          total: filtered.length,
          disponibles: filtered.filter(p => p.estado === 'disponible').length,
          reservadas: filtered.filter(p => p.estado === 'reservado').length,
          vendidas: filtered.filter(p => p.estado === 'vendido').length,
          alquiladas: filtered.filter(p => p.estado === 'alquilado').length,
          destacadas: filtered.filter(p => p.destacada).length
        };
      }),
      delay(200)
    );
  }

  /**
   * Sube imagen de propiedad usando Cloudinary
   */
  uploadImage(file: File): Observable<Imagen> {
    return this.cloudinary.uploadPropertyImage(file).pipe(
      map(result => ({
        url: result.secureUrl,
        descripcion: result.originalFilename
      }))
    );
  }

  /**
   * Obtiene lista de tipos de propiedad
   */
  getTiposPropiedad(): string[] {
    return ['departamento', 'casa', 'ph', 'oficina', 'local', 'terreno'];
  }

  /**
   * Obtiene lista de operaciones
   */
  getOperaciones(): string[] {
    return ['venta', 'alquiler'];
  }

  /**
   * Obtiene lista de estados
   */
  getEstados(): string[] {
    return ['disponible', 'reservado', 'vendido', 'alquilado'];
  }

  /**
   * Obtiene lista de amenidades disponibles
   */
  getAmenidades(): string[] {
    return [
      'balcon', 'terraza', 'jardin', 'patio', 'pileta', 'gym',
      'sum', 'parrilla', 'cochera', 'lavadero', 'baulera',
      'seguridad-24hs', 'aire-acondicionado', 'calefaccion',
      'laundry', 'solarium', 'spa', 'recepcion'
    ];
  }
}
