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
    { label: 'Dashboard', route: '/member-area/dashboard' },
    { label: 'Capacitación', route: '/member-area/training' },
    // Puedes agregar más items aquí
  ]);
}
