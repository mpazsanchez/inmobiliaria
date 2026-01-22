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
    { label: 'Capacitacion', route: '/member-area/training', icon: 'bi bi-mortarboard' },
    { label: 'Certificaciones', route: '/member-area/certificaciones', icon: 'bi bi-patch-check' },
  ]);
}
