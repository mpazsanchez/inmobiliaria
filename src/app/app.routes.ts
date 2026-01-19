import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { HomeComponent } from './features/public-site/pages/home/home.component';
import { HomeTwoComponent } from './features/public-site/pages/home-two/home-two.component';
import { FairwayHomeComponent } from './features/public-site/pages/fairway-home/fairway-home.component';
import { PropertyListingComponent } from './features/public-site/pages/property-listing/property-listing.component';
import { PropertyDetailComponent } from './features/public-site/pages/property-detail/property-detail.component';
import { AgentListingComponent } from './features/public-site/pages/agent-listing/agent-listing.component';
import { AgentProfileComponent } from './features/public-site/pages/agent-profile/agent-profile.component';
import { ContactComponent } from './features/public-site/pages/contact/contact.component';
import { AboutUsComponent } from './features/public-site/pages/about-us/about-us.component';
import { ProductDetailComponent } from './features/public-site/pages/products/product-detail/product-detail.component';
import { LoginComponent } from './features/member-area/pages/login/login.component';

export const routes: Routes = [
  // ============ SITIO PÚBLICO ============
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      // Homepage
      {
        path: '',
        component: FairwayHomeComponent,
        data: { title: 'Inicio - Fairway Inmobiliaria' },
      },

      // ============ PROPIEDADES ============
      {
        path: 'properties',
        component: PropertyListingComponent,
        data: { title: 'Propiedades - Fairway Inmobiliaria' },
      },
      {
        path: 'buy',
        component: PropertyListingComponent,
        data: { title: 'Propiedades en Venta - Fairway Inmobiliaria', operacion: 'venta' },
      },
      {
        path: 'rent',
        component: PropertyListingComponent,
        data: { title: 'Propiedades en Alquiler - Fairway Inmobiliaria', operacion: 'alquiler' },
      },
      {
        path: 'property/:id',
        component: PropertyDetailComponent,
        data: { title: 'Detalle de Propiedad - Fairway Inmobiliaria' },
      },

      // ============ EQUIPO / AGENTES ============
      {
        path: 'team',
        component: AgentListingComponent,
        data: { title: 'Nuestro Equipo - Fairway Inmobiliaria' },
      },
      {
        path: 'team/:id',
        component: AgentProfileComponent,
        data: { title: 'Perfil de Asesor - Fairway Inmobiliaria' },
      },

      // ============ PÁGINAS INFORMATIVAS ============
      {
        path: 'about',
        component: AboutUsComponent,
        data: { title: 'Nosotros - Fairway' },
      },
      {
        path: 'contact',
        component: ContactComponent,
        data: { title: 'Contacto - Fairway' },
      },

      // ============ LEGACY HOMES (mantener por compatibilidad) ============
      {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Inicio - Fairway' },
      },
      {
        path: 'home-two',
        component: HomeTwoComponent,
        data: { title: 'Inicio - Fairway' },
      },

      // ============ SERVICIOS ============
      { path: 'product/:slug', component: ProductDetailComponent },
      {
        path: 'services/:slug',
        component: ProductDetailComponent,
        data: { title: 'Servicio - Fairway' },
      },

      // ============ REDIRECTS (rutas antiguas en español) ============
      { path: 'propiedades', redirectTo: 'properties', pathMatch: 'full' },
      { path: 'comprar', redirectTo: 'buy', pathMatch: 'full' },
      { path: 'alquilar', redirectTo: 'rent', pathMatch: 'full' },
      { path: 'propiedad/:id', redirectTo: 'property/:id', pathMatch: 'full' },
      { path: 'equipo', redirectTo: 'team', pathMatch: 'full' },
      { path: 'equipo/:id', redirectTo: 'team/:id', pathMatch: 'full' },

      // ============ FALLBACK ============
      {
        path: '**',
        component: FairwayHomeComponent,
        data: { title: 'Inicio - Fairway Inmobiliaria' },
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
