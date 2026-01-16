import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Beneficio {
  icono: string;
  titulo: string;
  descripcion: string;
}

interface Testimonio {
  nombre: string;
  ubicacion: string;
  texto: string;
  fotoUrl: string;
}

@Component({
  selector: 'app-why-fairway',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './why-fairway.component.html',
  styleUrl: './why-fairway.component.scss'
})
export class WhyFairwayComponent {
  beneficios: Beneficio[] = [
    {
      icono: 'shield-check',
      titulo: 'Confianza y Seguridad',
      descripcion: 'Más de 12 años de experiencia en el mercado inmobiliario garantizan operaciones seguras y transparentes.'
    },
    {
      icono: 'users',
      titulo: 'Equipo Profesional',
      descripcion: 'Asesores especializados comprometidos en encontrar la propiedad perfecta para cada cliente.'
    },
    {
      icono: 'home',
      titulo: 'Amplio Portfolio',
      descripcion: 'Miles de propiedades en venta y alquiler en las mejores ubicaciones de la región'
    },
    {
      icono: 'headset',
      titulo: 'Atención Personalizada',
      descripcion: 'Acompañamiento en cada paso del proceso, desde la búsqueda hasta la firma del contrato.'
    },
    {
      icono: 'trending-up',
      titulo: 'Mejor Valorización',
      descripcion: 'Tasaciones precisas basadas en estudios de mercado para maximizar tu inversión.'
    },
    {
      icono: 'clock',
      titulo: 'Respuesta Rápida',
      descripcion: 'Atención inmediata a consultas y coordinación ágil de visitas a propiedades.'
    }
  ];

  testimonios: Testimonio[] = [
    {
      nombre: 'María Fernández',
      ubicacion: 'Palermo, Buenos Aires',
      texto: 'Excelente experiencia con Fairway. Encontraron el departamento perfecto para mi familia en tiempo récord. El asesor fue muy profesional y atento a nuestras necesidades.',
      fotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      nombre: 'Carlos Martínez',
      ubicacion: 'Belgrano, Buenos Aires',
      texto: 'Vendí mi casa en menos de un mes gracias a la gestión de Fairway. La tasación fue justa y todo el proceso fue transparente. Totalmente recomendados.',
      fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      nombre: 'Laura González',
      ubicacion: 'Recoleta, Buenos Aires',
      texto: 'Como primera compradora estaba nerviosa, pero el equipo de Fairway me guió en cada paso. Ahora tengo mi primer hogar propio y no podría estar más feliz.',
      fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
    }
  ];
}
