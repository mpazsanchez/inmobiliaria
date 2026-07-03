import { Routes } from '@angular/router';

// Layout público (eager: envuelve todas las rutas públicas)
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';

// Guards (funciones pequeñas, eager)
import { authGuard } from './features/member-area/guards/auth.guard';
import { canDeactivateGuard } from './core/guards/can-deactivate.guard';

export const routes: Routes = [
  // ============ AUTENTICACIÓN Y PASSWORD RESET ============

  {
    path: 'login',
    loadComponent: () => import('./features/member-area/pages/login/login.component').then(m => m.LoginComponent),
    data: { title: 'Iniciar Sesión - Fairway' }
  },
  {
    path: 'member-area/login',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login/forgot-password',
    loadComponent: () => import('./features/public-site/pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    data: { title: '¿Olvidaste tu contraseña? - Fairway' }
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./features/public-site/pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    data: { title: 'Restablecer Contraseña - Fairway' }
  },

  // ============ ÁREA DE MIEMBROS ============

  {
    path: 'member-area',
    loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/member-area/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { title: 'Dashboard - Fairway' }
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/member-area/pages/profile/profile.component').then(m => m.ProfileComponent),
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Mi Perfil - Fairway' }
      },
      {
        path: 'training',
        loadComponent: () => import('./features/member-area/pages/training/training-catalog/training-catalog.component').then(m => m.TrainingCatalogComponent),
        data: { title: 'Capacitacion - Fairway' }
      },
      {
        path: 'training/:id',
        loadComponent: () => import('./features/member-area/pages/training/course-detail/course-detail.component').then(m => m.CourseDetailComponent),
        data: { title: 'Curso - Fairway' }
      },
      {
        path: 'certificaciones',
        loadComponent: () => import('./features/member-area/pages/certifications/certifications.component').then(m => m.CertificationsComponent),
        data: { title: 'Certificaciones - Fairway' }
      },
      // ============ PROPIEDADES (Admin) ============
      {
        path: 'propiedades',
        loadComponent: () => import('./features/member-area/pages/properties/property-list/property-list.component').then(m => m.PropertyListComponent),
        data: { title: 'Propiedades - Fairway' }
      },
      {
        path: 'propiedades/nueva',
        loadComponent: () => import('./features/member-area/pages/properties/property-form/property-form.component').then(m => m.PropertyFormComponent),
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Nueva Propiedad - Fairway' }
      },
      {
        path: 'propiedades/editar/:id',
        loadComponent: () => import('./features/member-area/pages/properties/property-form/property-form.component').then(m => m.PropertyFormComponent),
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Editar Propiedad - Fairway' }
      },
      {
        path: 'mis-propiedades',
        loadComponent: () => import('./features/member-area/pages/properties/property-list/property-list.component').then(m => m.PropertyListComponent),
        data: { title: 'Mis Propiedades - Fairway' }
      },
      // ============ USUARIOS (Admin) ============
      {
        path: 'usuarios',
        loadComponent: () => import('./features/member-area/pages/users/user-list/user-list.component').then(m => m.UserListComponent),
        data: { title: 'Usuarios - Fairway' }
      },
      {
        path: 'usuarios/nuevo',
        loadComponent: () => import('./features/member-area/pages/users/user-form/user-form.component').then(m => m.UserFormComponent),
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Nuevo Usuario - Fairway' }
      },
      {
        path: 'usuarios/editar/:id',
        loadComponent: () => import('./features/member-area/pages/users/user-form/user-form.component').then(m => m.UserFormComponent),
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Editar Usuario - Fairway' }
      },
      // ============ CONSULTAS ============
      {
        path: 'consultas',
        loadComponent: () => import('./features/member-area/pages/leads/leads-inbox.component').then(m => m.LeadsInboxComponent),
        data: { title: 'Consultas - Fairway' }
      },
      // ============ NOTIFICACIONES ============
      {
        path: 'notificaciones',
        loadComponent: () => import('./features/member-area/pages/notifications/notifications-page.component').then(m => m.NotificationsPageComponent),
        data: { title: 'Notificaciones - Fairway' }
      },
      // ============ ESTADÍSTICAS Y REPORTES ============
      {
        path: 'estadisticas',
        loadComponent: () => import('./features/member-area/pages/statistics/statistics.component').then(m => m.StatisticsComponent),
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
        loadComponent: () => import('./features/member-area/pages/content/content-list/content-list.component').then(m => m.ContentListComponent),
        data: { title: 'Contenido - Fairway' }
      },
      {
        path: 'contenido/testimonios/nuevo',
        loadComponent: () => import('./features/member-area/pages/content/content-form/content-form.component').then(m => m.ContentFormComponent),
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Nuevo Testimonio - Fairway' }
      },
      {
        path: 'contenido/testimonios/editar/:id',
        loadComponent: () => import('./features/member-area/pages/content/content-form/content-form.component').then(m => m.ContentFormComponent),
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Editar Testimonio - Fairway' }
      },
      {
        path: 'contenido/beneficios/nuevo',
        loadComponent: () => import('./features/member-area/pages/content/content-form/content-form.component').then(m => m.ContentFormComponent),
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Nuevo Beneficio - Fairway' }
      },
      {
        path: 'contenido/beneficios/editar/:id',
        loadComponent: () => import('./features/member-area/pages/content/content-form/content-form.component').then(m => m.ContentFormComponent),
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Editar Beneficio - Fairway' }
      },
      {
        path: 'contenido/faqs/nuevo',
        loadComponent: () => import('./features/member-area/pages/content/content-form/content-form.component').then(m => m.ContentFormComponent),
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Nueva FAQ - Fairway' }
      },
      {
        path: 'contenido/faqs/editar/:id',
        loadComponent: () => import('./features/member-area/pages/content/content-form/content-form.component').then(m => m.ContentFormComponent),
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Editar FAQ - Fairway' }
      },
      {
        path: 'contenido/banners/nuevo',
        loadComponent: () => import('./features/member-area/pages/content/content-form/content-form.component').then(m => m.ContentFormComponent),
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Nuevo Banner - Fairway' }
      },
      {
        path: 'contenido/banners/editar/:id',
        loadComponent: () => import('./features/member-area/pages/content/content-form/content-form.component').then(m => m.ContentFormComponent),
        canDeactivate: [canDeactivateGuard],
        data: { title: 'Editar Banner - Fairway' }
      },
      // ============ PÁGINAS ESTÁTICAS (Admin) ============
      {
        path: 'paginas-estaticas',
        loadComponent: () => import('./features/member-area/pages/static-pages/static-pages-list/static-pages-list.component').then(m => m.StaticPagesListComponent),
        data: { title: 'Páginas Estáticas - Fairway' }
      },
      {
        path: 'paginas-estaticas/editar/:id',
        loadComponent: () => import('./features/member-area/pages/static-pages/static-page-editor/static-page-editor.component').then(m => m.StaticPageEditorComponent),
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
        loadComponent: () => import('./features/public-site/pages/fairway-home/fairway-home.component').then(m => m.FairwayHomeComponent),
        data: { title: 'Inicio - Fairway Inmobiliaria' }
      },

      // ============ PROPIEDADES ============
      {
        path: 'properties',
        loadComponent: () => import('./features/public-site/pages/property-listing/property-listing.component').then(m => m.PropertyListingComponent),
        data: { title: 'Propiedades - Fairway Inmobiliaria' }
      },
      {
        path: 'buy',
        loadComponent: () => import('./features/public-site/pages/property-listing/property-listing.component').then(m => m.PropertyListingComponent),
        data: { title: 'Propiedades en Venta - Fairway Inmobiliaria', operacion: 'venta' }
      },
      {
        path: 'rent',
        loadComponent: () => import('./features/public-site/pages/property-listing/property-listing.component').then(m => m.PropertyListingComponent),
        data: { title: 'Propiedades en Alquiler - Fairway Inmobiliaria', operacion: 'alquiler' }
      },
      {
        path: 'property/:id',
        loadComponent: () => import('./features/public-site/pages/property-detail/property-detail.component').then(m => m.PropertyDetailComponent),
        data: { title: 'Detalle de Propiedad - Fairway Inmobiliaria' }
      },

      // ============ EQUIPO / AGENTES ============
      {
        path: 'team',
        loadComponent: () => import('./features/public-site/pages/agent-listing/agent-listing.component').then(m => m.AgentListingComponent),
        data: { title: 'Nuestro Equipo - Fairway Inmobiliaria' }
      },
      {
        path: 'team/:id',
        loadComponent: () => import('./features/public-site/pages/agent-profile/agent-profile.component').then(m => m.AgentProfileComponent),
        data: { title: 'Perfil de Asesor - Fairway Inmobiliaria' }
      },

      // ============ PÁGINAS INFORMATIVAS ============
      {
        path: 'about',
        loadComponent: () => import('./features/public-site/pages/about-us/about-us.component').then(m => m.AboutUsComponent),
        data: { title: 'Nosotros - Fairway' }
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/public-site/pages/contact/contact.component').then(m => m.ContactComponent),
        data: { title: 'Contacto - Fairway' }
      },

      // ============ LEGACY HOMES ============
      {
        path: 'home',
        loadComponent: () => import('./features/public-site/pages/home/home.component').then(m => m.HomeComponent),
        data: { title: 'Inicio - Fairway' }
      },
      {
        path: 'home-two',
        loadComponent: () => import('./features/public-site/pages/home-two/home-two.component').then(m => m.HomeTwoComponent),
        data: { title: 'Inicio - Fairway' }
      },

      // ============ SERVICIOS ============
      {
        path: 'product/:slug',
        loadComponent: () => import('./features/public-site/pages/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
        data: { title: 'Producto - Fairway' }
      },
      {
        path: 'services/:slug',
        loadComponent: () => import('./features/public-site/pages/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
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
        loadComponent: () => import('./features/public-site/pages/fairway-home/fairway-home.component').then(m => m.FairwayHomeComponent),
        data: { title: 'Inicio - Fairway Inmobiliaria' }
      }
    ]
  }
];
