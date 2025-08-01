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
    description: 'Do you have any project on your mind? Call Us:'
  };

  // Información de la empresa
  companyInfo = {
    title: 'Transform Windows with Professional Solar Films',
    subtitle: 'ABOUT COMPANY',
    description: 'Glazing features premium solar films and professional installation services. Our platform connects certified installers with quality materials and comprehensive training. With Glazing, we make your windows more efficient, protective, and attractive.',
    ctaText: 'DISCOVER MORE'
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
