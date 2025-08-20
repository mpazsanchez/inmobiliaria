
import { Component, signal, computed } from '@angular/core';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SafeUrlPipe } from './safe-url.pipe';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
  imports: [SafeUrlPipe]
})
export class CourseDetailComponent {
  private route = inject(ActivatedRoute);
  // Simulación de datos de curso con capítulos y videos
  course = signal<any | null>({
    id: '1',
    title: 'Curso de Polarizado Automotriz',
    description: 'Aprende todo sobre el polarizado profesional de autos.',
    chapters: [
      { title: 'Introducción', videoUrl: 'https://www.youtube.com/embed/1Q8fG0TtVAY' },
      { title: 'Herramientas y materiales', videoUrl: 'https://www.youtube.com/embed/2Vv-BfVoq4g' },
      { title: 'Preparación del vehículo', videoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ' },
      { title: 'Aplicación de la lámina', videoUrl: 'https://www.youtube.com/embed/4k1E8T6hKjA' },
      { title: 'Errores comunes y soluciones', videoUrl: 'https://www.youtube.com/embed/5NV6Rdv1a3I' }
    ]
  });

  currentChapterIndex = signal(0);
  currentChapter = computed(() => {
    const c = this.course();
    return c && c.chapters ? c.chapters[this.currentChapterIndex()] : null;
  });

  selectChapter(index: number) {
    this.currentChapterIndex.set(index);
  }
}
