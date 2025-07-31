import { Component } from '@angular/core';
import { PublicNavbarComponent } from "./components/public-navbar/public-navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [PublicNavbarComponent, RouterOutlet],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent {

}
