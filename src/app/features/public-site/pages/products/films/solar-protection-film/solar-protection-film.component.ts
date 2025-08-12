import { Component, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionPublicComponent } from '../../../../components/hero-section-public/hero-section-public.component';
import { SolarProtectionFilmPageService } from '../../../../services/solar-protection-film-page.service';
import { SolarProtectionFilmPageData } from '../../../../models/solar-protection-film-page.interface';

@Component({
  selector: 'app-solar-protection-film',
  standalone: true,
  imports: [CommonModule, HeroSectionPublicComponent],
  templateUrl: './solar-protection-film.component.html',
  styleUrl: './solar-protection-film.component.scss'
})
export class SolarProtectionFilmComponent {
  constructor(private pageService: SolarProtectionFilmPageService) {
    effect(() => {
      // Cargar data al inicializar
      this.pageService.fetchData();
    });
  }

  get data() { return this.pageService.data; }
  get loading() { return this.pageService.loading; }
  get error() { return this.pageService.error; }

  get heroData() { return computed(() => this.data()?.heroData); }
  get content() { return computed(() => this.data()?.content); }
  get features() { return computed(() => this.data()?.features ?? []); }
  get specifications() { return computed(() => this.data()?.specifications ?? []); }
  get types() { return computed(() => this.data()?.types ?? []); }
  get challenges() { return computed(() => this.data()?.challenges ?? []); }
  get banner() { return computed(() => this.data()?.banner); }
  get relatedProducts() { return computed(() => this.data()?.relatedProducts ?? []); }

  toggleChallenge(index: number): void {
    // Modifica el estado de isOpen solo en la challenge seleccionada
    const current = this.data();
    if (!current) return;
    const updated = current.challenges.map((challenge, i) => ({
      ...challenge,
      isOpen: i === index ? !challenge.isOpen : false
    }));
    this.pageService.data.set({ ...current, challenges: updated });
  }

  trackByIndex(index: number): number {
    return index;
  }

  onBannerAction(action: string): void {
    if (action.startsWith('/')) {
      window.location.href = action;
    } else if (action.startsWith('tel:')) {
      window.location.href = action;
    }
  }
}
