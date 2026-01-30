# Mapa de Rutas y Arquitectura del Sistema

## Resumen General

Este documento describe la estructura completa de rutas, páginas y componentes del sistema Fairway Inmobiliaria. El proyecto está dividido en tres áreas principales:

1. **Sitio Público** - Portal de cara al cliente
2. **Área de Miembros** - Panel administrativo para gestión interna
3. **Sistema de Autenticación** - Control de acceso

---

## 🌐 Sitio Público

### Layout
- Componente: `PublicLayoutComponent`
- Ubicación: `/src/app/layout/public-layout/`
- Incluye: Header, Footer, Navegación principal

### Rutas Principales

#### 1. Homepage
- **Ruta**: `/`
- **Componente**: `FairwayHomeComponent`
- **Ubicación**: `/src/app/features/public-site/pages/fairway-home/`
- **Descripción**: Página principal optimizada para inmobiliaria con hero, destacados y llamados a la acción

#### 2. Propiedades

**Listado General**
- **Ruta**: `/properties`
- **Componente**: `PropertyListingComponent`
- **Ubicación**: `/src/app/features/public-site/pages/property-listing/`
- **Funcionalidad**: 
  - Búsqueda con filtros avanzados
  - Paginación
  - Vista de cuadrícula/lista
- **Origen de datos**: `PropertyService` → Mock data + preparado para API

**Venta**
- **Ruta**: `/buy`
- **Componente**: `PropertyListingComponent` (mismo que arriba)
- **Filtro predefinido**: `operacion: 'venta'`

**Alquiler**
- **Ruta**: `/rent`
- **Componente**: `PropertyListingComponent`
- **Filtro predefinido**: `operacion: 'alquiler'`

**Detalle de Propiedad**
- **Ruta**: `/property/:id`
- **Componente**: `PropertyDetailComponent`
- **Ubicación**: `/src/app/features/public-site/pages/property-detail/`
- **Funcionalidad**:
  - Galería de imágenes
  - Información completa
  - Formulario de consulta
  - Propiedades relacionadas
  - Mapa de ubicación
- **Origen de datos**: 
  - `PropertyService.getPropiedadPorId()` → Mock data
  - `LeadService` para consultas → Mock data

#### 3. Equipo / Asesores

**Listado de Asesores**
- **Ruta**: `/team`
- **Componente**: `AgentListingComponent`
- **Ubicación**: `/src/app/features/public-site/pages/agent-listing/`
- **Funcionalidad**: Grid con todos los asesores activos
- **Origen de datos**: `AgentService` → Mock data

**Perfil de Asesor**
- **Ruta**: `/team/:id`
- **Componente**: `AgentProfileComponent`
- **Ubicación**: `/src/app/features/public-site/pages/agent-profile/`
- **Funcionalidad**:
  - Información del asesor
  - Propiedades asignadas
  - Formulario de contacto directo
- **Origen de datos**: 
  - `AgentService.getAgentById()` → Mock data
  - Filtro de propiedades por asesor

#### 4. Páginas Institucionales

**Nosotros**
- **Ruta**: `/about`
- **Componente**: `AboutUsComponent`
- **Ubicación**: `/src/app/features/public-site/pages/about-us/`
- **Contenido**: Historia, misión, visión, equipo

**Contacto**
- **Ruta**: `/contact`
- **Componente**: `ContactComponent`
- **Ubicación**: `/src/app/features/public-site/pages/contact/`
- **Funcionalidad**:
  - Formulario de contacto
  - Información de oficinas
  - Mapa de ubicación
- **Origen de datos**: 
  - `ContactFormService` → Envío a API
  - `ContactPageService` → Info estática de contacto

#### 5. Productos y Servicios

**Detalle de Producto/Servicio**
- **Rutas**: 
  - `/product/:slug`
  - `/services/:slug`
- **Componente**: `ProductDetailComponent`
- **Ubicación**: `/src/app/features/public-site/pages/products/product-detail/`
- **Descripción**: Sistema flexible para mostrar servicios adicionales de la inmobiliaria

### Rutas Legacy (Compatibilidad)
El sistema mantiene estas rutas por compatibilidad pero redirigen a las nuevas

### Redirects Implementados
Para mantener URLs en español:
```
/propiedades → /properties
/comprar → /buy
/alquilar → /rent
/propiedad/:id → /property/:id
/equipo → /team
/equipo/:id → /team/:id
```

---

## 🔐 Área de Miembros
### Propósito
Panel administrativo para que asesores y administradores gestionen propiedades, consultas, contenido y estadísticas.

