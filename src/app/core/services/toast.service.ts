import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  
  toast$ = this.toastSubject.asObservable();

  success(message: string, duration: number = 3000) {
    this.show({
      type: 'success',
      message,
      duration,
      id: this.generateId()
    });
  }

  error(message: string, duration: number = 5000) {
    this.show({
      type: 'error',
      message,
      duration,
      id: this.generateId()
    });
  }

  warning(message: string, duration: number = 4000) {
    this.show({
      type: 'warning',
      message,
      duration,
      id: this.generateId()
    });
  }

  info(message: string, duration: number = 3000) {
    this.show({
      type: 'info',
      message,
      duration,
      id: this.generateId()
    });
  }

  private show(toast: ToastMessage) {
    this.toastSubject.next(toast);
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
