import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutHeroComponent } from "../../components/about/about-hero/about-hero.component";
import { AboutCompanyComponent } from "../../../../shared/components/business/about-company/about-company.component";
import { WhyChooseUsComponent } from "../../components/about/why-choose-us/why-choose-us.component";

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, AboutHeroComponent, AboutCompanyComponent, WhyChooseUsComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {

}
