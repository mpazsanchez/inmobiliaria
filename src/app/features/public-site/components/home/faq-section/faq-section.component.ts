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
      question: '¿Cómo puedo mejorar la eficiencia energética de mi hogar u oficina?',
      answer: 'Las láminas solares para ventanas son una de las formas más efectivas de reducir el consumo energético. Nuestras láminas pueden reducir hasta un 80% del calor solar, manteniendo la temperatura interior más estable y reduciendo significativamente los costos de climatización.',
      isOpen: true
    },
    {
      id: 'faq2',
      question: '¿Cómo encuentro un instalador certificado Glazing cerca de mi ubicación?',
      answer: 'Nuestra plataforma conecta automáticamente con el instalador certificado más cercano a tu zona. Solo necesitas solicitar un presupuesto y te derivaremos al profesional disponible con garantía oficial.',
      isOpen: false
    },
    {
      id: 'faq3',
      question: '¿Qué garantía tienen las instalaciones de láminas solares?',
      answer: 'Todos nuestros instaladores certificados emiten garantías oficiales Glazing verificables con código QR. Incluye respaldo técnico, registro en base de datos y soporte postventa prioritario.',
      isOpen: false
    },
    {
      id: 'faq4',
      question: '¿Cuánto puedo ahorrar en mi factura energética con láminas solares?',
      answer: 'Dependiendo del tipo de ventanas y exposición solar, los clientes reportan ahorros del 30-50% en costos de climatización. El retorno de inversión típico es de 2-3 años.',
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
