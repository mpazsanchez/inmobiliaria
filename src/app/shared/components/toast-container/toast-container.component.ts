import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastContainerComponent implements OnInit {
  private toastService = inject(ToastService);
  
  toasts: ToastMessage[] = [];

  ngOnInit() {
    this.toastService.toast$.subscribe(toast => {
      this.toasts.push(toast);

      // Auto-remove después de la duración especificada
      setTimeout(() => {
        this.removeToast(toast.id!);
      }, toast.duration);
    });
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getIcon(type: string): string {
    const icons = {
      success: 'icon-check-circle',
      error: 'icon-x-circle',
      warning: 'icon-alert-triangle',
      info: 'icon-info'
    };
    return icons[type as keyof typeof icons] || 'icon-info';
  }
}
