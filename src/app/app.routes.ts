import { Routes } from '@angular/router';

// Layouts
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

// Public Site Pages
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

// Member Area Pages
import { LoginComponent } from './features/member-area/pages/login/login.component';
import { DashboardComponent } from './features/member-area/pages/dashboard/dashboard.component';
import { ProfileComponent } from './features/member-area/pages/profile/profile.component';
import { TrainingCatalogComponent } from './features/member-area/pages/training/training-catalog/training-catalog.component';
import { CourseDetailComponent } from './features/member-area/pages/training/course-detail/course-detail.component';
import { CertificationsComponent } from './features/member-area/pages/certifications/certifications.component';
import { PropertyListComponent } from './features/member-area/pages/properties/property-list/property-list.component';
import { PropertyFormComponent } from './features/member-area/pages/properties/property-form/property-form.component';
import { UserListComponent } from './features/member-area/pages/users/user-list/user-list.component';
import { UserFormComponent } from './features/member-area/pages/users/user-form/user-form.component';
import { LeadsInboxComponent } from './features/member-area/pages/leads/leads-inbox.component';
import { ContentListComponent } from './features/member-area/pages/content/content-list/content-list.component';
import { ContentFormComponent } from './features/member-area/pages/content/content-form/content-form.component';
import { StaticPagesListComponent } from './features/member-area/pages/static-pages/static-pages-list/static-pages-list.component';
import { StaticPageEditorComponent } from './features/member-area/pages/static-pages/static-page-editor/static-page-editor.component';

// Guards
import { authGuard } from './features/member-area/guards/auth.guard';
import { canDeactivateGuard } from './core/guards/can-deactivate.guard';
import { NotificationsPageComponent } from './features/member-area/pages/notifications/notifications-page.component';
import { StatisticsComponent } from './features/member-area/pages/statistics/statistics.component';

