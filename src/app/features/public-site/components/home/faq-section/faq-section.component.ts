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
      question: '¿Se pueden instalar en vidrios ya colocados?',
      answer: 'Sí, totalmente. Las láminas solares Glazing están diseñadas para aplicarse directamente sobre cristales existentes, sin necesidad de obras ni reemplazo de ventanas.',
      isOpen: true
    },
    // {
    //   id: 'faq2',
    //   question: '¿Qué tan efectivas son contra el calor?',
    //   answer: 'Nuestras láminas de tecnología nano cerámica y carbono avanzado bloquean hasta el 97% de la radiación infrarroja (IR), reduciendo significativamente la temperatura interior y mejorando el confort térmico.',
    //   isOpen: false
    // },
    {
      id: 'faq3',
      question: '¿Pierdo visibilidad desde adentro hacia afuera?',
      answer: 'No. Las láminas están diseñadas para mantener la visibilidad desde el interior, incluso en modelos con alto nivel de privacidad. Usted ve hacia afuera, pero desde afuera no ven hacia adentro (en condiciones de luz natural).',
      isOpen: false
    },
    // {
    //   id: 'faq4',
    //   question: '¿Cuánto ahorro en energía?',
    //   answer: 'Según el tipo de vidrio y la exposición solar, se puede lograr un ahorro de hasta el 30% en consumo de aire acondicionado o climatización, al reducir la carga térmica que entra por los vidrios.',
    //   isOpen: false
    // },
    {
      id: 'faq5',
      question: '¿Requieren mantenimiento?',
      answer: 'No. Las láminas Glazing no requieren mantenimiento especial. Solo limpieza normal de vidrios, sin productos abrasivos. Son resistentes al desgaste, al sol y al paso del tiempo.',
      isOpen: false
    },
    {
      id: 'faq6',
      question: '¿Tienen garantía?',
      answer: 'Sí. Ofrecemos garantía escrita de hasta 10 años, dependiendo del modelo instalado. Nuestra garantía cubre decoloración, burbujas, despegue o pérdida de propiedades ópticas.',
      isOpen: false
    },
    {
      id: 'faq7',
      question: '¿Cuánto demora la instalación?',
      answer: 'Depende de la superficie y cantidad de ventanas. En la mayoría de los casos, se realiza en una sola jornada laboral, sin necesidad de vaciar completamente el ambiente ni realizar obras.',
      isOpen: false
    },
    {
      id: 'faq8',
      question: '¿Quién realiza la instalación?',
      answer: 'Solo personal certificado Glazing Certified™, con toda la documentación legal, seguros, formación técnica y protocolo de seguridad para ingresar a hogares y empresas con total profesionalismo.',
      isOpen: false
    },
    // {
    //   id: 'faq9',
    //   question: '¿Qué tipos de láminas ofrecen?',
    //   answer: 'Ofrecemos 4 tipos principales: Láminas de Protección Solar (control térmico), Láminas de Privacidad (diferentes niveles de opacidad), Láminas de Seguridad (refuerzo de vidrios) y Láminas Decorativas (personalización estética).',
    //   isOpen: false
    // },
    // {
    //   id: 'faq10',
    //   question: '¿Cuál es el nivel de protección UV?',
    //   answer: 'Nuestras láminas bloquean hasta el 99% de los rayos UV dañinos, protegiendo tanto a las personas como a los interiores de la decoloración y el deterioro causado por la exposición solar.',
    //   isOpen: false
    // },
    // {
    //   id: 'faq11',
    //   question: '¿Se pueden aplicar en vidrios temperados o laminados?',
    //   answer: 'Sí, nuestras láminas son compatibles con todo tipo de vidrios: float, temperado, laminado, doble vidriado hermético (DVH), y vidrios con tratamientos especiales. Cada aplicación se evalúa técnicamente.',
    //   isOpen: false
    // }
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
