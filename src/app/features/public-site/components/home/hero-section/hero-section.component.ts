
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionData } from '../../../models/home-page.interface';
// import '../../../../../../assets/images/backgrounds/solarcheck/video-hero.mp4'

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  @Input() data?: HeroSectionData;

  get isVideo(): boolean {
    return !!this.data?.image && this.data.image.endsWith('.mp4');
  }
}
