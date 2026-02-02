import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { ConfirmModalComponent } from './shared/components/admin/confirm-modal/confirm-modal.component';
import { UnsavedChangesService } from './core/services/unsaved-changes.service';
import { AuthService } from './features/member-area/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent, ConfirmModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Fairway';
  
  // Inyectar servicio para acceso desde el template
  unsavedChangesService = inject(UnsavedChangesService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    // Restaurar sesión desde localStorage al iniciar la app
    this.authService.restaurarSesion();
  }
}
