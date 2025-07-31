import { Component } from '@angular/core';
import { HeroSectionSlidersComponent } from "../../components/home-two/hero-section-sliders/hero-section-sliders.component";

@Component({
  selector: 'app-home-two',
  standalone: true,
  imports: [HeroSectionSlidersComponent],
  templateUrl: './home-two.component.html',
  styleUrl: './home-two.component.scss'
})
export class HomeTwoComponent {

}