### Layout
- Componente: `AdminLayoutComponent`
- Ubicación: `/src/app/layout/admin-layout/`
- Incluye: Sidebar con menú dinámico, header con perfil de usuario
- **Protección**: Todas las rutas requieren autenticación (`authGuard`)

### Rutas por Módulo

#### 1. Autenticación

**Login**
- **Ruta**: `/member-area/login`
- **Componente**: `LoginComponent`
- **Ubicación**: `/src/app/features/member-area/pages/login/`
- **Descripción**: Sin layout, página independiente
- **Origen de datos**: `AuthService` → Mock data de usuarios

#### 2. Dashboard

**Panel Principal**
- **Ruta**: `/member-area/dashboard`
- **Componente**: `DashboardComponent`
- **Ubicación**: `/src/app/features/member-area/pages/dashboard/`
- **Funcionalidad**:
  - Resumen de métricas clave
  - Gráficos de rendimiento
  - Accesos rápidos
  - Actividad reciente
- **Origen de datos**: Múltiples servicios agregados

#### 3. Gestión de Propiedades

**Listado de Propiedades**
- **Rutas**: 
  - `/member-area/propiedades` (todas las propiedades - admin)
  - `/member-area/mis-propiedades` (propiedades del asesor)
- **Componente**: `PropertyListComponent`
- **Ubicación**: `/src/app/features/member-area/pages/properties/property-list/`
- **Funcionalidad**:
  - Tabla con filtros
  - Búsqueda
  - Acciones: Editar, Eliminar, Cambiar estado
  - Stats cards con resumen
- **Origen de datos**: `PropertiesAdminService` → Mock data

**Nueva Propiedad**
- **Ruta**: `/member-area/propiedades/nueva`
- **Componente**: `PropertyFormComponent`
- **Ubicación**: `/src/app/features/member-area/pages/properties/property-form/`
- **Funcionalidad**:
  - Formulario reactivo con validaciones
  - Upload de imágenes (Cloudinary)
  - Geocodificación de direcciones
  - Características dinámicas
- **Servicios utilizados**:
  - `PropertiesAdminService` → Guardado
  - `ImageUploadService` → Cloudinary
  - `GeocodingService` → Coordenadas GPS

**Editar Propiedad**
- **Ruta**: `/member-area/propiedades/editar/:id`
- **Componente**: `PropertyFormComponent` (mismo que crear)
- **Funcionalidad**: Carga datos existentes y permite modificación

#### 4. Gestión de Asesores (Solo Administradores)

**Listado de Asesores**
- **Ruta**: `/member-area/asesores`
- **Componente**: `AgentListComponent`
- **Ubicación**: `/src/app/features/member-area/pages/agents/agent-list/`
- **Funcionalidad**:
  - Vista de todos los asesores
  - Estadísticas por asesor
  - Gestión de estado (activo/inactivo)
- **Origen de datos**: `AgentsAdminService` → Mock data

**Nuevo Asesor**
- **Ruta**: `/member-area/asesores/nuevo`
- **Componente**: `AgentFormComponent`
- **Ubicación**: `/src/app/features/member-area/pages/agents/agent-form/`

**Editar Asesor**
- **Ruta**: `/member-area/asesores/editar/:id`
- **Componente**: `AgentFormComponent`

#### 5. Consultas / Leads

**Bandeja de Consultas**
- **Ruta**: `/member-area/consultas`
- **Componente**: `LeadsInboxComponent`
- **Ubicación**: `/src/app/features/member-area/pages/leads/`
- **Funcionalidad**:
  - Tabla de consultas
  - Filtros por estado (nueva, respondida, convertida)
  - Búsqueda
  - Asignación a asesores
  - Cambio de estados
  - Stats cards
- **Origen de datos**: `LeadsAdminService` → Mock data con 80+ consultas de ejemplo

#### 6. Notificaciones

**Centro de Notificaciones**
- **Ruta**: `/member-area/notificaciones`
- **Componente**: `NotificationsPageComponent`
- **Ubicación**: `/src/app/features/member-area/pages/notifications/`
- **Funcionalidad**:
  - Sistema de notificaciones en tiempo real
  - Filtros por tipo y estado
  - Marcar como leídas
  - Acciones directas desde notificación
- **Origen de datos**: `NotificacionesService` → Mock data

#### 7. Estadísticas y Reportes

