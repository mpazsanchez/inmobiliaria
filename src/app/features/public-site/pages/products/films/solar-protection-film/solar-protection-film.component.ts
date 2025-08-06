import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProductFeature {
  icon: string;
  title: string;
  description: string;
}

interface TechnicalSpec {
  property: string;
  value: string;
  unit?: string;
}

interface Challenge {
  question: string;
  answer: string;
  isOpen: boolean;
}

interface FilmType {
  name: string;
  description: string;
  uvProtection: string;
  irReduction: string;
  solarEnergyRejection: string;
  finish: string;
  keyBenefits: string[];
}

@Component({
  selector: 'app-solar-protection-film',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solar-protection-film.component.html',
  styleUrl: './solar-protection-film.component.scss'
})
export class SolarProtectionFilmComponent {

  // Tipos de láminas solares disponibles
  filmTypes: FilmType[] = [
    {
      name: 'Láminas Espejadas Plata',
      description: 'Solución eficaz para reducir el calor con acabado reflectante que proporciona privacidad. Permiten visión clara hacia el exterior desde el interior, pero impiden que se vea desde afuera.',
      uvProtection: '99%',
      irReduction: '82%',
      solarEnergyRejection: '74%',
      finish: 'Espejo plata',
      keyBenefits: [
        'Privacidad unidireccional',
        'Reducción significativa del calor',
        'Protección contra desgaste de muebles',
        'Acabado reflectante elegante'
      ]
    },
    {
      name: 'Láminas Nano Cerámicas Negras',
      description: 'Solución avanzada y estética para espacios modernos con aberturas de aluminio y madera. Ofrecen un acabado elegante y sofisticado con alto nivel de protección.',
      uvProtection: '99%',
      irReduction: '80%',
      solarEnergyRejection: '79%',
      finish: 'Tonalidades claro/intermedio/oscuro',
      keyBenefits: [
        'Estética moderna que complementa aberturas',
        'Reducción significativa del deslumbramiento',
        'Filtrado avanzado de rayos infrarrojos',
        'Mejora el diseño arquitectónico'
      ]
    },
    {
      name: 'Láminas Selectivas Transparentes',
      description: 'Completamente transparentes, ideales para mantener la estética original de los cristales sin alterar la apariencia natural de las ventanas.',
      uvProtection: '99%',
      irReduction: '95%',
      solarEnergyRejection: '45%',
      finish: 'Transparente',
      keyBenefits: [
        'Preserva la estética original',
        'No altera la apariencia de los cristales',
        'Máxima reducción de rayos infrarrojos',
        'Ideal para diseños arquitectónicos específicos'
      ]
    }
  ];

  productFeatures: ProductFeature[] = [
    {
      icon: 'fas fa-thermometer-half',
      title: 'Control Térmico Superior',
      description: 'Reducción de hasta 82% del calor infrarrojo, manteniendo ambientes frescos y confortables durante el verano.'
    },
    {
      icon: 'fas fa-eye-slash',
      title: 'Privacidad y Estética',
      description: 'Opciones desde completamente transparentes hasta espejadas que brindan privacidad unidireccional.'
    },
    {
      icon: 'fas fa-bolt',
      title: 'Ahorro Energético',
      description: 'Reducción significativa en costos de refrigeración al disminuir la dependencia del aire acondicionado.'
    },
    {
      icon: 'fas fa-shield-virus',
      title: 'Protección UV 99%',
      description: 'Bloquea rayos ultravioleta dañinos en todos nuestros tipos de láminas, protegiendo personas y mobiliario.'
    }
  ];

  technicalSpecs: TechnicalSpec[] = [
    { property: 'Protección UV', value: '99', unit: '%' },
    { property: 'Reducción rayos infrarrojos', value: '80-95', unit: '%' },
    { property: 'Energía solar rechazada', value: '45-79', unit: '%' },
    { property: 'Tipos disponibles', value: '3', unit: 'opciones' },
    { property: 'Garantía', value: '10', unit: 'años' },
    { property: 'Tiempo de instalación', value: '1', unit: 'día' }
  ];

  challenges: Challenge[] = [
    {
      question: '¿Cuál es la diferencia entre las láminas espejadas, nano cerámicas y selectivas?',
      answer: 'Las espejadas (74% rechazo solar) brindan privacidad con acabado reflectante. Las nano cerámicas (79% rechazo) ofrecen estética moderna para aberturas contemporáneas. Las selectivas (45% rechazo) son completamente transparentes, ideales para preservar la estética original.',
      isOpen: false
    },
    {
      question: '¿Todas las láminas protegen igual contra los rayos UV?',
      answer: 'Sí, todos nuestros tipos de láminas solares ofrecen una protección del 99% contra los rayos ultravioleta, protegiendo tanto a las personas como al mobiliario del deterioro.',
      isOpen: false
    },
    {
      question: '¿Las láminas transparentes realmente funcionan sin cambiar la apariencia?',
      answer: 'Absolutamente. Las láminas selectivas son completamente transparentes y bloquean el 95% de los rayos infrarrojos (los que generan calor) manteniendo la claridad visual y estética original.',
      isOpen: false
    },
    {
      question: '¿Qué tipo de lámina es mejor para mi hogar?',
      answer: 'Depende de tus necesidades: espejadas para máxima privacidad y control solar, nano cerámicas para estética moderna, o selectivas para mantener la apariencia original con excelente protección térmica.',
      isOpen: false
    },
    {
      question: '¿Cómo afectan al consumo energético?',
      answer: 'Todas nuestras láminas reducen significativamente el calor que ingresa, disminuyendo la dependencia del aire acondicionado y generando ahorros considerables en los costos de energía durante el verano.',
      isOpen: false
    }
  ];

  toggleChallenge(index: number): void {
    this.challenges = this.challenges.map((challenge, i) => ({
      ...challenge,
      isOpen: i === index ? !challenge.isOpen : false
    }));
  }

  trackByIndex(index: number): number {
    return index;
  }
}
