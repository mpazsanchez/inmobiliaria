import { Component, signal } from '@angular/core';
import { inject } from '@angular/core';
import { TrainingService } from '../../../services/training.service';
import { Router } from '@angular/router';
import { Course } from '../../../models/course.interface';

@Component({
  selector: 'app-training-catalog',
  standalone: true,
  templateUrl: './training-catalog.component.html',
  styleUrls: ['./training-catalog.component.scss']
})
export class TrainingCatalogComponent {
  private trainingService = inject(TrainingService);
  private router = inject(Router);
  courses = signal<Course[]>([]);

  ngOnInit() {
    this.trainingService.getCourses().then(data => this.courses.set(data));
  }

  goToCourse(id: string) {
    this.router.navigate(['/member-area/training', id]);
  }
}
