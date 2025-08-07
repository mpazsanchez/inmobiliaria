import { Component, ElementRef, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-hero-section-public',
  standalone: true,
  imports: [],
  templateUrl: './hero-section-public.component.html',
  styleUrl: './hero-section-public.component.scss',
})
export class HeroSectionPublicComponent {
  @Input() backgroundImage?: string = '';

  @Input() breadcrumbTextOne?: string = '';
  @Input() breadcrumbTextTwo?: string = '';
  @Input() breadcrumbTextThree?: string = '';

  @Input() title?: string = '';
  @Input() subtitle?: string = '';

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.updateBackgroundImage();
  }

  ngOnChanges(): void {
    this.updateBackgroundImage();
  }

   private updateBackgroundImage(): void {
    if (this.backgroundImage) {
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        '--hero-bg-image',
        `url('${this.backgroundImage}')`
      );
    }
  }
  
}
