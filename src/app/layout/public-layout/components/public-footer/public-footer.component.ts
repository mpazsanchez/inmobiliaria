import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  // Company Info
  companyInfo = {
    name: 'Glazing',
    description: 'Especialistas en láminas solares de alta calidad. Protección, confort y eficiencia energética para tu hogar y oficina.',
    address: 'Ciudad de México, México',
    phone: '+52 55 1234 5678',
    email: 'info@glazing.mx'
  };

  // Navigation Links
  navigationLinks = [
    { title: 'Inicio', url: '/home' },
    { title: 'Acerca de Nosotros', url: '/about' },
    { title: 'Servicios', url: '/services' },
    { title: 'Contacto', url: '/contact' },
    { title: 'Blog', url: '/blog' }
  ];

  // Quick Links
  quickLinks = [
    { title: 'Ayuda', url: '/help' },
    { title: 'Soporte', url: '/support' },
    { title: 'Clientes', url: '/clients' },
    { title: 'Tienda', url: '/shop' },
    { title: 'Portafolio', url: '/portfolio' }
  ];

  // Social Links
  socialLinks = [
    { platform: 'Facebook', icon: 'fab fa-facebook-f', url: '#' },
    { platform: 'Instagram', icon: 'fab fa-instagram', url: '#' },
    { platform: 'TikTok', icon: 'fab fa-tiktok', url: '#' },
    { platform: 'YouTube', icon: 'fab fa-youtube', url: '#' }
  ];

  // Newsletter
  newsletterEmail = '';

  constructor() {}

  ngOnInit(): void {
    this.checkScrollPosition();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScrollPosition();
  }

  private checkScrollPosition(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollButton = scrollPosition > 300;
  }

  scrollToTop(): void {
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
    if (this.newsletterEmail && this.newsletterEmail.trim()) {
      console.log('Subscribe email:', this.newsletterEmail);
      // Implement newsletter subscription logic here
      // For now, just clear the input and show success
      alert('¡Gracias por suscribirte a nuestro newsletter!');
      this.newsletterEmail = '';
    }
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}
