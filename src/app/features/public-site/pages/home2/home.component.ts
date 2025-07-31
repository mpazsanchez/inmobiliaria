import { Component } from '@angular/core';
import { HeroSectionComponent } from "../../components/home/hero-section/hero-section.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
