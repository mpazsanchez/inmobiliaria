import { Component } from '@angular/core';
import { PublicNavbarComponent } from "./components/public-navbar/public-navbar.component";
import { PublicFooterComponent } from "./components/public-footer/public-footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [PublicNavbarComponent, PublicFooterComponent, RouterOutlet],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent {}
