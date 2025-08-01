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
      question: '¿Qué tipos de láminas solares ofrecen y cuál es mejor para mi vehículo?',
      answer: 'Ofrecemos láminas cerámicas, metalizadas y nanotecnológicas. Para vehículos recomendamos láminas cerámicas que no interfieren con señales electrónicas y ofrecen excelente rechazo de calor y protección UV.',
      isOpen: false
    },
    {
      id: 'faq3',
      question: '¿Cuál es el propósito de la formación profesional en Glazing?',
      answer: 'Nuestro programa de formación certifica instaladores profesionales con técnicas avanzadas, acceso a materiales premium y soporte técnico continuo. Los certificados obtienen clientes referidos y forman parte de nuestra red oficial.',
      isOpen: false
    },
    {
      id: 'faq4',
      question: '¿Puedo tener éxito en esta plataforma con mi experiencia actual?',
      answer: 'Sí, Glazing está diseñado para profesionales de todos los niveles. Desde principiantes que buscan formación hasta expertos que quieren acceder a materiales premium y ampliar su red de clientes.',
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
