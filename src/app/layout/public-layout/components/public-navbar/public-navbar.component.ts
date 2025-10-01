// import '../../../../../assets/images/logos/logotipo.png'
// interfaces/menu.interface.ts
export interface MenuArgument {
  id: number;
  idmenu: number;
  name: string;
  value: string;
  dbtype: number;
}

export interface MenuItem {
  id: number;
  idParent: number | null;
  name: string;
  titleShow: string;
  icon: string;
  link: string;
  orderby: number;
  status: number;
  menuArguments: MenuArgument[];
  usersMenu: boolean;
  children?: MenuItem[];
}

export interface NavbarConfig {
  logo: string;
  companyName: string;
  cartEnabled: boolean;
}

// public-navbar.component.ts
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  HostListener,
  ElementRef,
  inject,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
// import { MenuItem, MenuArgument, NavbarConfig } from '../interfaces/menu.interface';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './public-navbar.component.html',
  styleUrl: './public-navbar.component.scss',
})
export class PublicNavbarComponent implements OnInit, OnDestroy {
  @Input() menuData: MenuItem[] = [];
  @Input() config: NavbarConfig = {
    logo: './assets/images/logos/logotipo.png',
    companyName: 'Fairway',
    cartEnabled: false,
  };

  mainMenuItems: MenuItem[] = [];
  cartItemCount: number = 0;
  isMenuCollapsed: boolean = true;
  isScrolled: boolean = false;
  private isBrowser: boolean;

  private readonly destroy$ = new Subject<void>();
  private readonly elementRef = inject(ElementRef);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadMenuData();
    // Detectar el scroll inicial al cargar la página
    if (this.isBrowser) {
      this.checkInitialScroll();
    }
  }

  /**
   * Verifica la posición del scroll al cargar la página y aplica el estado visual correcto
   */
  private checkInitialScroll(): void {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.isScrolled = scrollTop > 10;
    const navbar = this.elementRef.nativeElement.querySelector('.modern-navbar');
    if (navbar) {
      if (this.isScrolled) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Detecta el scroll para aplicar efectos visuales
   */
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    if (!this.isBrowser) return;
    
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.isScrolled = scrollTop > 10;

    // Agregar clase CSS dinámicamente
    const navbar =
      this.elementRef.nativeElement.querySelector('.modern-navbar');
    if (navbar) {
      if (this.isScrolled) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  /**
   * Cierra el menú móvil al hacer clic fuera
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.isBrowser) return;
    
    const target = event.target as HTMLElement;
    const navbar = this.elementRef.nativeElement;

    if (!navbar.contains(target) && !this.isMenuCollapsed) {
      this.isMenuCollapsed = true;
    }
  }

  /**
   * Procesa los datos del menú y construye la estructura jerárquica
   */
  private loadMenuData(): void {
    // Si no hay datos externos, usar datos de ejemplo
    if (this.menuData.length === 0) {
      this.menuData = this.getDefaultMenuData();
    }

    // Procesar y estructurar el menú
    this.mainMenuItems = this.buildMenuHierarchy(this.menuData);
  }

  /**
   * Construye la jerarquía del menú basada en idParent
   */
  private buildMenuHierarchy(items: MenuItem[]): MenuItem[] {
    const itemMap = new Map<number, MenuItem>();
    const rootItems: MenuItem[] = [];

    // Crear mapa de elementos
    items.forEach((item) => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // Construir jerarquía
    items.forEach((item) => {
      const menuItem = itemMap.get(item.id);
      if (!menuItem) return;

      if (item.idParent === null) {
        rootItems.push(menuItem);
      } else {
        const parent = itemMap.get(item.idParent);
        if (parent && parent.children) {
          parent.children.push(menuItem);
        }
      }
    });

    // Ordenar por orderby
    return this.sortMenuItems(rootItems);
  }

  /**
   * Ordena los elementos del menú recursivamente
   */
  private sortMenuItems(items: MenuItem[]): MenuItem[] {
    return items
      .sort((a, b) => a.orderby - b.orderby)
      .map((item) => ({
        ...item,
        children: item.children ? this.sortMenuItems(item.children) : [],
      }));
  }

  /**
   * Verifica si un elemento tiene hijos
   */
  hasChildren(item: MenuItem): boolean {
    return item.children !== undefined && item.children.length > 0;
  }

  /**
   * Maneja el click en elementos del menú con smooth scroll
   */
  onMenuItemClick(item: MenuItem, event: Event): void {
    if (this.hasChildren(item)) {
      event.preventDefault();
      return;
    }

    // Cerrar menú móvil al hacer clic
    this.isMenuCollapsed = true;

    // Si es un enlace interno (#section), hacer smooth scroll
    if (item.link.startsWith('#')) {
      event.preventDefault();
      this.smoothScrollTo(item.link);
      return;
    }

    console.log('Navegando a:', item.link);
    // Aquí implementarías la navegación con Router
    // this.router.navigate([item.link]);
  }

  /**
   * Implementa smooth scroll para enlaces internos
   */
  private smoothScrollTo(target: string): void {
    if (!this.isBrowser) return;
    
    const element = document.querySelector(target);
    if (element) {
      const navbarHeight = 64; // Altura del navbar
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  /**
   * Maneja el click del carrito con animación
   */
  onCartClick(): void {
    console.log('Carrito clickeado');

    if (!this.isBrowser) return;

    // Pequeña animación de feedback
    const cartBtn = this.elementRef.nativeElement.querySelector('.cart-btn');
    if (cartBtn) {
      cartBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
      }, 150);
    }

    // Implementar lógica del carrito
  }

  /**
   * Toggle del menú móvil con animación
   */
  toggleMobileMenu(): void {
    this.isMenuCollapsed = !this.isMenuCollapsed;

    if (!this.isBrowser) return;

    // Prevenir scroll del body cuando el menú está abierto
    if (!this.isMenuCollapsed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  /**
   * Datos de ejemplo basados en tu estructura JSON
   */
  private getDefaultMenuData(): MenuItem[] {
    return [
      {
        id: 1,
        idParent: null,
        name: 'Inicio',
        titleShow: 'Inicio',
        icon: 'fa fa-home',
        link: '#',
        orderby: 1,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 2,
        idParent: null,
        name: 'Servicios',
        titleShow: 'Servicios',
        icon: '',
        link: '/services/all',
        orderby: 1,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 5,
        idParent: 2,
        name: 'Paisajismo',
        titleShow: 'Paisajismo',
        icon: '',
        link: '/services/paisajismo',
        orderby: 1,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 6,
        idParent: 2,
        name: 'Urbanismo',
        titleShow: 'Urbanismo',
        icon: '',
        link: '/services/urbanismo',
        orderby: 1,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 7,
        idParent: 2,
        name: 'Industria',
        titleShow: 'Industria',
        icon: '',
        link: '/services/industria',
        orderby: 1,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 8,
        idParent: 2,
        name: 'Agro',
        titleShow: 'Agro',
        icon: '',
        link: '/services/agro',
        orderby: 1,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 9,
        idParent: 2,
        name: 'Seguridad',
        titleShow: 'Seguridad',
        icon: '',
        link: '/services/seguridad',
        orderby: 1,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 3,
        idParent: null,
        name: 'Nosotros',
        titleShow: 'Nosotros',
        icon: '',
        link: '/about',
        orderby: 2,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 4,
        idParent: null,
        name: 'Contacto',
        titleShow: 'Contacto',
        icon: '',
        link: '/contact',
        orderby: 3,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      }
    ];
  }
}
