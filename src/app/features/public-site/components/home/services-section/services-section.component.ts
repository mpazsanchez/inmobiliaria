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
    title: 'Soluciones de Láminas Solares para Tu Hogar y Negocio'
  };

  services: ServiceItem[] = [
    {
      icon: 'fas fa-home',
      title: 'Láminas Residenciales',
      description: 'Reduce hasta un 80% del calor solar en tu hogar. Ahorra en climatización y mejora el confort de tu familia con instalación profesional garantizada.',
      link: 'residential'
    },
    {
      icon: 'fas fa-building',
      title: 'Soluciones Comerciales',
      description: 'Mejora la eficiencia energética de tu oficina o local comercial. Instaladores certificados en toda España para proyectos corporativos.',
      link: 'commercial'
    },
    {
      icon: 'fas fa-car',
      title: 'Polarizado Vehicular',
      description: 'Protege tu vehículo del calor y rayos UV. Instalación profesional con garantía oficial y materiales premium de última generación.',
      link: 'automotive'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Garantía y Soporte',
      description: 'Respaldo técnico completo con instaladores certificados Glazing. Garantía oficial verificable y soporte postventa especializado.',
      link: 'warranty'
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
