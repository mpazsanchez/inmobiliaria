import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ImageUploadResult {
  url: string;
  thumbnailUrl: string;
  mediumUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface ImageUploadOptions {
  folder?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'auto' | 'jpg' | 'png' | 'webp';
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private http = inject(HttpClient);
  
  // Configuración de Cloudinary - se puede cambiar por variables de entorno
  private cloudinaryConfig = {
    cloudName: environment.cloudinary?.cloudName || 'demo',
    uploadPreset: environment.cloudinary?.uploadPreset || 'ml_default'
  };

  /**
   * Valida que el archivo sea una imagen válida
   */
  validateImage(file: File): { valid: boolean; error?: string } {
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Formato de imagen no válido. Use JPG, PNG, WEBP o GIF'
      };
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'La imagen no puede superar los 10MB'
      };
    }

    return { valid: true };
  }

  /**
   * Optimiza una imagen en el cliente antes de subirla
   * Reduce el tamaño y dimensiones para ahorrar ancho de banda
   */
  optimizeImage(file: File, maxWidth: number = 1920, quality: number = 0.85): Observable<Blob> {
    return from(
      new Promise<Blob>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const img = new Image();
          img.onload = () => {
            // Calcular nuevas dimensiones manteniendo aspect ratio
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }

            // Crear canvas para redimensionar
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('No se pudo obtener contexto del canvas'));
              return;
            }

            // Dibujar imagen redimensionada
            ctx.drawImage(img, 0, 0, width, height);

            // Convertir a Blob
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Error al convertir canvas a blob'));
                }
              },
              'image/jpeg',
              quality
            );
          };
          img.onerror = () => reject(new Error('Error al cargar la imagen'));
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Error al leer el archivo'));
        reader.readAsDataURL(file);
      })
    );
  }

  /**
   * Sube una imagen a Cloudinary con optimización automática
   * Genera automáticamente thumbnails y versiones optimizadas
   */
  uploadToCloudinary(file: File, options: ImageUploadOptions = {}): Observable<ImageUploadResult> {
    // Validar imagen
    const validation = this.validateImage(file);
    if (!validation.valid) {
      return throwError(() => new Error(validation.error));
    }

    // Optimizar imagen antes de subir
    return this.optimizeImage(file, options.maxWidth || 1920, options.quality || 0.85).pipe(
      switchMap(optimizedBlob => {
        const formData = new FormData();
        formData.append('file', optimizedBlob, file.name);
        formData.append('upload_preset', this.cloudinaryConfig.uploadPreset);
        
        if (options.folder) {
          formData.append('folder', options.folder);
        }

        // Configurar transformaciones para generar versiones optimizadas
        const transformations = {
          eager: [
            { width: 150, height: 150, crop: 'thumb', quality: 'auto:low' }, // Thumbnail
            { width: 800, height: 600, crop: 'limit', quality: 'auto:good' }  // Medium
          ],
          eager_async: true
        };

        const url = `https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/image/upload`;

        return this.http.post<any>(url, formData).pipe(
          map(response => {
            // Construir URLs con transformaciones de Cloudinary
            const baseUrl = response.secure_url.split('/upload/')[0] + '/upload';
            const imagePath = response.secure_url.split('/upload/')[1];

            return {
              url: response.secure_url, // URL original (optimizada)
              thumbnailUrl: `${baseUrl}/w_150,h_150,c_thumb,q_auto:low/${imagePath}`, // 150x150
              mediumUrl: `${baseUrl}/w_800,h_600,c_limit,q_auto:good/${imagePath}`, // 800x600 max
              publicId: response.public_id,
              width: response.width,
              height: response.height,
              format: response.format,
              size: response.bytes
            };
          }),
          catchError(error => {
            console.error('Error al subir imagen a Cloudinary:', error);
            return throwError(() => new Error('Error al subir la imagen. Intente nuevamente.'));
          })
        );
      })
    );
  }

  /**
   * Sube múltiples imágenes en paralelo
   */
  uploadMultiple(files: File[], options: ImageUploadOptions = {}): Observable<ImageUploadResult[]> {
    const uploads = files.map(file => this.uploadToCloudinary(file, options));
    return from(Promise.all(uploads.map(obs => obs.toPromise()))) as Observable<ImageUploadResult[]>;
  }

  /**
   * Elimina una imagen de Cloudinary usando su publicId
   * Nota: Requiere configuración de backend para firma de eliminación
   */
  deleteFromCloudinary(publicId: string): Observable<void> {
    // Por seguridad, la eliminación debe hacerse desde el backend
    // Aquí solo retornamos success, implementar endpoint backend si es necesario
    console.warn('Eliminación de imágenes debe implementarse en el backend');
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  /**
   * Genera URL con transformaciones específicas de Cloudinary
   */
  getTransformedUrl(url: string, transformations: string): string {
    if (!url.includes('cloudinary.com')) {
      return url; // No es una imagen de Cloudinary, retornar URL original
    }

    const parts = url.split('/upload/');
    if (parts.length !== 2) {
      return url;
    }

    return `${parts[0]}/upload/${transformations}/${parts[1]}`;
  }

  /**
   * Obtiene diferentes versiones de una imagen de Cloudinary
   */
  getImageVersions(url: string) {
    return {
      original: url,
      thumbnail: this.getTransformedUrl(url, 'w_150,h_150,c_thumb,q_auto:low'),
      small: this.getTransformedUrl(url, 'w_400,h_300,c_limit,q_auto:good'),
      medium: this.getTransformedUrl(url, 'w_800,h_600,c_limit,q_auto:good'),
      large: this.getTransformedUrl(url, 'w_1200,h_900,c_limit,q_auto:best'),
      webp: this.getTransformedUrl(url, 'f_webp,q_auto:good')
    };
  }
}
