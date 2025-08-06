import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutHeroComponent } from "../../components/about/about-hero/about-hero.component";
import { ClientsTestimonialsComponent } from "../../components/about/clients-testimonials/clients-testimonials.component";
import { ExperienceSectionComponent } from "../../components/home/experience-section/experience-section.component";
import { ProductsTechnologyComponent } from "../../components/products/products-technology/products-technology.component";

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, AboutHeroComponent, ClientsTestimonialsComponent, ExperienceSectionComponent, ProductsTechnologyComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  experienceData?: any = {
    stats: {
      works: '4.000+',
      years: '30+',
      coverage: 'Todo el país',
    },
    company: {
      title: 'Brindamos soluciones seguras, estéticas y duraderas',
      subtitle:
        'Con una larga trayectoria en el rubro y un profundo compromiso con la calidad y la satisfacción de cada cliente.',
      description:
        'Con más de 30 años de presencia en el mercado, en Glazing nos hemos consolidado como una empresa líder en el asesoramiento, venta e instalación de láminas de control solar para automóviles y arquitectura. Nuestro equipo está conformado por técnicos altamente capacitados, con una larga trayectoria en el rubro y un profundo compromiso con la calidad y la satisfacción de cada cliente.',
    },
    certification: {
      title: 'Glazing Certified™',
      subtitle:
        'En Glazing trabajamos exclusivamente con instaladores certificados bajo nuestro sello Glazing Certified™, lo que garantiza un servicio profesional, seguro y de alta calidad.',
      features: [
        {
          icon: 'fas fa-graduation-cap',
          title: 'Capacitaciones técnicas actualizadas',
          description: 'Formación continua en las últimas tecnologías',
        },
        {
          icon: 'fas fa-hard-hat',
          title: 'Certificación en trabajos en altura',
          description: 'Seguridad garantizada en instalaciones complejas',
        },
        {
          icon: 'fas fa-shield-alt',
          title: 'Cobertura de seguros correspondiente',
          description: 'Protección completa para instalador y cliente',
        },
        {
          icon: 'fas fa-file-contract',
          title: 'Documentación formal y habilitaciones laborales',
          description: 'Cumplimiento total de normativas legales',
        },
      ],
    },
    gallery: [
      {
        title: 'Laminas selectivo Las Delicias',
        image: './assets/images/backgrounds/solarcheck/slide-1.jpg',
      }
    ]
  };
}
