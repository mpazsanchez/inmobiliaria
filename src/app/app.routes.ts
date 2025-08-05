import { Routes } from "@angular/router";
import { PublicLayoutComponent } from "./layout/public-layout/public-layout.component";
import { HomeComponent } from "./features/public-site/pages/home/home.component";
import { HomeTwoComponent } from "./features/public-site/pages/home-two/home-two.component";
import { ContactComponent } from "./features/public-site/pages/contact/contact.component";
import { AboutUsComponent } from "./features/public-site/pages/about-us/about-us.component";


export const routes: Routes = [
  // ============ SITIO PÚBLICO ============
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeTwoComponent, data: { title: 'Inicio - Glazing™' } },
      { path: 'homevideo', component: HomeComponent, data: { title: 'Inicio - Glazing™' } },
      { path: 'contact', component: ContactComponent, data: { title: 'Contacto - Glazing™' } },
      { path: 'about', component: AboutUsComponent, data: { title: 'Nosotros - Glazing™' } },


    ]
  },

  // ============ AUTENTICACIÓN ============
  //   { path: 'login', component: LoginComponent, data: { title: 'Iniciar Sesión' } },
  //   { path: 'register', component: RegisterComponent, data: { title: 'Registrarse' } },

  // ============ ÁREA DE MIEMBROS ============

  // ============ PANEL ADMINISTRATIVO ============

  // ============ REDIRECCIONES Y ERRORES ============
  //   { path: '404', component: NotFoundComponent, data: { title: 'Página no encontrada' } },
  //   { path: '**', redirectTo: '404' }
  
];