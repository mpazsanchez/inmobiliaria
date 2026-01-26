import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../features/member-area/services/auth.service';
import { filter } from 'rxjs/operators';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminSidebarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Estado del sidebar en desktop (colapsado/expandido)
  sidebarCollapsed = false;

  // Estado del sidebar en móvil (abierto/cerrado)
  sidebarMobileOpen = false;

  usuario = this.authService.getUsuario();

  ngOnInit(): void {
    this.authService.restaurarSesion();
    this.usuario = this.authService.getUsuario();

    // Cerrar sidebar móvil al navegar
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMobileSidebar();
      });
  }

  // Detectar cambio de tamaño de ventana
  @HostListener('window:resize')
  onResize(): void {
    // Si la ventana es grande, cerrar el sidebar móvil
    if (window.innerWidth > 1024) {
      this.sidebarMobileOpen = false;
    }
  }

  // Toggle para desktop (colapsar/expandir)
  toggleSidebarCollapse(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // Toggle para móvil (abrir/cerrar)
  toggleMobileSidebar(): void {
    this.sidebarMobileOpen = !this.sidebarMobileOpen;
  }

  // Cerrar sidebar móvil
  closeMobileSidebar(): void {
    this.sidebarMobileOpen = false;
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/member-area/login';
  }
}
