import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-benefits-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './benefits-section.component.html',
  styleUrl: './benefits-section.component.scss'
})
export class BenefitsSectionComponent {
  
  problemsAndSolutions = {
    headline: "¿El calor entra a través de los ventanales?",
    subheadline: "La mayoría de las personas no saben que hay una solución mejor.",
    problems: [
      {
        icon: "fas fa-sun",
        question: "¿El calor entra a través de los ventanales?",
        description: "El sol directo puede aumentar la temperatura interior significativamente"
      },
      {
        icon: "fas fa-eye-slash",
        question: "¿Tus cortinas no alcanzan a bloquear el sol?",
        description: "Las cortinas tradicionales no ofrecen protección completa"
      },
      {
        icon: "fas fa-dollar-sign",
        question: "¿Pagás de más en climatización?",
        description: "El aire acondicionado trabaja más para compensar el calor"
      },
      {
        icon: "fas fa-lock",
        question: "¿Perdés privacidad o tenés que cerrar todo?",
        description: "Necesitas privacidad sin sacrificar la luz natural"
      }
    ],
    solution: {
      title: "Las láminas solares arquitectónicas de Glazing son la evolución.",
      subtitle: "Más de 20 años protegiendo hogares y empresas con tecnología que se ve… y se siente.",
      benefits: [
        {
          icon: "fas fa-shield-alt",
          text: "Bloqueo solar hasta el 97% (rayos IR y UV)",
          highlight: "97%"
        },
        {
          icon: "fas fa-leaf",
          text: "Ahorro energético real: menos aire acondicionado",
          highlight: "Ahorro real"
        },
        {
          icon: "fas fa-eye",
          text: "Privacidad durante el día sin perder luz natural",
          highlight: "Privacidad"
        },
        {
          icon: "fas fa-ban",
          text: "Reducción de deslumbramientos y reflejos",
          highlight: "Sin reflejos"
        },
        {
          icon: "fas fa-palette",
          text: "Mejora estética moderna y minimalista",
          highlight: "Estética"
        },
        {
          icon: "fas fa-couch",
          text: "Protección de muebles, pisos y artefactos",
          highlight: "Protección"
        }
      ]
    },
    cta: {
      primary: "Quiero mi presupuesto gratuito",
      secondary: "Quiero saber cuánto cuesta instalarlo en mi casa"
    }
  };

  onRequestQuote() {
    // Lógica para solicitar presupuesto
    console.log('Solicitar presupuesto');
  }

  onGetPricing() {
    // Lógica para obtener precios
    console.log('Obtener precios');
  }
}
