import { Injectable } from '@angular/core';
import { Course } from '../models/course.interface';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  async getCourses(): Promise<Course[]> {
    // Simulación: consumir desde un JSON local
    const res = await fetch('assets/data/courses.json');
    return await res.json();
  }

  async getCourseById(id: string): Promise<Course | null> {
    const courses = await this.getCourses();
    return courses.find(c => c.id === id) || null;
  }

  saveProgress(courseId: string, chapterIndex: number) {
    localStorage.setItem(`progress_${courseId}`, chapterIndex.toString());
  }

  getProgress(courseId: string): number {
    const val = localStorage.getItem(`progress_${courseId}`);
    return val ? parseInt(val, 10) : 0;
  }
}
