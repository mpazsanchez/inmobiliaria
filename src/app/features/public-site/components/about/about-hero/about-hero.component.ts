
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-hero.component.html',
  styleUrl: './about-hero.component.scss'
})
export class AboutHeroComponent {
  @Input() companyInfo: any;
  // Componente hero para la página About Us
}
