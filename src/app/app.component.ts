import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
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
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);
  private destroyRef = inject(DestroyRef);

  private readonly defaultTitle = 'Fairway Inmobiliaria';

  ngOnInit(): void {
    // Restaurar sesión desde localStorage al iniciar la app
    this.authService.restaurarSesion();

    // Actualizar título de la página en cada navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        // Navegar hasta la ruta hija más profunda
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(data => {
      const pageTitle = data['title'] || this.defaultTitle;
      this.titleService.setTitle(pageTitle);
    });
  }
}
