import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  progress: number;
  duration: number; // en horas
  status: 'in-progress' | 'completed' | 'not-started';
}

@Component({
  selector: 'app-training-catalog',
  standalone: true,
  templateUrl: './training-catalog.component.html',
  styleUrls: ['./training-catalog.component.scss']
})
export class TrainingCatalogComponent {
  private router = inject(Router);
  search = signal('');
  filter = signal<'all' | 'in-progress' | 'completed'>('all');
  courses = signal<Course[]>([
    {
      id: '1',
      title: 'Polarizado Automotriz',
      description: 'Aprende a polarizar autos como un profesional. Incluye técnicas, materiales y casos reales.',
      image: 'assets/images/backgrounds/image-13.jpg',
      progress: 40,
      duration: 6,
      status: 'in-progress'
    },
    {
      id: '2',
      title: 'Instalación de Laminados Residenciales',
      description: 'Curso completo sobre instalación de laminados en viviendas y oficinas.',
      image: 'assets/images/backgrounds/bg-3.png',
      progress: 0,
      duration: 4,
      status: 'not-started'
    },
    {
      id: '3',
      title: 'Certificación en Seguridad',
      description: 'Todo sobre láminas de seguridad y normativas internacionales.',
      image: 'assets/images/backgrounds/bg-1.png',
      progress: 100,
      duration: 3,
      status: 'completed'
    }
  ]);

  filteredCourses = computed(() => {
    let list = this.courses();
    if (this.filter() !== 'all') {
      list = list.filter(c => c.status === this.filter());
    }
    if (this.search().trim()) {
      const term = this.search().toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(term) || c.description.toLowerCase().includes(term));
    }
    return list;
  });

  onSearch(e: Event) {
    this.search.set((e.target as HTMLInputElement).value);
  }
  onFilter(e: Event) {
    this.filter.set((e.target as HTMLSelectElement).value as any);
  }
  goToCourse(id: string) {
    this.router.navigate(['/member-area/training', id]);
  }
}
