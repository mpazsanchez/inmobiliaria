// // src/app/app.routes.ts - ARCHIVO PRINCIPAL DE RUTAS
// import { Routes } from '@angular/router';
// import { AuthGuard } from './core/guards/auth.guard';
// import { LevelGuard } from './core/guards/level.guard';
// import { AdminGuard } from './core/guards/admin.guard';

import { Routes } from "@angular/router";
import { PublicLayoutComponent } from "./layout/public-layout/public-layout.component";
import { HomeComponent } from "./features/public-site/pages/home/home.component";




// // Importar componentes principales
// import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
// import { MemberLayoutComponent } from './layout/member-layout/member-layout.component';
// import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

// // Páginas públicas
// import { HomeComponent } from './features/public-site/pages/home/home.component';
// import { ServicesComponent } from './features/public-site/pages/services/services.component';
// import { AboutComponent } from './features/public-site/pages/about/about.component';
// import { ContactComponent } from './features/public-site/pages/contact/contact.component';
// import { BlogComponent } from './features/public-site/pages/blog/blog.component';
// import { InstallerLocatorComponent } from './features/public-site/pages/installer-locator/installer-locator.component';

// // Auth
// import { LoginComponent } from './features/auth/pages/login/login.component';
// import { RegisterComponent } from './features/auth/pages/register/register.component';

// // Dashboard y áreas de miembros
// import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';
// import { ProfileComponent } from './features/dashboard/pages/profile/profile.component';

// // Tienda
// import { ShopComponent } from './features/store/pages/shop/shop.component';
// import { ProductDetailComponent } from './features/store/components/product-detail/product-detail.component';
// import { CartComponent } from './features/store/components/shopping-cart/shopping-cart.component';

// // Capacitación (Nivel 2+)
// import { CoursesComponent } from './features/training/pages/courses/courses.component';
// import { CourseDetailComponent } from './features/training/pages/course-detail/course-detail.component';

// // Presupuestos (Nivel 2+)
// import { QuoteGeneratorComponent } from './features/quotes/pages/quote-generator/quote-generator.component';
// import { QuoteManagementComponent } from './features/quotes/pages/quote-management/quote-management.component';

// // Garantías (Nivel 3)
// import { WarrantyManagementComponent } from './features/warranty/pages/warranty-management/warranty-management.component';
// import { WarrantyFormComponent } from './features/warranty/components/warranty-form/warranty-form.component';

// // Componentes de error
// import { NotFoundComponent } from './shared/components/not-found/not-found.component';

export const routes: Routes = [
  // ============ SITIO PÚBLICO ============
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent, data: { title: 'Inicio - Glazing™' } },
      // { path: 'home2', component: HomeTwoComponent, data: { title: 'Inicio - Glazing™' } }

    //   { path: 'services', component: ServicesComponent, data: { title: 'Servicios' } },
    //   { path: 'about', component: AboutComponent, data: { title: 'Nosotros' } },
    //   { path: 'contact', component: ContactComponent, data: { title: 'Contacto' } },
    //   { path: 'blog', component: BlogComponent, data: { title: 'Blog' } },
    //   { path: 'installer-locator', component: InstallerLocatorComponent, data: { title: 'Encontrar Instalador' } }
    ]
  },

  // ============ AUTENTICACIÓN ============
//   { path: 'login', component: LoginComponent, data: { title: 'Iniciar Sesión' } },
//   { path: 'register', component: RegisterComponent, data: { title: 'Registrarse' } },

  // ============ ÁREA DE MIEMBROS ============
//   {
//     path: 'members',
//     component: MemberLayoutComponent,
//     canActivate: [AuthGuard],
//     data: { title: 'Área de Miembros' },
//     children: [
//       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      
//       // Dashboard (Todos los niveles)
//       { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },
//       { path: 'profile', component: ProfileComponent, data: { title: 'Mi Perfil' } },

//       // Tienda (Todos los niveles)
//       { path: 'store', component: ShopComponent, data: { title: 'Tienda' } },
//       { path: 'store/product/:id', component: ProductDetailComponent, data: { title: 'Producto' } },
//       { path: 'store/cart', component: CartComponent, data: { title: 'Carrito' } },

//       // Capacitación (Nivel 2+)
//       { 
//         path: 'training', 
//         component: CoursesComponent, 
//         canActivate: [LevelGuard], 
//         data: { title: 'Capacitación', requiredLevel: 2 } 
//       },
//       { 
//         path: 'training/course/:id', 
//         component: CourseDetailComponent, 
//         canActivate: [LevelGuard], 
//         data: { title: 'Curso', requiredLevel: 2 } 
//       },

//       // Presupuestos (Nivel 2+)
//       { 
//         path: 'quotes', 
//         component: QuoteManagementComponent, 
//         canActivate: [LevelGuard], 
//         data: { title: 'Presupuestos', requiredLevel: 2 } 
//       },
//       { 
//         path: 'quotes/new', 
//         component: QuoteGeneratorComponent, 
//         canActivate: [LevelGuard], 
//         data: { title: 'Nuevo Presupuesto', requiredLevel: 2 } 
//       },

//       // Garantías (Nivel 3)
//       { 
//         path: 'warranty', 
//         component: WarrantyManagementComponent, 
//         canActivate: [LevelGuard], 
//         data: { title: 'Garantías', requiredLevel: 3 } 
//       },
//       { 
//         path: 'warranty/new', 
//         component: WarrantyFormComponent, 
//         canActivate: [LevelGuard], 
//         data: { title: 'Nueva Garantía', requiredLevel: 3 } 
//       }
//     ]
//   },

  // ============ PANEL ADMINISTRATIVO ============
//   {
//     path: 'admin',
//     component: AdminLayoutComponent,
//     canActivate: [AdminGuard],
//     data: { title: 'Administración' },
//     children: [
//       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//       { path: 'dashboard', component: DashboardComponent, data: { title: 'Admin Dashboard' } },
//       // Más rutas admin aquí...
//     ]
//   },

  // ============ REDIRECCIONES Y ERRORES ============
//   { path: '404', component: NotFoundComponent, data: { title: 'Página no encontrada' } },
//   { path: '**', redirectTo: '404' }
];