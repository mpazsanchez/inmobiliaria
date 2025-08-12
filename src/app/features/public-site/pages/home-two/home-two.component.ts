
import { Component, computed, signal, OnInit } from '@angular/core';
import { HeroSectionSlidersComponent } from '../../components/home-two/hero-section-sliders/hero-section-sliders.component';
import { ServicesSectionComponent } from '../../components/home/services-section/services-section.component';
import { FaqSectionComponent } from '../../components/home/faq-section/faq-section.component';
import { AboutCompanyComponent } from "../../../../shared/components/business/about-company/about-company.component";
import { ExperienceSectionComponent } from "../../components/home/experience-section/experience-section.component";
import { HomeTwoPageService } from '../../services/home-two-page.service';
import { HomeTwoPageData } from '../../models/home-two-page.interface';

@Component({
  selector: 'app-home-two',
  standalone: true,
  imports: [
    HeroSectionSlidersComponent,
    ServicesSectionComponent,
    FaqSectionComponent,
    AboutCompanyComponent,
    ExperienceSectionComponent
],
  templateUrl: './home-two.component.html',
  styleUrl: './home-two.component.scss'
})
export class HomeTwoComponent implements OnInit {
  public data: any;
  public loading: any;
  public error: any;

  constructor(private homeTwoPageService: HomeTwoPageService) {
    this.data = this.homeTwoPageService.data;
    this.loading = this.homeTwoPageService.loading;
    this.error = this.homeTwoPageService.error;
  }

  ngOnInit(): void {
    if (this.data() === null && !this.loading()) {
      this.homeTwoPageService.fetchData();
    }
  }

  get sliderItems() {
    return this.data()?.heroSliders || [];
  }

  get aboutCompanyBanner() {
    return this.data()?.aboutCompany?.bannerImage || '';
  }
}
