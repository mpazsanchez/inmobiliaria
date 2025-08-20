import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MemberNavbarComponent } from './components/member-navbar/member-navbar.component';
import { AuthService } from '../../features/member-area/services/auth.service';

@Component({
  selector: 'app-member-layout',
  standalone: true,
  templateUrl: './member-layout.component.html',
  styleUrls: ['./member-layout.component.scss'],
  imports: [RouterOutlet, MemberNavbarComponent]
})
export class MemberLayoutComponent {
  private authService = new AuthService();
  user = this.authService.getUser();

  onLogout() {
    this.authService.logout();
    window.location.href = '/member-area/login';
  }
}
