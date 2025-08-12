
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutHeroComponent } from "../../components/about/about-hero/about-hero.component";
import { ClientsTestimonialsComponent } from "../../components/about/clients-testimonials/clients-testimonials.component";
import { ExperienceSectionComponent } from "../../components/home/experience-section/experience-section.component";
import { ProductsTechnologyComponent } from "../../components/products/products-technology/products-technology.component";
import { AboutUsPageService } from '../../services/about-us-page.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, AboutHeroComponent, ClientsTestimonialsComponent, ExperienceSectionComponent, ProductsTechnologyComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit {
  public data: any;
  public loading: any;
  public error: any;

  constructor(private aboutUsPageService: AboutUsPageService) {
    this.data = this.aboutUsPageService.data;
    this.loading = this.aboutUsPageService.loading;
    this.error = this.aboutUsPageService.error;
  }

  ngOnInit(): void {
    if (this.data() === null && !this.loading()) {
      this.aboutUsPageService.fetchData();
    }
  }

  get experienceData() {
    return this.data()?.stats || null;
  }
}
