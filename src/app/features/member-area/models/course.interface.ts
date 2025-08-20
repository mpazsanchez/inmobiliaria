export interface Chapter {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Resource {
  name: string;
  url: string;
}

export interface Instructor {
  name: string;
  bio: string;
  photo: string;
  contact: string;
}

export interface Testimonial {
  student: string;
  comment: string;
}

export interface Course {
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
