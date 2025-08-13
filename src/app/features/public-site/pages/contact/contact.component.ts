import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactHeroComponent } from '../../components/contact/contact-hero/contact-hero.component';
import { ContactInfoComponent } from '../../components/contact/contact-info/contact-info.component';
import { ContactFormComponent } from '../../components/contact/contact-form/contact-form.component';
import { ContactPageService } from '../../services/contact-page.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  public data: any;
  public loading: any;
  public error: any;
  private contactPageService = inject(ContactPageService); 
  private sanitizer = inject(DomSanitizer);

  constructor() {
    this.data = this.contactPageService.data;
    this.loading = this.contactPageService.loading;
    this.error = this.contactPageService.error;
  }

  ngOnInit(): void {
    if (this.data() === null && !this.loading()) {
      this.contactPageService.fetchData();
    }
  }

    getSafeMapUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
