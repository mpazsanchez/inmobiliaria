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
    // Navigate to specific service page
    console.log('Navigate to service:', serviceLink);
  }

  trackByTitle(index: number, item: ServiceItem): string {
    return item.title;
  }

}
