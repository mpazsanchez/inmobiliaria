import { Component, signal, computed } from '@angular/core';
import { SafeUrlPipe } from './safe-url.pipe';

interface Chapter {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  description: string;
}
interface FAQ {
  question: string;
  answer: string;
}
interface Resource {
  name: string;
  url: string;
}
interface Instructor {
  name: string;
  bio: string;
  photo: string;
  contact: string;
}
interface Testimonial {
  student: string;
  comment: string;
}
interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: number;
  progress: number;
  chapters: Chapter[];
  faqs: FAQ[];
  resources: Resource[];
  instructor: Instructor;
  bonus: string;
  testimonials: Testimonial[];
}

@Component({
  selector: 'app-course-detail',
  standalone: true,
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
  imports: [SafeUrlPipe]
})
export class CourseDetailComponent {
  course = signal<Course>({
    id: '1',
    title: 'Polarizado Automotriz',
    description: 'Aprende a polarizar autos como un profesional. Incluye técnicas, materiales y casos reales.',
    image: 'assets/images/backgrounds/image-13.jpg',
    duration: 6,
    progress: 40,
    chapters: [
      { id: 'c1', title: 'Introducción', videoUrl: 'https://www.youtube.com/embed/1Q8fG0TtVAY', duration: 0.5, description: 'Presentación y objetivos del curso.' },
      { id: 'c2', title: 'Herramientas y materiales', videoUrl: 'https://www.youtube.com/embed/2Vv-BfVoq4g', duration: 1, description: 'Todo lo necesario para comenzar.' },
      { id: 'c3', title: 'Preparación del vehículo', videoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ', duration: 1.5, description: 'Cómo preparar el auto para el polarizado.' },
      { id: 'c4', title: 'Aplicación de la lámina', videoUrl: 'https://www.youtube.com/embed/4k1E8T6hKjA', duration: 2, description: 'Técnicas de aplicación profesional.' },
      { id: 'c5', title: 'Errores comunes y soluciones', videoUrl: 'https://www.youtube.com/embed/5NV6Rdv1a3I', duration: 1, description: 'Cómo evitar y corregir errores.' }
    ],
    faqs: [
      { question: '¿Cómo es la capacitación?', answer: '100% online, con acceso a todos los materiales y soporte.' },
      { question: '¿A quién está dirigido?', answer: 'A cualquier persona interesada en el polarizado automotriz.' },
      { question: '¿Qué necesito para comenzar?', answer: 'Solo ganas de aprender y acceso a internet.' }
    ],
    resources: [
      { name: 'Manual PDF', url: '#' },
      { name: 'Lista de materiales', url: '#' }
    ],
    instructor: {
      name: 'Pablo Fabián Gómez',
      bio: 'Experto en polarizados y láminas para ventanas, más de 25 años de experiencia.',
      photo: 'assets/images/logos/logotipo.png',
      contact: 'https://wa.me/543512454425'
    },
    bonus: 'Curso de Polarizado de Franja Delantera incluido como regalo.',
    testimonials: [
      { student: 'Juan Pérez', comment: 'Excelente curso, muy completo y práctico.' },
      { student: 'María López', comment: 'Aprendí todo lo necesario para empezar mi negocio.' }
    ]
  });

  currentChapterIndex = signal(0);
  currentChapter = computed(() => {
    const c = this.course();
    return c.chapters[this.currentChapterIndex()];
  });

  selectChapter(index: number) {
    this.currentChapterIndex.set(index);
  }
}
