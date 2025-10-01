import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-section.component.html',
  styleUrl: './experience-section.component.scss',
})
export class ExperienceSectionComponent {
  @Input() showCertification?: boolean = true;
  @Input() showCta?: boolean = true;
  @Input() isAboutComponent?: boolean = false;
  @Input() showClients?: boolean = false;

  @Input() experienceData?: any = {};

  onRequestConsultation() {
    if (typeof window !== 'undefined') {
      window.location.href = '/contact';
    }
  }
}
