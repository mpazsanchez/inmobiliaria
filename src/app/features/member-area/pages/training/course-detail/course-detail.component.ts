import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { SafeUrlPipe } from './safe-url.pipe';
import { TrainingService } from '../../../services/training.service';
import { Course } from '../../../models/course.interface';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
  imports: [SafeUrlPipe]
})
export class CourseDetailComponent implements OnInit {
  private trainingService = inject(TrainingService);
  course = signal<Course | null>(null);
  currentChapterIndex = signal(0);
  currentChapter = computed(() => {
    const c = this.course();
    return c && c.chapters ? c.chapters[this.currentChapterIndex()] : null;
  });

  ngOnInit(): void {
    this.trainingService.getCourseById('1').then((data: Course | null) => {
      if (data) {
        this.course.set(data);
        const saved = this.trainingService.getProgress(data.id);
        if (saved >= 0 && saved < data.chapters.length) {
          this.currentChapterIndex.set(saved);
        }
      }
    });
  }

  selectChapter(index: number): void {
    this.currentChapterIndex.set(index);
    const c = this.course();
    if (c) {
      this.trainingService.saveProgress(c.id, index);
    }
  }
}
