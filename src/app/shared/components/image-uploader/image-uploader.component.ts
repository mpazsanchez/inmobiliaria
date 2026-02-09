import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadService, ImageUploadResult } from '../../../core/services/image-upload.service';

export interface ImageUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  result?: ImageUploadResult;
  error?: string;
  previewUrl?: string; // Cache de blob URL
}

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent {
  @Input() maxFiles: number = 10;
  @Input() folder: string = 'properties';
  @Input() showPreview: boolean = true;
  @Input() compact: boolean = false;
  @Output() uploadComplete = new EventEmitter<ImageUploadResult>();
  @Output() uploadError = new EventEmitter<string>();

  isDragging = signal(false);
  uploadQueue = signal<ImageUploadProgress[]>([]);

  constructor(private imageUploadService: ImageUploadService) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
      // Reset input para poder seleccionar el mismo archivo nuevamente
      input.value = '';
    }
  }

  private handleFiles(files: File[]): void {
    // Filtrar solo imágenes
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      this.uploadError.emit('No se seleccionaron imágenes válidas');
      return;
    }

    // Verificar límite de archivos
    const currentCount = this.uploadQueue().length;
    const availableSlots = this.maxFiles - currentCount;
    
    if (imageFiles.length > availableSlots) {
      this.uploadError.emit(`Solo puedes subir ${availableSlots} imagen(es) más`);
      return;
    }

    // Agregar a la cola de carga
    imageFiles.forEach(file => {
      const uploadItem: ImageUploadProgress = {
        file,
        progress: 0,
        status: 'pending',
        previewUrl: URL.createObjectURL(file) // Cachear blob URL
      };

      this.uploadQueue.update(queue => [...queue, uploadItem]);
      this.uploadFile(uploadItem);
    });
  }

  private uploadFile(uploadItem: ImageUploadProgress): void {
    // Validar imagen
    const validation = this.imageUploadService.validateImage(uploadItem.file);
    if (!validation.valid) {
      this.uploadQueue.update(queue =>
        queue.map(item =>
          item.file === uploadItem.file
            ? { ...item, status: 'error' as const, error: validation.error }
            : item
        )
      );
      this.uploadError.emit(validation.error);
      return;
    }

    // Marcar como uploading
    this.uploadQueue.update(queue =>
      queue.map(item =>
        item.file === uploadItem.file
          ? { ...item, status: 'uploading' as const }
          : item
      )
    );

    // Subir a Cloudinary
    this.imageUploadService.uploadToCloudinary(uploadItem.file, { folder: this.folder })
      .subscribe({
        next: (result) => {
          console.log('Upload success:', result);
          // Actualizar con el resultado - esto creará un nuevo objeto
          this.uploadQueue.update(queue =>
            queue.map(item =>
              item.file === uploadItem.file
                ? { ...item, status: 'success' as const, result, progress: 100 }
                : item
            )
          );
          this.uploadComplete.emit(result);
        },
        error: (error) => {
          console.error('Upload error:', error);
          const errorMessage = error.message || 'Error al subir la imagen';
          this.uploadQueue.update(queue =>
            queue.map(item =>
              item.file === uploadItem.file
                ? { ...item, status: 'error' as const, error: errorMessage }
                : item
            )
          );
          this.uploadError.emit(errorMessage);
        }
      });
  }

  removeUpload(uploadItem: ImageUploadProgress): void {
    // Liberar blob URL si existe
    if (uploadItem.previewUrl) {
      URL.revokeObjectURL(uploadItem.previewUrl);
    }
    this.uploadQueue.update(queue => queue.filter(item => item.file !== uploadItem.file));
  }

  clearCompleted(): void {
    this.uploadQueue.update(queue => {
      // Liberar blob URLs de items completados/con error
      queue.forEach(item => {
        if ((item.status === 'success' || item.status === 'error') && item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
      return queue.filter(item => item.status !== 'success' && item.status !== 'error');
    });
  }

  getPreviewUrl(uploadItem: ImageUploadProgress): string {
    if (uploadItem.result) {
      return uploadItem.result.thumbnailUrl;
    }
    // Usar blob URL cacheada
    return uploadItem.previewUrl || '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
