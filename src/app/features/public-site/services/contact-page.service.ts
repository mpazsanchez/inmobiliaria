import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ContactData {
  contactInfo: {
    address: string;
    email: string;
    phone: string;
  };
  social: {
    icon: string;
    label: string;
    url: string;
  }[];
  map: {
    iframeUrl: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ContactPageService {
  private http = inject(HttpClient);

  readonly data = signal<ContactData | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.fetchData();
  }

  fetchData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<ContactData>('/assets/data/contact.json').subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading contact data:', err);
        this.error.set('Error al cargar la información de contacto');
        this.loading.set(false);
      }
    });
  }
}
