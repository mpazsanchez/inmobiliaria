import { Component } from '@angular/core';
import { HeroSectionSlidersComponent } from '../../components/home-two/hero-section-sliders/hero-section-sliders.component';
import { AboutCompanyComponent } from '../../components/home/about-company/about-company.component';
import { ServicesSectionComponent } from '../../components/home/services-section/services-section.component';
import { FaqSectionComponent } from '../../components/home/faq-section/faq-section.component';

@Component({
  selector: 'app-home-two',
  standalone: true,
  imports: [
    HeroSectionSlidersComponent,
    AboutCompanyComponent,
    ServicesSectionComponent,
    FaqSectionComponent
  ],
  templateUrl: './home-two.component.html',
  styleUrl: './home-two.component.scss'
})
export class HomeTwoComponent {

}
