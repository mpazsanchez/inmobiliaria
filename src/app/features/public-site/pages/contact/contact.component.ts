import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactHeroComponent } from '../../components/contact/contact-hero/contact-hero.component';
import { ContactInfoComponent } from '../../components/contact/contact-info/contact-info.component';
import { ContactFormComponent } from '../../components/contact/contact-form/contact-form.component';
import { ContactPageService } from '../../services/contact-page.service';

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
export class ContactComponent {
  public data: any;
  public loading: any;
  public error: any;

  constructor(private contactPageService: ContactPageService) {
    this.data = this.contactPageService.data;
    this.loading = this.contactPageService.loading;
    this.error = this.contactPageService.error;
    effect(() => {
      if (this.data() === null && !this.loading()) {
        this.contactPageService.fetchData();
      }
    });
  }
}
