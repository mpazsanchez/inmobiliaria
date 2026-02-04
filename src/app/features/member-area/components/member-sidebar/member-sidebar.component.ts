import { Component, Input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-member-sidebar',
  standalone: true,
  templateUrl: './member-sidebar.component.html',
  styleUrls: ['./member-sidebar.component.scss'],
  imports: [RouterModule]
})
export class MemberSidebarComponent {
  @Input() user: any;
  menuItems = signal([
    { label: 'Dashboard', route: '/member-area/dashboard', icon: 'bi bi-house' },
    { label: 'Mi Perfil', route: '/member-area/profile', icon: 'bi bi-person' },
    { label: 'Propiedades', route: '/member-area/propiedades', icon: 'bi bi-building' },
    { label: 'Usuarios', route: '/member-area/usuarios', icon: 'bi bi-people' },
    { label: 'Consultas', route: '/member-area/consultas', icon: 'bi bi-envelope' },
    { label: 'Contenido Dinámico', route: '/member-area/contenido', icon: 'bi bi-layout-text-sidebar' },
    { label: 'Páginas Estáticas', route: '/member-area/paginas-estaticas', icon: 'bi bi-file-text' }
  ]);
}
