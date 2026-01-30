import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesService {
  
  /**
   * Muestra un diálogo de confirmación cuando hay cambios sin guardar
   */
  confirmLeave(message?: string): boolean {
    const defaultMessage = '¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.';
    return window.confirm(message || defaultMessage);
  }

  /**
   * Verifica si un formulario tiene cambios sin guardar
   */
  hasUnsavedChanges(form: any, initialValue: any): boolean {
    if (!form) return false;
    
    // Compara el valor actual con el valor inicial
    const currentValue = form.value;
    return JSON.stringify(currentValue) !== JSON.stringify(initialValue);
  }
}
