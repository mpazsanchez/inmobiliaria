import { Component } from '@angular/core';
import { HeroSectionSlidersComponent } from '../../components/home-two/hero-section-sliders/hero-section-sliders.component';
import { ServicesSectionComponent } from '../../components/home/services-section/services-section.component';
import { FaqSectionComponent } from '../../components/home/faq-section/faq-section.component';
import { AboutCompanyComponent } from "../../components/home/about-company/about-company.component";
import { ExperienceSectionComponent } from "../../components/home/experience-section/experience-section.component";

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
export class HomeTwoComponent {

}
