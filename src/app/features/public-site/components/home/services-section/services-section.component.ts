import { Component } from '@angular/core';
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

  sectionInfo = {
    subtitle: 'NUESTROS SERVICIOS',
    title: 'Servicios Profesionales de Láminas Solares'
  };

  services: ServiceItem[] = [
    {
      icon: 'fas fa-car',
      title: 'Polarizado Automotriz',
      description: 'Instalación profesional de láminas solares para vehículos con garantía extendida y materiales premium de alta calidad.',
      link: 'automotive'
    },
    {
      icon: 'fas fa-building',
      title: 'Láminas Arquitectónicas',
      description: 'Soluciones de control solar para edificios residenciales y comerciales que mejoran eficiencia energética y confort.',
      link: 'architectural'
    },
    {
      icon: 'fas fa-graduation-cap',
      title: 'Formación Profesional',
      description: 'Cursos de capacitación técnica para instaladores con certificación oficial y acceso a grupo exclusivo de profesionales.',
      link: 'training'
    },
    {
      icon: 'fas fa-tools',
      title: 'Herramientas Especializadas',
      description: 'Venta de herramientas profesionales y materiales de primera calidad para instaladores certificados y distribuidores.',
      link: 'tools'
    }
  ];

  onExploreService(serviceLink: string): void {
    // Navigate to specific service page
    console.log('Navigate to service:', serviceLink);
  }

  trackByTitle(index: number, item: ServiceItem): string {
    return item.title;
  }

}
