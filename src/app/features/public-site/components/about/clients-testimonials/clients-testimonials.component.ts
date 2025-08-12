
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  initials: string;
}

@Component({
  selector: 'app-clients-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients-testimonials.component.html',
  styleUrl: './clients-testimonials.component.scss'
})
export class ClientsTestimonialsComponent {
  @Input() testimonials: Testimonial[] = [];
}
