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
      name: 'Solar Films Installation',
      percentage: 95
    },
    {
      name: 'Professional Training',
      percentage: 90
    },
    {
      name: 'Quality Materials',
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
    title: 'Transforma Ventanas con Láminas Solares Profesionales',
    subtitle: 'ACERCA DE LA EMPRESA',
    description: 'Glazing ofrece láminas solares premium y servicios de instalación profesional. Nuestra plataforma conecta instaladores certificados con materiales de calidad y capacitación integral. Con Glazing, hacemos tus ventanas más eficientes, protectoras y atractivas.',
    ctaText: 'DESCUBRE MÁS'
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
