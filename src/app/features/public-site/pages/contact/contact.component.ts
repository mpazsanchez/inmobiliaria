import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ContactHeroComponent } from '../../components/contact/contact-hero/contact-hero.component';
import { ContactInfoComponent } from '../../components/contact/contact-info/contact-info.component';
import { ContactFormComponent } from '../../components/contact/contact-form/contact-form.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ContactHeroComponent,
    ContactInfoComponent,
    ContactFormComponent
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // Set page title
      document.title = 'Contacto - Glazing™';
    }
  }
}
