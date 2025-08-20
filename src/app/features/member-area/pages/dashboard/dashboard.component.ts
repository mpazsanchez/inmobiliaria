import { Component, Input, signal } from '@angular/core';
import { MemberSidebarComponent } from '../../components/member-sidebar/member-sidebar.component';
import { DashboardCardComponent } from '../../components/dashboard-card/dashboard-card.component';
import { InstallerFormComponent } from '../../components/installer-form/installer-form.component';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MemberSidebarComponent, DashboardCardComponent, InstallerFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @Input() user: any;
  private authService = inject(AuthService);
  showInstallerForm = false;

  upgradeToInstaller(motivo: string) {
    // Simulación de post a API fake
    // Aquí podrías usar un servicio para enviar el motivo
    // Por ahora solo actualiza el rol
    this.authService.upgradeToInstaller();
    this.showInstallerForm = false;
  }
}
