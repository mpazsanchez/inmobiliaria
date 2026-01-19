import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PublicNavbarComponent } from "./components/public-navbar/public-navbar.component";
import { PublicFooterComponent } from "./components/public-footer/public-footer.component";
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [PublicNavbarComponent, PublicFooterComponent, RouterOutlet],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private routerSubscription?: Subscription;

  // Rutas del módulo inmobiliario que requieren scroll to top
  private realEstateRoutes = [
    '/properties',
    '/buy',
    '/rent',
    '/property/',
    '/team'
  ];

  ngOnInit(): void {
    // Solo ejecutar en el navegador (no en SSR)
    if (isPlatformBrowser(this.platformId)) {
      this.setupScrollToTop();
    }
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  private setupScrollToTop(): void {
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        // Verificar si la ruta es del módulo inmobiliario
        if (this.isRealEstateRoute(event.urlAfterRedirects)) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
  }

  private isRealEstateRoute(url: string): boolean {
    return this.realEstateRoutes.some(route => url.startsWith(route));
  }
}
