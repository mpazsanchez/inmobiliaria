import { Component, inject, Inject, Input, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface CompanyStats {
  value: number;
  label: string;
  unit?: string;
}

interface SkillProgress {
  name: string;
  percentage: number;
}

@Component({
  selector: 'app-about-company',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-company.component.html',
  styleUrl: './about-company.component.scss'
})
export class AboutCompanyComponent {
  @Input() companyStats: CompanyStats[] = [];
  @Input() companyInfo: { title: string; subtitle: string; description: string } = { title: '', subtitle: '', description: '' };
  @Input() showProgressBars: boolean = false;
  @Input() skills: SkillProgress[] = [];
  @Input() contactInfo: { description: string; phone: string } = { description: '', phone: '' };
  @Input() bannerImage?: string = '';
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  onCallPhone(): void {
    if (this.contactInfo && this.contactInfo.phone) {
      window.location.href = `tel:${this.contactInfo.phone}`;
    }
  }
}