**Dashboard de Estadísticas**
- **Ruta**: `/member-area/estadisticas`
- **Componente**: `StatisticsComponent`
- **Ubicación**: `/src/app/features/member-area/pages/statistics/`
- **Funcionalidad**:
  - Métricas de propiedades
  - Métricas de consultas/leads
  - Gráficos de distribución
  - Ranking de propiedades más vistas
  - Tabla de desempeño de asesores (solo admin)
  - Exportación a CSV
  - Filtros por período
- **Origen de datos**: `StatisticsService` → Mock data calculado

#### 8. Gestión de Contenido (CMS)

**Listado de Contenido**
- **Ruta**: `/member-area/contenido`
- **Componente**: `ContentListComponent`
- **Ubicación**: `/src/app/features/member-area/pages/content/content-list/`
- **Descripción**: Gestión de testimonios, beneficios, FAQs, banners
- **Origen de datos**: `ContentAdminService` → Mock data

**Formularios de Contenido**
Rutas disponibles:
- `/member-area/contenido/testimonios/nuevo`
- `/member-area/contenido/testimonios/editar/:id`
- `/member-area/contenido/beneficios/nuevo`
- `/member-area/contenido/beneficios/editar/:id`
- `/member-area/contenido/faqs/nuevo`
- `/member-area/contenido/faqs/editar/:id`
- `/member-area/contenido/banners/nuevo`
- `/member-area/contenido/banners/editar/:id`

**Componente**: `ContentFormComponent` (único formulario adaptable)
**Ubicación**: `/src/app/features/member-area/pages/content/content-form/`

#### 9. Páginas Estáticas

**Gestión de Páginas**
- **Ruta**: `/member-area/paginas-estaticas`
- **Componente**: `StaticPagesListComponent`
- **Ubicación**: `/src/app/features/member-area/pages/static-pages/static-pages-list/`
- **Descripción**: Lista de páginas estáticas del sitio

**Editor de Página**
- **Ruta**: `/member-area/paginas-estaticas/editar/:id`
- **Componente**: `StaticPageEditorComponent`
- **Ubicación**: `/src/app/features/member-area/pages/static-pages/static-page-editor/`
- **Funcionalidad**: Editor WYSIWYG para contenido HTML

#### 10. Perfil de Usuario

**Mi Perfil**
- **Ruta**: `/member-area/profile`
- **Componente**: `ProfileComponent`
- **Ubicación**: `/src/app/features/member-area/pages/profile/`
- **Funcionalidad**:
  - Edición de datos personales
  - Cambio de contraseña
  - Foto de perfil
- **Origen de datos**: `ProfileService` → Mock data

---

## 📊 Flujo de Datos
### Servicios

**Servicios con Mock Data:**
1. `PropertyService` - 50 propiedades de ejemplo
2. `AgentService` - 12 asesores de ejemplo
3. `LeadService` - 80+ consultas de ejemplo
4. `StatisticsService` - Cálculos automáticos basados en mock data
5. `NotificacionesService` - Sistema completo de notificaciones
6. `AuthService` - 5 usuarios de ejemplo (admin, asesores, etc.)
7. `LeadsAdminService` - Gestión completa de consultas
8. `ContentAdminService` - Testimonios, FAQs, etc.

**Servicios Externos ya Integrados:**
- ✅ Cloudinary - Upload de imágenes
- ✅ Nominatim (OpenStreetMap) - Geocodificación
- ✅ reCAPTCHA v3 - Protección de formularios


## 📁 Estructura de Archivos Mock

### Ubicación
`/src/assets/data/`

### Archivos Disponibles
- `cms-menu.json` - Menú del área de miembros
- `contact.json` - Información de contacto
- `courses.json` - Cursos de capacitación
- `leads.json` - Consultas de ejemplo
- `static-content.json` - Contenido estático
- `usuarios.json` - Usuarios de prueba
- `static-content/` - Carpeta con páginas estáticas

### Mock Data en Código
Algunos servicios tienen los datos directamente en el código:
- `MOCK_PROPIEDADES` en `/core/services/mock-data/properties.mock.ts`
- `MOCK_AGENTS` en `/core/services/mock-data/agents.mock.ts`
- `MOCK_LEADS` en `leads-admin.service.ts`

---

### Para Activar la API

**Paso 1**: En cada servicio, cambiar:
```typescript
private useMockData = true; // ❌ Cambiar a false
```

**Paso 2**: Verificar/actualizar URLs en `environment.ts`:
```typescript
export const environment = {
  apiUrl: 'http://backend.com/api', // ⚠️ Actualizar
  ...
};
```

**Paso 3**: Ajustar interfaces si el backend tiene diferencias