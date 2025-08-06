import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar: string;
}

@Component({
  selector: 'app-clients-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients-testimonials.component.html',
  styleUrl: './clients-testimonials.component.scss'
})
export class ClientsTestimonialsComponent {
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'María González',
      position: 'Gerente de Operaciones',
      company: 'Construcciones del Valle',
      content: 'Glazing superó nuestras expectativas con su servicio profesional y productos de alta calidad. Su equipo demostró un compromiso excepcional en cada fase del proyecto.',
      avatar: 'assets/images/testimonials/avatar-1.jpg'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      position: 'Arquitecto Principal',
      company: 'Diseños Modernos SA',
      content: 'La calidad de los vidrios y la atención al detalle de Glazing es incomparable. Han sido nuestro socio estratégico en múltiples proyectos exitosos.',
      avatar: 'assets/images/testimonials/avatar-2.jpg'
    },
    {
      id: 3,
      name: 'Ana Patricia López',
      position: 'Directora de Proyectos',
      company: 'Inmobiliaria Premier',
      content: 'Trabajar con Glazing ha sido una experiencia excepcional. Su profesionalismo y innovación en soluciones de vidrio han transformado nuestros espacios.',
      avatar: 'assets/images/testimonials/avatar-3.jpg'
    }
  ];
}
