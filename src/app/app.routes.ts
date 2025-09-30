import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { MemberLayoutComponent } from './layout/member-layout/member-layout.component';
import { HomeComponent } from './features/public-site/pages/home/home.component';
import { HomeTwoComponent } from './features/public-site/pages/home-two/home-two.component';
import { ContactComponent } from './features/public-site/pages/contact/contact.component';
import { AboutUsComponent } from './features/public-site/pages/about-us/about-us.component';
import { ProductsComponent } from './features/public-site/pages/products/products.component';
import { SolarProtectionFilmComponent } from './features/public-site/pages/products/films/solar-protection-film/solar-protection-film.component';
import { ProductDetailComponent } from './features/public-site/pages/products/product-detail/product-detail.component';
import { ProductTypeDetailComponent } from './features/public-site/pages/products/product-type-detail/product-type-detail.component';
import { LoginComponent } from './features/member-area/pages/login/login.component';
import { DashboardComponent } from './features/member-area/pages/dashboard/dashboard.component';
import { TrainingCatalogComponent } from './features/member-area/pages/training/training-catalog/training-catalog.component';
import { CourseDetailComponent } from './features/member-area/pages/training/course-detail/course-detail.component';
import { authGuard } from './features/member-area/guards/auth.guard';
import { CertificationsComponent } from './features/member-area/pages/certifications/certifications.component';
import { InstallerDerivationComponent } from './features/public-site/pages/installer-derivation/installer-derivation.component';

export const routes: Routes = [
  // ============ SITIO PÚBLICO ============
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: HomeTwoComponent,
        data: { title: 'Inicio - Fairway' },
      },
      {
        path: 'contact',
        component: ContactComponent,
        data: { title: 'Contacto - Fairway' },
      },
      {
        path: 'about',
        component: AboutUsComponent,
        data: { title: 'Nosotros - Fairway' },
      },

      // Ruta genérica para cualquier producto/servicio
      { path: 'product/:slug', component: ProductDetailComponent },
      {
        path: 'services/:slug',
        component: ProductDetailComponent,
        data: { title: 'Servicio - Fairway' },
      },
    ],
  },

  // ============ AUTENTICACIÓN ============
  //   { path: 'login', component: LoginComponent, data: { title: 'Iniciar Sesión' } },
  //   { path: 'register', component: RegisterComponent, data: { title: 'Registrarse' } },

  // ============ ÁREA DE MIEMBROS ============

  // Login fuera del layout de miembros
  {
    path: 'member-area/login',
    component: LoginComponent,
    data: { title: 'Iniciar Sesión' },
  },



  // ============ REDIRECCIONES Y ERRORES ============
  //   { path: '404', component: NotFoundComponent, data: { title: 'Página no encontrada' } },
  //   { path: '**', redirectTo: '404' }
];
