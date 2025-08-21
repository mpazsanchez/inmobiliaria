import { Component } from '@angular/core';
import { Certification } from '../../models/certification.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-certifications',
  standalone: true,
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.scss'],
  imports: [FormsModule]
})
export class CertificationsComponent {
  userLevel = 'Nivel 2 – Instalador en formación'; // Simulación, debería venir del usuario
  certifications: Certification[] = [
    {
      id: 'cert1',
      name: 'Certificado de Polarizado Automotriz',
      description: 'Certificación oficial tras completar la formación en polarizado automotriz.',
      status: 'completado',
      dateCompleted: '2025-08-21',
      certificateUrl: '#'
    }
    // ...más certificaciones si aplica
  ];
  canApply = true; // Simulación, depende del progreso real
  application = {
    motivation: '',
    experience: ''
  };

  submitApplication() {
    // Aquí iría la lógica real de postulación (API, validaciones, etc.)
    alert('¡Postulación enviada! Nos contactaremos contigo pronto.');
    this.canApply = false;
  }
}
