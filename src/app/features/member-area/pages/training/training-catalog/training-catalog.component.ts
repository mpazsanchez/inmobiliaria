import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training-catalog',
  standalone: true,
  templateUrl: './training-catalog.component.html',
  styleUrls: ['./training-catalog.component.scss']
})
export class TrainingCatalogComponent {
  private router = inject(Router);
  courses = signal([
    {
      id: '1',
      title: 'Polarizado Automotriz',
      description: 'Aprende a polarizar autos como un profesional. Incluye técnicas y materiales.',
      image: 'assets/images/backgrounds/image-13.jpg',
      progress: 40
    },
    {
      id: '2',
      title: 'Instalación de Laminados Residenciales',
      description: 'Curso completo sobre instalación de laminados en viviendas y oficinas.',
      image: 'assets/images/backgrounds/bg-3.png',
      progress: 0
    },
    {
      id: '3',
      title: 'Certificación en Seguridad',
      description: 'Todo sobre láminas de seguridad y normativas internacionales.',
      image: 'assets/images/backgrounds/bg-1.png',
      progress: 100
    }
  ]);

  goToCourse(id: string) {
    this.router.navigate(['/member-area/training', id]);
  }
}
