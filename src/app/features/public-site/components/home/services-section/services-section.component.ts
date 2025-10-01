import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services-section.component.html',
  styleUrl: './services-section.component.scss'
})
export class ServicesSectionComponent {
  @Input() sectionInfo: { subtitle: string; title: string } = { subtitle: '', title: '' };
  @Input() services: ServiceItem[] = [];

  onExploreService(serviceLink: string): void {
    // Navegar a la página del servicio
    if (typeof window !== 'undefined') {
      window.location.assign(serviceLink);
    }
  }

  trackByTitle(index: number, item: ServiceItem): string {
    return item.title;
  }

}
