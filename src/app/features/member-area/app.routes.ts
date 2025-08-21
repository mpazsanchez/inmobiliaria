export const routes = [
  // ...otras rutas...
  {
    path: 'certificaciones',
    loadComponent: () => import('./pages/certifications/certifications.component').then(m => m.CertificationsComponent)
  },
  // ...otras rutas...
];