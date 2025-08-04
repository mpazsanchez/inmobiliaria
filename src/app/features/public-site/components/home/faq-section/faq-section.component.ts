import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isOpen: boolean;
}

interface ValueProposition {
  icon: string;
  title: string;
  subtitle: string;
  image: string;
}

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq-section.component.html',
  styleUrl: './faq-section.component.scss'
})
export class FaqSectionComponent {

  // FAQ Items
  faqItems: FAQItem[] = [
    {
      id: 'faq1',
      question: '¿Cómo mejoran las láminas solares la eficiencia energética?',
      answer: 'Las láminas solares bloquean hasta el 97% de los rayos IR y UV, reduciendo significativamente el calor que ingresa por las ventanas. Esto permite un ahorro energético real del 30-50% en climatización, manteniendo ambientes más frescos sin necesidad de tanto aire acondicionado.',
      isOpen: true
    },
    {
      id: 'faq2',
      question: '¿Qué garantía ofrecen los instaladores certificados Glazing?',
      answer: 'Todos nuestros instaladores certificados Glazing Certified™ emiten garantías oficiales verificables con código QR. Incluye respaldo técnico de la empresa, registro en base de datos interna y soporte postventa prioritario con más de 30 años de experiencia en el rubro.',
      isOpen: false
    },
    {
      id: 'faq3',
      question: '¿Las láminas afectan la visibilidad o la entrada de luz natural?',
      answer: 'No. Nuestras láminas arquitectónicas están diseñadas para mantener la privacidad durante el día sin perder luz natural. Reducen deslumbramientos y reflejos molestos, mejorando el confort visual mientras mantienen la claridad de las ventanas.',
      isOpen: false
    },
    {
      id: 'faq4',
      question: '¿Cuánto tiempo toma la instalación y cuál es el proceso?',
      answer: 'La instalación típica se completa en 1-2 días dependiendo del tamaño del proyecto. Nuestros técnicos certificados realizan una evaluación previa, medición exacta, y aplicación profesional con herramientas especializadas. Incluye capacitación en trabajos en altura y seguro de cobertura.',
      isOpen: false
    }
  ];

  // Value Propositions
  valuePropositions: ValueProposition[] = [
    {
      icon: 'fas fa-lightbulb',
      title: 'Te Ofrecemos el',
      subtitle: 'Mejor Diseño de Soluciones',
      image: './assets/images/backgrounds/solarcheck/slide-1.jpg'
    },
    {
      icon: 'fas fa-users',
      title: 'Contamos con',
      subtitle: 'Equipo de Ingenieros Cualificados',
      image: './assets/images/backgrounds/solarcheck/slide-2.jpg'
    }
  ];

  toggleFAQ(faqId: string): void {
    this.faqItems = this.faqItems.map(item => ({
      ...item,
      isOpen: item.id === faqId ? !item.isOpen : false
    }));
  }

  trackByFaqId(index: number, item: FAQItem): string {
    return item.id;
  }

  trackByTitle(index: number, item: ValueProposition): string {
    return item.title;
  }

}
