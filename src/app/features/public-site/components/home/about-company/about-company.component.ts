import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CompanyStats {
  value: number;
  label: string;
  unit?: string;
}

interface SkillProgress {
  name: string;
  percentage: number;
}

@Component({
  selector: 'app-about-company',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-company.component.html',
  styleUrl: './about-company.component.scss'
})
export class AboutCompanyComponent {

  // Estadísticas de la empresa
  companyStats: CompanyStats[] = [
    {
      value: 8,
      label: 'YEARS\nWORKING\nEXPERIENCE',
      unit: ''
    }
  ];

  // Habilidades/servicios con porcentajes
  skills: SkillProgress[] = [
    {
      name: 'Instalación de Láminas Solares',
      percentage: 95
    },
    {
      name: 'Formación Profesional',
      percentage: 90
    },
    {
      name: 'Materiales de Calidad',
      percentage: 98
    }
  ];

  // Información de contacto
  contactInfo = {
    phone: '+34 123 456 789',
    description: '¿Tienes algún proyecto en mente? Llámanos:'
  };

  // Información de la empresa
  companyInfo = {
    title: 'Conectamos Tu Proyecto con Instaladores Certificados',
    subtitle: 'ACERCA DE GLAZING',
    description: 'Glazing es la plataforma líder que conecta clientes con instaladores certificados de láminas solares. Garantizamos calidad, respaldo técnico y los mejores materiales para transformar tus espacios con máximo ahorro energético.',
    ctaText: 'SOLICITAR PRESUPUESTO'
  };

  // CEO/Fundador info
  founderInfo = {
    name: 'Glazing Team',
    signature: 'Glazing™',
    photo: './assets/images/team/founder.jpg' // Placeholder
  };

  onDiscoverMore(): void {
    // Navigate to about page or services
    console.log('Navigate to company info');
  }

  onCallPhone(): void {
    window.open(`tel:${this.contactInfo.phone}`, '_self');
  }

}
