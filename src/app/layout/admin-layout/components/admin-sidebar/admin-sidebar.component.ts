import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../../features/member-area/services/auth.service';
import { MenuService, MenuItem } from '../../../../features/member-area/services/menu.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  private authService = inject(AuthService);
  private menuService = inject(MenuService);

  // Menu items cargados desde JSON/API
  menuItems = signal<MenuItem[]>([]);
  isLoadingMenu = signal(true);

  // Usuario actual
  usuario = this.authService.getUsuario();

  ngOnInit(): void {
    this.loadMenu();
  }

  /**
   * Carga el menu desde el servicio (JSON o API segun configuracion)
   */
  private loadMenu(): void {
    const rol = this.usuario?.rol || 'asesor';

    this.menuService.getMenuByRole(rol).subscribe({
      next: (items) => {
        // Ordenar por campo 'orden'
        const sortedItems = items.sort((a, b) => a.orden - b.orden);
        this.menuItems.set(sortedItems);
        this.isLoadingMenu.set(false);
      },
      error: (err) => {
        console.error('Error cargando menu:', err);
        this.isLoadingMenu.set(false);
      }
    });
  }

  onToggle(): void {
    this.toggleCollapse.emit();
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/member-area/login';
  }
}
