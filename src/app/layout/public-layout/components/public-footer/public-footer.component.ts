import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.scss'
})
export class PublicFooterComponent implements OnInit, OnDestroy {
  
  // Scroll to top button visibility
  showScrollButton = false;
  private isBrowser: boolean;

  // Company Info
  companyInfo = {
    name: 'Fairway',
    description: 'Tu socio de confianza en el mercado inmobiliario. Más de 12 años ayudando a personas y familias a encontrar su hogar ideal.',
    address: 'Tandil, Argentina',
    phone: '0249 424-4568',
    email: 'fairwayparquizacion@gmail.com'
  };

  // Navigation Links
  navigationLinks = [
    { title: 'Inicio', url: '/' },
    { title: 'Comprar', url: '/buy' },
    { title: 'Alquilar', url: '/rent' },
    { title: 'Nosotros', url: '/about' },
    { title: 'Contacto', url: '/contact' }
  ];

  // Quick Links (Servicios)
  quickLinks = [
    { title: 'Ventas', url: '/buy' },
    { title: 'Alquileres', url: '/rent' },
    { title: 'Asesoramiento', url: '/contact' },
    { title: 'Nuestro Equipo', url: '/team' }
  ];

  // Social Links
  socialLinks = [
    { platform: 'Facebook', icon: 'fab fa-facebook-f', url: 'https://www.facebook.com/fairway.parquizacion.integral/' },
    { platform: 'Instagram', icon: 'fab fa-instagram', url: 'https://www.instagram.com/fairwayserviciosintegrales/' },
    { platform: 'LinkedIn', icon: 'fab fa-linkedin-in', url: 'https://linkedin.com/company/fairway' }, //TODO: Agregar link correcto
    { platform: 'YouTube', icon: 'fab fa-youtube', url: 'https://youtube.com/@fairway' } //TODO: Agregar link correcto
  ];

  // Newsletter
  newsletterEmail = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.checkScrollPosition();
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.isBrowser) {
      this.checkScrollPosition();
    }
  }

  private checkScrollPosition(): void {
    if (!this.isBrowser) return;
    
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollButton = scrollPosition > 300;
  }

  scrollToTop(): void {
    if (!this.isBrowser) return;
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  onNavigate(url: string): void {
    // Implement navigation logic
    console.log('Navigate to:', url);
  }

  onSubscribeNewsletter(): void {
    if (this.newsletterEmail?.trim()) {
      console.log('Subscribe email:', this.newsletterEmail);
      // Implement newsletter subscription logic here
      // For now, just clear the input and show success
      // if (this.isBrowser) {
      //   alert('¡Gracias por suscribirte a nuestro newsletter!');
      // }
      this.newsletterEmail = '';
    }
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
