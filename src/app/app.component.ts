import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { ConfirmModalComponent } from './shared/components/admin/confirm-modal/confirm-modal.component';
import { UnsavedChangesService } from './core/services/unsaved-changes.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent, ConfirmModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Fairway';
  
  // Inyectar servicio para acceso desde el template
  unsavedChangesService = inject(UnsavedChangesService);
}
