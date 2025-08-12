
import { Component, OnInit } from '@angular/core';
import { HeroSectionComponent } from '../../components/home/hero-section/hero-section.component';
import { AboutCompanyComponent } from '../../../../shared/components/business/about-company/about-company.component';
import { HomePageService } from '../../services/home-page.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroSectionComponent, AboutCompanyComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(public homeService: HomePageService) {}

  ngOnInit() {
    this.homeService.fetchData();
  }
}
