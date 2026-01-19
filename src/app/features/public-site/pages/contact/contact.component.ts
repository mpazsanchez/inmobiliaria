import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactHeroComponent } from '../../components/contact/contact-hero/contact-hero.component';
import { ContactInfoComponent } from '../../components/contact/contact-info/contact-info.component';
import { ContactFormComponent } from '../../components/contact/contact-form/contact-form.component';
import { ContactPageService } from '../../services/contact-page.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ContactHeroComponent,
    ContactInfoComponent,
    ContactFormComponent,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private contactPageService = inject(ContactPageService);
  private sanitizer = inject(DomSanitizer);

  readonly data = this.contactPageService.data;
  readonly loading = this.contactPageService.loading;
  readonly error = this.contactPageService.error;

  readonly safeMapUrl = computed(() => {
    const mapUrl = this.data()?.map?.iframeUrl;
    if (mapUrl) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
    }
    return null;
  });

  ngOnInit(): void {
    if (this.data() === null && !this.loading()) {
      this.contactPageService.fetchData();
    }
  }
}
