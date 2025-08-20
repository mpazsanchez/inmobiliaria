import { Injectable } from '@angular/core';
import { Course } from '../models/course.interface';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  getCourses(): Promise<Course[]> {
    // Simulación de API
    return Promise.resolve([
      { id: '1', title: 'Curso Angular', description: 'Aprende Angular desde cero.' },
      { id: '2', title: 'Curso SCSS', description: 'Domina SCSS y estilos modernos.' }
    ]);
  }

  getCourseById(id: string): Promise<Course | null> {
    // Simulación de API
    return this.getCourses().then(courses => courses.find(c => c.id === id) || null);
  }
}
