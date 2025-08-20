import { Component, signal } from '@angular/core';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainingService } from '../../../services/training.service';
import { Course } from '../../../models/course.interface';


@Component({
  selector: 'app-course-detail',
  standalone: true,
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent {
  private route = inject(ActivatedRoute);
  private trainingService = inject(TrainingService);
  course = signal<Course | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.trainingService.getCourseById(id).then((data: Course | null) => this.course.set(data));
    }
  }
}
