import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// =============================================
// INTERFACES
// =============================================
export interface CloudinaryUploadResult {
  url: string;           // URL optimizada para web
  secureUrl: string;     // URL HTTPS
  publicId: string;      // ID para transformaciones
  originalFilename: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'crop';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  gravity?: 'face' | 'center' | 'auto';
}

// =============================================
// SERVICIO DE CLOUDINARY
// =============================================
@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private http = inject(HttpClient);

  private readonly cloudName = environment.cloudinary?.cloudName || '';
  private readonly uploadPreset = environment.cloudinary?.uploadPreset || '';
  private readonly folder = environment.cloudinary?.folder || 'fairway';

  // Flag para modo mock (sin Cloudinary configurado)
  private useMockMode = !this.cloudName || this.cloudName === 'TU_CLOUD_NAME';

  // URL base para uploads
  private readonly uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  // =============================================
  // SUBIR IMAGEN
  // =============================================
  /**
   * Sube una imagen a Cloudinary
   * @param file - Archivo a subir
   * @param subfolder - Subcarpeta opcional (ej: 'agents', 'properties')
   * @returns Observable con el resultado del upload
   */
  uploadImage(file: File, subfolder?: string): Observable<CloudinaryUploadResult> {
    // Validaciones
    if (!file.type.startsWith('image/')) {
      return throwError(() => new Error('El archivo debe ser una imagen'));
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return throwError(() => new Error('La imagen no debe superar los 10MB'));
    }

    // Modo mock para desarrollo sin Cloudinary
    if (this.useMockMode) {
      return this.mockUpload(file);
    }

    // Preparar FormData para Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', subfolder ? `${this.folder}/${subfolder}` : this.folder);

    // Upload a Cloudinary
    return this.http.post<any>(this.uploadUrl, formData).pipe(
      map(response => ({
        url: response.secure_url,
        secureUrl: response.secure_url,
        publicId: response.public_id,
        originalFilename: response.original_filename,
        format: response.format,
        width: response.width,
        height: response.height,
        bytes: response.bytes
      })),
      catchError(error => {
        console.error('Error uploading to Cloudinary:', error);
        return throwError(() => new Error('Error al subir imagen. Verifica tu configuracion de Cloudinary.'));
      })
    );
  }

  // =============================================
  // GENERAR URL CON TRANSFORMACIONES
  // =============================================
  /**
   * Genera una URL optimizada con transformaciones
   * @param publicId - Public ID de la imagen en Cloudinary
   * @param options - Opciones de transformacion
   * @returns URL transformada
   */
  getTransformedUrl(publicId: string, options: CloudinaryTransformOptions = {}): string {
    if (!publicId || this.useMockMode) return publicId;

    const transforms: string[] = [];

    if (options.width) transforms.push(`w_${options.width}`);
    if (options.height) transforms.push(`h_${options.height}`);
    if (options.crop) transforms.push(`c_${options.crop}`);
    if (options.quality) transforms.push(`q_${options.quality}`);
    if (options.format) transforms.push(`f_${options.format}`);
    if (options.gravity) transforms.push(`g_${options.gravity}`);

    const transformString = transforms.length > 0 ? transforms.join(',') + '/' : '';

    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformString}${publicId}`;
  }

  // =============================================
  // HELPERS PARA CASOS COMUNES
  // =============================================

  /**
   * Sube foto de perfil de agente (optimizada 400x400)
   */
  uploadAgentPhoto(file: File): Observable<CloudinaryUploadResult> {
    return this.uploadImage(file, 'agents');
  }

  /**
   * Sube imagen de propiedad
   */
  uploadPropertyImage(file: File): Observable<CloudinaryUploadResult> {
    return this.uploadImage(file, 'properties');
  }

  /**
   * Sube imagen de contenido (banners, testimonios, etc)
   */
  uploadContentImage(file: File): Observable<CloudinaryUploadResult> {
    return this.uploadImage(file, 'content');
  }

  /**
   * Genera thumbnail de agente (400x400, cara centrada)
   */
  getAgentThumbnail(publicIdOrUrl: string): string {
    if (publicIdOrUrl.includes('cloudinary.com')) {
      // Extraer public_id de URL completa
      const match = publicIdOrUrl.match(/upload\/(?:v\d+\/)?(.+)/);
      if (match) {
        return this.getTransformedUrl(match[1], {
          width: 400,
          height: 400,
          crop: 'fill',
          gravity: 'face',
          quality: 'auto',
          format: 'auto'
        });
      }
    }
    return publicIdOrUrl;
  }

  /**
   * Genera imagen optimizada de propiedad (800x600)
   */
  getPropertyImage(publicIdOrUrl: string, size: 'thumb' | 'medium' | 'large' = 'medium'): string {
    const sizes = {
      thumb: { width: 400, height: 300 },
      medium: { width: 800, height: 600 },
      large: { width: 1200, height: 800 }
    };

    if (publicIdOrUrl.includes('cloudinary.com')) {
      const match = publicIdOrUrl.match(/upload\/(?:v\d+\/)?(.+)/);
      if (match) {
        return this.getTransformedUrl(match[1], {
          ...sizes[size],
          crop: 'fill',
          quality: 'auto',
          format: 'auto'
        });
      }
    }
    return publicIdOrUrl;
  }

  // =============================================
  // MODO MOCK (SIN CLOUDINARY)
  // =============================================
  private mockUpload(file: File): Observable<CloudinaryUploadResult> {
    console.warn('CloudinaryService: Usando modo MOCK. Configura cloudName en environment.ts');

    // Simular delay de upload
    const mockUrls = [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'
    ];

    const randomUrl = mockUrls[Math.floor(Math.random() * mockUrls.length)];

    return of({
      url: randomUrl,
      secureUrl: randomUrl,
      publicId: `mock_${Date.now()}`,
      originalFilename: file.name,
      format: file.type.split('/')[1],
      width: 800,
      height: 600,
      bytes: file.size
    }).pipe(delay(1500)); // Simular tiempo de upload
  }

  // =============================================
  // ESTADO DEL SERVICIO
  // =============================================
  /**
   * Verifica si Cloudinary esta configurado
   */
  isConfigured(): boolean {
    return !this.useMockMode;
  }

  /**
   * Obtiene info de configuracion actual
   */
  getConfig(): { cloudName: string; folder: string; isConfigured: boolean } {
    return {
      cloudName: this.useMockMode ? 'NO CONFIGURADO' : this.cloudName,
      folder: this.folder,
      isConfigured: !this.useMockMode
    };
  }
}
