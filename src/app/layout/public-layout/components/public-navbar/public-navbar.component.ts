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
    logo: '../../../../../assets/images/logos/logotipo.png',
    companyName: 'Glazing',
    cartEnabled: true,
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
        name: 'servicios',
        titleShow: 'Servicios',
        icon: 'faTools',
        link: '#',
        orderby: 1,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 11,
        idParent: 1,
        name: 'polarizado-automotriz',
        titleShow: 'Polarizado Automotriz',
        icon: 'faCar',
        link: '#',
        orderby: 1,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 111,
        idParent: 11,
        name: 'autos-particulares',
        titleShow: 'Autos Particulares',
        icon: '',
        link: '/servicios/polarizado-automotriz/autos-particulares',
        orderby: 1,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 112,
        idParent: 11,
        name: 'flotillas-empresariales',
        titleShow: 'Flotillas Empresariales',
        icon: '',
        link: '/servicios/polarizado-automotriz/flotillas-empresariales',
        orderby: 2,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 113,
        idParent: 11,
        name: 'vehiculos-premium',
        titleShow: 'Vehículos Premium',
        icon: '',
        link: '/servicios/polarizado-automotriz/vehiculos-premium',
        orderby: 3,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 12,
        idParent: 1,
        name: 'laminas-arquitectonicas',
        titleShow: 'Láminas Arquitectónicas',
        icon: 'faBuilding',
        link: '#',
        orderby: 2,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 121,
        idParent: 12,
        name: 'oficinas-comercios',
        titleShow: 'Oficinas y Comercios',
        icon: '',
        link: '/servicios/laminas-arquitectonicas/oficinas-comercios',
        orderby: 1,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 122,
        idParent: 12,
        name: 'residencias',
        titleShow: 'Residencias',
        icon: '',
        link: '/servicios/laminas-arquitectonicas/residencias',
        orderby: 2,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 123,
        idParent: 12,
        name: 'edificios-corporativos',
        titleShow: 'Edificios Corporativos',
        icon: '',
        link: '/servicios/laminas-arquitectonicas/edificios-corporativos',
        orderby: 3,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 13,
        idParent: 1,
        name: 'laminas-seguridad',
        titleShow: 'Láminas de Seguridad',
        icon: 'faShield',
        link: '/servicios/laminas-seguridad',
        orderby: 3,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 14,
        idParent: 1,
        name: 'mantenimiento-garantias',
        titleShow: 'Mantenimiento y Garantías',
        icon: 'faWrench',
        link: '/servicios/mantenimiento-garantias',
        orderby: 4,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 2,
        idParent: null,
        name: 'soluciones',
        titleShow: 'Soluciones',
        icon: 'faLightbulb',
        link: '#',
        orderby: 2,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 21,
        idParent: 2,
        name: 'ahorro-energetico',
        titleShow: 'Ahorro Energético',
        icon: 'faLeaf',
        link: '/soluciones/ahorro-energetico',
        orderby: 1,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 22,
        idParent: 2,
        name: 'proteccion-uv',
        titleShow: 'Protección UV',
        icon: 'faSun',
        link: '/soluciones/proteccion-uv',
        orderby: 2,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 23,
        idParent: 2,
        name: 'privacidad-confort',
        titleShow: 'Privacidad y Confort',
        icon: 'faEye',
        link: '/soluciones/privacidad-confort',
        orderby: 3,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 24,
        idParent: 2,
        name: 'seguridad-antivandalismo',
        titleShow: 'Seguridad Anti-Vandalismo',
        icon: 'faShieldAlt',
        link: '/soluciones/seguridad-antivandalismo',
        orderby: 4,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 25,
        idParent: 2,
        name: 'calculadora-ahorros',
        titleShow: 'Calculadora de Ahorros',
        icon: 'faCalculator',
        link: '/soluciones/calculadora-ahorros',
        orderby: 5,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 26,
        idParent: 2,
        name: 'casos-exito',
        titleShow: 'Casos de Éxito',
        icon: 'faTrophy',
        link: '/soluciones/casos-exito',
        orderby: 6,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 3,
        idParent: null,
        name: 'productos',
        titleShow: 'Productos',
        icon: 'faBox',
        link: '/products',
        orderby: 3,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 4,
        idParent: null,
        name: 'capacitacion',
        titleShow: 'Capacitación',
        icon: 'faGraduationCap',
        link: '/capacitacion',
        orderby: 4,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 5,
        idParent: null,
        name: 'nosotros',
        titleShow: 'Nosotros',
        icon: 'faUsers',
        link: '/about',
        orderby: 5,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 6,
        idParent: null,
        name: 'contactar',
        titleShow: 'Contactar',
        icon: 'faEnvelope',
        link: '/contact',
        orderby: 6,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 7,
        idParent: null,
        name: 'area-miembros',
        titleShow: 'Área Miembros',
        icon: 'faUser',
        link: '#',
        orderby: 7,
        status: 1,
        menuArguments: [
          {
            id: 701,
            idmenu: 7,
            name: 'is_secondary_cta',
            value: 'true',
            dbtype: 16,
          },
        ],
        usersMenu: true,
      },
      {
        id: 71,
        idParent: 7,
        name: 'iniciar-sesion',
        titleShow: 'Iniciar Sesión',
        icon: 'faSignInAlt',
        link: '/login',
        orderby: 1,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 72,
        idParent: 7,
        name: 'registrarse',
        titleShow: 'Registrarse',
        icon: 'faUserPlus',
        link: '/registro',
        orderby: 2,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
      {
        id: 73,
        idParent: 7,
        name: 'recuperar-password',
        titleShow: '¿Olvidaste tu contraseña?',
        icon: 'faQuestionCircle',
        link: '/recuperar-password',
        orderby: 3,
        status: 1,
        menuArguments: [],
        usersMenu: true,
      },
    ];
  }
}
