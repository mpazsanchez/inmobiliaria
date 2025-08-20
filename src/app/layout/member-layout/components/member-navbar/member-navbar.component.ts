import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-member-navbar',
  standalone: true,
  templateUrl: './member-navbar.component.html',
  styleUrls: ['./member-navbar.component.scss']
})
export class MemberNavbarComponent {
  @Input() user: any;
  @Output() logout = new EventEmitter<void>();
  isMenuCollapsed = true;

  toggleMobileMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
}
