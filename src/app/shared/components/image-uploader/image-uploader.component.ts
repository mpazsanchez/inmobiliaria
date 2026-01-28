import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadService, ImageUploadResult } from '../../../core/services/image-upload.service';

export interface ImageUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  result?: ImageUploadResult;
  error?: string;
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
        status: 'pending'
      };

      this.uploadQueue.update(queue => [...queue, uploadItem]);
      this.uploadFile(uploadItem);
    });
  }

  private uploadFile(uploadItem: ImageUploadProgress): void {
    // Validar imagen
    const validation = this.imageUploadService.validateImage(uploadItem.file);
    if (!validation.valid) {
      this.updateUploadStatus(uploadItem, 'error', validation.error);
      this.uploadError.emit(validation.error);
      return;
    }

    // Marcar como uploading
    this.updateUploadStatus(uploadItem, 'uploading');

    // Subir a Cloudinary
    this.imageUploadService.uploadToCloudinary(uploadItem.file, { folder: this.folder })
      .subscribe({
        next: (result) => {
          uploadItem.result = result;
          this.updateUploadStatus(uploadItem, 'success');
          this.uploadComplete.emit(result);
        },
        error: (error) => {
          const errorMessage = error.message || 'Error al subir la imagen';
          this.updateUploadStatus(uploadItem, 'error', errorMessage);
          this.uploadError.emit(errorMessage);
        }
      });
  }

  private updateUploadStatus(
    uploadItem: ImageUploadProgress,
    status: ImageUploadProgress['status'],
    error?: string
  ): void {
    this.uploadQueue.update(queue =>
      queue.map(item =>
        item === uploadItem
          ? { ...item, status, error, progress: status === 'success' ? 100 : item.progress }
          : item
      )
    );
  }

  removeUpload(uploadItem: ImageUploadProgress): void {
    this.uploadQueue.update(queue => queue.filter(item => item !== uploadItem));
  }

  clearCompleted(): void {
    this.uploadQueue.update(queue =>
      queue.filter(item => item.status !== 'success' && item.status !== 'error')
    );
  }

  getPreviewUrl(uploadItem: ImageUploadProgress): string {
    if (uploadItem.result) {
      return uploadItem.result.thumbnailUrl;
    }
    return URL.createObjectURL(uploadItem.file);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