export const routes: Routes = [
  // ============ ÁREA DE MIEMBROS ============

  // Login fuera del layout de miembros (sin guard)
  {
    path: 'member-area/login',
    component: LoginComponent,
    data: { title: 'Iniciar Sesion' }
  },

  // Rutas protegidas del area de miembros (con layout admin)
  {
    path: 'member-area',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard - Fairway' }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'Mi Perfil - Fairway' }
      },
      {
        path: 'training',
        component: TrainingCatalogComponent,
        data: { title: 'Capacitacion - Fairway' }
      },
      {
        path: 'training/:id',
        component: CourseDetailComponent,
        data: { title: 'Curso - Fairway' }
      },
      {
        path: 'certificaciones',
        component: CertificationsComponent,
        data: { title: 'Certificaciones - Fairway' }
      },
      // ============ PROPIEDADES (Admin) ============
      {
        path: 'propiedades',
        component: PropertyListComponent,
        data: { title: 'Propiedades - Fairway' }
      },
      {
        path: 'propiedades/nueva',
        component: PropertyFormComponent,
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Nueva Propiedad - Fairway' }
      },
      {
        path: 'propiedades/editar/:id',
        component: PropertyFormComponent,
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Editar Propiedad - Fairway' }
      },
      {
        path: 'mis-propiedades',
        component: PropertyListComponent,
        data: { title: 'Mis Propiedades - Fairway' }
      },
      // ============ USUARIOS (Admin) ============
      {
        path: 'usuarios',
        component: UserListComponent,
        data: { title: 'Usuarios - Fairway' }
      },
      {
        path: 'usuarios/nuevo',
        component: UserFormComponent,
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Nuevo Usuario - Fairway' }
      },
      {
        path: 'usuarios/editar/:id',
        component: UserFormComponent,
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Editar Usuario - Fairway' }
      },
      // ============ CONSULTAS ============
      {
        path: 'consultas',
        component: LeadsInboxComponent,
        data: { title: 'Consultas - Fairway' }
      },
      // ============ NOTIFICACIONES ============
      {
        path: 'notificaciones',
        component: NotificationsPageComponent,
        data: { title: 'Notificaciones - Fairway' }
      },
      // ============ ESTADÍSTICAS Y REPORTES ============
      {
        path: 'estadisticas',
        component: StatisticsComponent,
        data: { title: 'Estadísticas - Fairway' }
      },
      {
        path: 'reportes',
        redirectTo: 'estadisticas',
        pathMatch: 'full'
      },
      // ============ CONTENIDO (Admin) ============
      {
        path: 'contenido',
        component: ContentListComponent,
        data: { title: 'Contenido - Fairway' }
      },
      {
        path: 'contenido/testimonios/nuevo',
        component: ContentFormComponent,
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Nuevo Testimonio - Fairway' }
      },
      {
        path: 'contenido/testimonios/editar/:id',
        component: ContentFormComponent,
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Editar Testimonio - Fairway' }
      },
      {
        path: 'contenido/beneficios/nuevo',
        component: ContentFormComponent,
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Nuevo Beneficio - Fairway' }
      },
      {
        path: 'contenido/beneficios/editar/:id',
        component: ContentFormComponent,
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Editar Beneficio - Fairway' }
      },
      {
        path: 'contenido/faqs/nuevo',
        component: ContentFormComponent,
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Nueva FAQ - Fairway' }
      },
      {
        path: 'contenido/faqs/editar/:id',
        component: ContentFormComponent,
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Editar FAQ - Fairway' }
      },
      {
        path: 'contenido/banners/nuevo',
        component: ContentFormComponent,
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Nuevo Banner - Fairway' }
      },
      {
        path: 'contenido/banners/editar/:id',
        component: ContentFormComponent,
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Editar Banner - Fairway' }
      },
      // ============ PÁGINAS ESTÁTICAS (Admin) ============
      {
        path: 'paginas-estaticas',
        component: StaticPagesListComponent,
        data: { title: 'Páginas Estáticas - Fairway' }
      },
      {
        path: 'paginas-estaticas/editar/:id',
        component: StaticPageEditorComponent,
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Editar Página - Fairway' }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

    ]
  },

  // ============ SITIO PÚBLICO ============
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      // Homepage
      {
        path: '',
        component: FairwayHomeComponent,
        data: { title: 'Inicio - Fairway Inmobiliaria' }
      },

      // ============ PROPIEDADES ============
      {
        path: 'properties',
        component: PropertyListingComponent,
        data: { title: 'Propiedades - Fairway Inmobiliaria' }
      },
      {
        path: 'buy',
        component: PropertyListingComponent,
        data: { title: 'Propiedades en Venta - Fairway Inmobiliaria', operacion: 'venta' }
      },
      {
        path: 'rent',
        component: PropertyListingComponent,
        data: { title: 'Propiedades en Alquiler - Fairway Inmobiliaria', operacion: 'alquiler' }
      },
      {
        path: 'property/:id',
        component: PropertyDetailComponent,
        data: { title: 'Detalle de Propiedad - Fairway Inmobiliaria' }
      },

      // ============ EQUIPO / AGENTES ============
      {
        path: 'team',
        component: AgentListingComponent,
        data: { title: 'Nuestro Equipo - Fairway Inmobiliaria' }
      },
      {
        path: 'team/:id',
        component: AgentProfileComponent,
        data: { title: 'Perfil de Asesor - Fairway Inmobiliaria' }
      },

      // ============ PÁGINAS INFORMATIVAS ============
      {
        path: 'about',
        component: AboutUsComponent,
        data: { title: 'Nosotros - Fairway' }
      },
      {
        path: 'contact',
        component: ContactComponent,
        data: { title: 'Contacto - Fairway' }
      },

      // ============ LEGACY HOMES ============
      {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Inicio - Fairway' }
      },
      {
        path: 'home-two',
        component: HomeTwoComponent,
        data: { title: 'Inicio - Fairway' }
      },

      // ============ SERVICIOS ============
      {
        path: 'product/:slug',
        component: ProductDetailComponent,
        data: { title: 'Producto - Fairway' }
      },
      {
        path: 'services/:slug',
        component: ProductDetailComponent,
        data: { title: 'Servicio - Fairway' }
      },

      // ============ REDIRECTS ============
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
        data: { title: 'Inicio - Fairway Inmobiliaria' }
      }
    ]
  }
];
