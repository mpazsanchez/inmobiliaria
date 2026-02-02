import { Injectable, signal } from '@angular/core';
import { ModalVariant } from '../../shared/components/admin/confirm-modal/confirm-modal.component';

export interface ModalConfig {
  title: string;
  message: string;
  variant: ModalVariant;
  warningText?: string;
  confirmText?: string;
  cancelText?: string;
  itemName?: string;
  messagePrefix?: string;
  messageSuffix?: string;
}

/**
 * Servicio para gestionar confirmaciones de cambios sin guardar
 * Usa signals para controlar el modal de forma reactiva
 * 
 * Este servicio centraliza la lógica del modal de confirmación,
 * evitando la necesidad de crear componentes dinámicamente
 */
@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesService {
  // Estado reactivo del modal
  isModalOpen = signal(false);
  modalConfig = signal<ModalConfig | null>(null);
  
  private resolvePromise?: (value: boolean) => void;

  /**
   * Muestra un modal de confirmación cuando hay cambios sin guardar
   * 
   * @param message Mensaje personalizado (opcional)
   * @returns Promise<boolean> - true si confirma salir, false si cancela
   */
  confirmLeave(message?: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.resolvePromise = resolve;
      
      this.modalConfig.set({
        title: 'Cambios sin guardar',
        message: message || '¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.',
        variant: 'warning',
        warningText: 'Esta acción no se puede deshacer.',
        confirmText: 'Salir sin guardar',
        cancelText: 'Continuar editando'
      });
      
      this.isModalOpen.set(true);
    });
  }

  /**
   * Manejador cuando el usuario confirma la acción
   */
  onConfirm(): void {
    this.isModalOpen.set(false);
    this.modalConfig.set(null);
    this.resolvePromise?.(true);
    this.resolvePromise = undefined;
  }

  /**
   * Manejador cuando el usuario cancela la acción
   */
  onCancel(): void {
    this.isModalOpen.set(false);
    this.modalConfig.set(null);
    this.resolvePromise?.(false);
    this.resolvePromise = undefined;
  }
}
