# Inventario de Componentes y Estado de Integración API

## Propósito del Documento

Este documento proporciona un inventario completo de todos los componentes del sistema, sus dependencias y el estado actual de integración con la API del backend.

---

## 🎨 Componentes Compartidos (Shared)

### Ubicación
`/src/app/shared/components/`

### Catálogo de Componentes Reutilizables

#### 1. **StatsGridComponent**
- **Ruta**: `/shared/components/stats-grid/`
- **Propósito**: Tarjetas de estadísticas en formato grid
- **Input**: Array de objetos con `{ title, value, icon, change }`
- **Usado en**: Dashboard, Statistics, Property List, Leads Inbox
- **Estado**: ✅ Funcional

#### 2. **StatsCardComponent**
- **Ruta**: `/shared/components/stats-card/`
- **Propósito**: Tarjeta individual de estadística
- **Input**: `title`, `value`, `icon`, `changePercent`, `changeType`
- **Usado en**: Múltiples páginas del área de miembros
- **Estado**: ✅ Funcional

#### 3. **PropertyCardComponent**
- **Ruta**: `/shared/components/property-card/`
- **Propósito**: Tarjeta de propiedad para listados
- **Input**: Objeto `Property`
- **Output**: Eventos de click, favorito, compartir
- **Usado en**: Property Listing, Agent Profile, Home
- **Estado**: ✅ Funcional
- **Origen de datos**: Recibe property como @Input

#### 4. **AgentCardComponent**
- **Ruta**: `/shared/components/agent-card/`
- **Propósito**: Tarjeta de asesor
- **Input**: Objeto `Agent`
- **Usado en**: Agent Listing, Team Page
- **Estado**: ✅ Funcional

#### 5. **SearchBarComponent**
- **Ruta**: `/shared/components/search-bar/`
- **Propósito**: Barra de búsqueda con filtros avanzados
- **Input**: Configuración de filtros
- **Output**: Evento con filtros seleccionados
- **Usado en**: Home, Property Listing
- **Servicios**: `PropertySearchService`
- **Estado**: ✅ Funcional

#### 6. **FiltersComponent**
- **Ruta**: `/shared/components/filters/`
- **Propósito**: Panel de filtros laterales
- **Input**: Opciones de filtrado
- **Output**: Filtros aplicados
- **Usado en**: Property Listing, Agent Listing
- **Estado**: ✅ Funcional

#### 7. **PaginationComponent**
- **Ruta**: `/shared/components/pagination/`
- **Propósito**: Controles de paginación reutilizables
- **Input**: `currentPage`, `totalPages`, `itemsPerPage`
- **Output**: Evento de cambio de página
- **Usado en**: Todos los listados
- **Estado**: ✅ Funcional

#### 8. **LoadingSpinnerComponent**
- **Ruta**: `/shared/components/loading-spinner/`
- **Propósito**: Indicador de carga
- **Input**: `size`, `color`, `message`
- **Usado en**: Toda la aplicación
- **Estado**: ✅ Funcional

#### 9. **ErrorMessageComponent**
- **Ruta**: `/shared/components/error-message/`
- **Propósito**: Mensajes de error estandarizados
- **Input**: `message`, `type`
- **Usado en**: Formularios y páginas con carga de datos
- **Estado**: ✅ Funcional

#### 10. **ImageGalleryComponent**
- **Ruta**: `/shared/components/image-gallery/`
- **Propósito**: Galería de imágenes con lightbox
- **Input**: Array de URLs de imágenes
- **Usado en**: Property Detail
- **Estado**: ✅ Funcional

#### 11. **MapComponent**
- **Ruta**: `/shared/components/map/`
- **Propósito**: Mapa interactivo con Leaflet/Google Maps
- **Input**: `coordinates`, `markers`, `zoom`
- **Usado en**: Property Detail, Contact, Property Listing (vista mapa)
- **Servicios**: `GeocodingService`
- **Estado**: ✅ Funcional

#### 12. **ContactFormComponent**
- **Ruta**: `/shared/components/contact-form/`
- **Propósito**: Formulario de contacto reutilizable
- **Input**: `context` (general, property, agent)
- **Output**: Evento de envío
- **Servicios**: `LeadService`
- **Estado**: ✅ Funcional con mock

---

## 🏠 Componentes del Sitio Público

### Estructura por Página

#### Home / FairwayHomeComponent

**Ubicación**: `/features/public-site/pages/fairway-home/`

**Componentes hijos utilizados:**
- `SearchBarComponent` - Búsqueda principal
- `PropertyCardComponent` - Propiedades destacadas
- `StatsGridComponent` - Estadísticas de la inmobiliaria
- `TestimonialsComponent` - Testimonios de clientes
- `AgentCardComponent` - Equipo destacado

**Servicios inyectados:**
- `PropertyService` → Propiedades destacadas (mock)
- `AgentService` → Asesores destacados (mock)
- `ContenidoEstaticoService` → Testimonios, stats (mock)

**Estado de integración**: ⏳ Mock data

---

#### PropertyListingComponent

**Ubicación**: `/features/public-site/pages/property-listing/`

**Componentes hijos:**
- `FiltersComponent` - Panel de filtros lateral
- `SearchBarComponent` - Búsqueda rápida
- `PropertyCardComponent` - Grid de propiedades
- `PaginationComponent` - Navegación de páginas
- `MapViewComponent` - Vista de mapa alternativa

**Servicios:**
- `PropertyService` → Listado con filtros (mock)
- `PropertySearchService` → Estado de búsqueda

**Lógica clave:**
```typescript
// El componente aplica filtros y paginación
```

**Estado de integración**: ⏳ Mock - API preparada

---

#### PropertyDetailComponent

**Ubicación**: `/features/public-site/pages/property-detail/`

**Componentes hijos:**
- `ImageGalleryComponent` - Galería principal
- `MapComponent` - Ubicación en mapa
- `ContactFormComponent` - Formulario de consulta
- `PropertyCardComponent` - Propiedades relacionadas
- `AgentCardComponent` - Asesor asignado

**Servicios:**
- `PropertyService.getPropiedadPorId()` → Datos de la propiedad (mock)
- `LeadService` → Envío de consulta (mock)
- `PropertyService.getRelacionadas()` → Sugerencias (mock)

**Estado de integración**: ⏳ Mock - API preparada

---

#### AgentListingComponent

**Ubicación**: `/features/public-site/pages/agent-listing/`

**Componentes hijos:**
- `AgentCardComponent` - Grid de asesores
- `SearchBarComponent` - Búsqueda de asesores

**Servicios:**
- `AgentService.getAll()` → Listado (mock)

**Estado de integración**: ⏳ Mock - API preparada

---

#### AgentProfileComponent

**Ubicación**: `/features/public-site/pages/agent-profile/`

**Componentes hijos:**
- `PropertyCardComponent` - Propiedades del asesor
- `ContactFormComponent` - Contacto directo
- `StatsCardComponent` - Métricas del asesor

**Servicios:**
- `AgentService.getById()` → Perfil (mock)
- `PropertyService.getByAgent()` → Propiedades filtradas (mock)
- `LeadService` → Consultas (mock)

**Estado de integración**: ⏳ Mock - API preparada

---

#### ContactComponent

**Ubicación**: `/features/public-site/pages/contact/`

**Componentes hijos:**
- `ContactFormComponent` - Formulario principal
- `MapComponent` - Ubicación de oficinas

**Servicios:**
- `ContactFormService` → Envío (mock/API)
- `ContactPageService` → Info de contacto (JSON estático)

**Estado de integración**: ⏳ Formulario mock

---

## 👔 Componentes del Área de Miembros

### Dashboard

**Ubicación**: `/features/member-area/pages/dashboard/`

**Componentes hijos:**
- `StatsGridComponent` - Métricas principales
- `ChartComponent` - Gráficos de tendencias
- `RecentActivityComponent` - Actividad reciente
- `QuickActionsComponent` - Accesos rápidos

**Servicios:**
- `StatisticsService` → Métricas generales (mock)
- `PropertyService` → Propiedades recientes (mock)
- `LeadService` → Consultas recientes (mock)

**Estado de integración**: ⏳ Mock - Preparado para API

---

### PropertyListComponent (Admin)

**Ubicación**: `/features/member-area/pages/properties/property-list/`

**Componentes hijos:**
- `StatsCardComponent` - Resumen de propiedades
- `DataTableComponent` - Tabla con propiedades
- `FilterPanelComponent` - Filtros avanzados
- `ActionButtonsComponent` - Acciones (editar, eliminar, etc.)

**Servicios:**
- `PropertiesAdminService.getAll()` → Listado completo (mock)
- `PropertiesAdminService.delete()` → Eliminación (mock)
- `PropertiesAdminService.updateStatus()` → Cambio de estado (mock)

**Permisos**: Administrador ve todas, asesor ve solo las suyas

**Estado de integración**: ⏳ Mock - API lista

---

### PropertyFormComponent (Admin)

**Ubicación**: `/features/member-area/pages/properties/property-form/`

**Componentes hijos:**
- `ImageUploadComponent` - Upload múltiple
- `LocationPickerComponent` - Selector de ubicación con mapa
- `CharacteristicsEditorComponent` - Editor de características
- `PriceCalculatorComponent` - Calculadora de precios

**Servicios:**
- `PropertiesAdminService.create()` → Crear (mock)
- `PropertiesAdminService.update()` → Actualizar (mock)
- `ImageUploadService` → Cloudinary (✅ FUNCIONAL)
- `GeocodingService` → Geocodificación (✅ FUNCIONAL)

**Formulario reactivo:**
```typescript
```

**Estado de integración**: 
- ⏳ CRUD: Mock
- ✅ Upload imágenes: Cloudinary funcional
- ✅ Geocodificación: Funcional

---

### LeadsInboxComponent

**Ubicación**: `/features/member-area/pages/leads/`

**Componentes hijos:**
- `StatsCardsComponent` - Métricas de consultas
- `LeadsTableComponent` - Tabla con filtros
- `LeadDetailModalComponent` - Modal con detalle
- `FiltersPanelComponent` - Filtros por estado

**Servicios:**
- `LeadsAdminService.getAll()` → Listado (mock: 80+ leads)
- `LeadsAdminService.updateStatus()` → Cambiar estado (mock)
- `LeadsAdminService.assignToAgent()` → Asignar asesor (mock)

**Estados de leads**: Nueva, En proceso, Respondida, Convertida, Descartada

**Estado de integración**: ⏳ Mock completo - API preparada

---

### StatisticsComponent

**Ubicación**: `/features/member-area/pages/statistics/`

**Componentes hijos:**
- `StatsGridComponent` - Tarjetas de métricas
- `ChartBarComponent` - Gráficos de barras
- `ChartPieComponent` - Gráficos circulares
- `PropertyRankingComponent` - Ranking de propiedades
- `AdvisorsTableComponent` - Tabla de asesores (solo admin)
- `DateRangePickerComponent` - Selector de período

**Servicios:**
- `StatisticsService.getPropertyMetrics()` → Métricas de propiedades (mock calculado)
- `StatisticsService.getLeadMetrics()` → Métricas de leads (mock calculado)
- `StatisticsService.getAgentPerformance()` → Desempeño (mock calculado)
- `StatisticsService.exportToCSV()` → Exportar datos

**Cálculos automáticos:**
- Total de propiedades por estado
- Tasa de conversión de leads
- Propiedades más vistas
- Distribución por tipo y operación
- Desempeño de asesores (propiedades asignadas, leads recibidos)

**Estado de integración**: ⏳ Mock calculado dinámicamente - Preparado para API

---

### ContentListComponent (CMS)

**Ubicación**: `/features/member-area/pages/content/content-list/`

**Tipos de contenido gestionados:**
1. **Testimonios** - Opiniones de clientes
2. **Beneficios** - Ventajas de trabajar con la inmobiliaria
3. **FAQs** - Preguntas frecuentes
4. **Banners** - Imágenes promocionales

**Componentes hijos:**
- `ContentTableComponent` - Tabla específica por tipo
- `ActionButtonsComponent` - Editar, eliminar, cambiar estado

**Servicios:**
- `ContentAdminService.getByType()` → Listado por tipo (mock)
- `ContentAdminService.delete()` → Eliminar (mock)

**Estado de integración**: ⏳ Mock - API preparada

---

### ContentFormComponent (CMS)

**Ubicación**: `/features/member-area/pages/content/content-form/`

**Formulario dinámico** que se adapta según el tipo de contenido

**Testimonio:**
**Beneficio:**
**FAQ:**
**Banner:**

**Servicios:**
- `ContentAdminService.create()` → Crear (mock)
- `ContentAdminService.update()` → Actualizar (mock)
- `ImageUploadService` → Upload de imágenes (✅ Cloudinary)

**Estado de integración**: ⏳ Mock - Imágenes via Cloudinary

---

### StaticPagesListComponent

**Ubicación**: `/features/member-area/pages/static-pages/static-pages-list/`

**Propósito**: Gestionar páginas estáticas del sitio (Sobre Nosotros, Términos, Privacidad, etc.)

**Servicios:**
- `StaticPagesService.getAll()` → Listado (mock)

**Estado de integración**: ⏳ Mock

---

### StaticPageEditorComponent

**Ubicación**: `/features/member-area/pages/static-pages/static-page-editor/`

**Componentes hijos:**
- `WysiwygEditorComponent` - Editor HTML rich text
- `PreviewComponent` - Vista previa del contenido

**Servicios:**
- `StaticPagesService.getById()` → Cargar página (mock)
- `StaticPagesService.update()` → Guardar (mock)

**Estado de integración**: ⏳ Mock

---

### NotificationsPageComponent

**Ubicación**: `/features/member-area/pages/notifications/`

**Componentes hijos:**
- `NotificationListComponent` - Lista de notificaciones
- `FilterBarComponent` - Filtros por tipo y estado

**Tipos de notificaciones:**
- Nueva consulta asignada
- Propiedad actualizada
- Comentario en propiedad
- Recordatorio de seguimiento
- Sistema (mantenimiento, actualizaciones)

**Servicios:**
- `NotificacionesService.getAll()` → Listado (mock)
- `NotificacionesService.markAsRead()` → Marcar leída (mock)
- `NotificacionesService.markAllAsRead()` → Marcar todas (mock)

**Estado de integración**: ⏳ Mock completo - Sistema funcional

---

## 📦 Servicios por Módulo

### Core Services (`/src/app/core/services/`)

| Servicio | Propósito | Mock Data | API Ready | Estado |
|----------|-----------|-----------|-----------|--------|
| `PropertyService` | CRUD propiedades públicas | ✅ 50 props | ✅ | ⏳ Mock activo |
| `AgentService` | CRUD asesores públicos | ✅ 12 agents | ✅ | ⏳ Mock activo |
| `LeadService` | Consultas públicas | ✅ | ✅ | ⏳ Mock activo |
| `StatisticsService` | Estadísticas y reportes | ✅ Calculado | ✅ | ⏳ Mock activo |
| `NotificacionesService` | Sistema de notificaciones | ✅ | ✅ | ⏳ Mock activo |
| `ImageUploadService` | Upload a Cloudinary | ❌ | ✅ | ✅ **FUNCIONAL** |
| `GeocodingService` | Geocodificación direcciones | ❌ | ✅ | ✅ **FUNCIONAL** |
| `PropertySearchService` | Estado de búsqueda | ❌ | N/A | ✅ Funcional |
| `SEOService` | Meta tags dinámicos | ❌ | N/A | ✅ Funcional |
| `SanitizerService` | Sanitización HTML | ❌ | N/A | ✅ Funcional |
| `RecaptchaService` | Validación reCAPTCHA | ❌ | ✅ | ✅ **FUNCIONAL** |
| `ContenidoEstaticoService` | Contenido del sitio | ✅ JSON | ✅ | ⏳ Mock activo |

### Member Area Services (`/features/member-area/services/`)

| Servicio | Propósito | Mock Data | API Ready | Estado |
|----------|-----------|-----------|-----------|--------|
| `PropertiesAdminService` | CRUD propiedades admin | ✅ | ✅ | ⏳ Mock activo |
| `AgentsAdminService` | CRUD asesores admin | ✅ | ✅ | ⏳ Mock activo |
| `LeadsAdminService` | Gestión de consultas | ✅ 80+ leads | ✅ | ⏳ Mock activo |
| `ContentAdminService` | CMS contenido | ✅ | ✅ | ⏳ Mock activo |
| `AuthService` | Autenticación JWT | ✅ 5 users | ✅ | ⏳ Mock activo |
| `ProfileService` | Perfil de usuario | ✅ | ✅ | ⏳ Mock activo |
| `TrainingService` | Cursos capacitación | ✅ JSON | ✅ | ⏳ Mock activo |
| `MenuService` | Menú dinámico | ✅ JSON | ❌ | ✅ Funcional |

---

## 🔄 Patrón de Integración Mock/API

### Implementación Actual

Todos los servicios siguen este patrón:

```typescript
@Injectable({ providedIn: 'root' })
export class PropertyService {
  private apiUrl = `${environment.apiUrl}/propiedades`;
  private http = inject(HttpClient);
  
  // ⚙️ Flag de control
  private useMockData = true; // ← Cambiar a false para usar API real
  
  getPropiedades(filtros?: SearchFilters): Observable<RespuestaPaginada<Property>> {
    if (this.useMockData) {
      return this.getPropiedadesMock(filtros); // Devuelve Observable con datos mock
    }
    
    // Llamada real a la API
    const params = this.buildParams(filtros);
    return this.http.get<RespuestaPaginada<Property>>(this.apiUrl, { params });
  }
  
  private getPropiedadesMock(filtros?: SearchFilters): Observable<RespuestaPaginada<Property>> {
    // Simula delay de red
    return of({
      data: MOCK_PROPIEDADES.filter(p => this.matchFilters(p, filtros)),
      total: MOCK_PROPIEDADES.length,
      pagina: 1,
      porPagina: 10,
      totalPaginas: Math.ceil(MOCK_PROPIEDADES.length / 10)
    }).pipe(delay(500)); // Simula latencia
  }
}
```

---

### Integración (Cuando backend esté listo)

#### Paso 1: Configuración
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.fairway-inmobiliaria.com/api/v1', // ← URL real
  cloudinary: { /* config actual */ },
  recaptcha: { /* config actual */ }
};
```

#### Paso 2: Activar API en servicios
Cambiar en cada servicio:
```typescript
private useMockData = false; // ← Cambiar de true a false
```

Servicios a actualizar:
- [ ] `PropertyService`
- [ ] `AgentService`
- [ ] `LeadService`
- [ ] `StatisticsService`
- [ ] `NotificacionesService`
- [ ] `PropertiesAdminService`
- [ ] `AgentsAdminService`
- [ ] `LeadsAdminService`
- [ ] `ContentAdminService`
- [ ] `AuthService`
- [ ] `ProfileService`
- [ ] `TrainingService`
- [ ] `StaticPagesService`

#### Paso 3: Validar Respuestas
Verificar que el backend devuelve el formato esperado:

**Listado paginado:**
```typescript
{
  "data": Property[],
  "total": number,
  "pagina": number,
  "porPagina": number,
  "totalPaginas": number
}
```

**Objeto individual:**
```typescript
{
  "data": Property,
  "mensaje": string (opcional)
}
```

**Error:**
```typescript
{
  "error": string,
  "mensaje": string,
  "codigo": number
}
```
---


### Backend (Requerimientos)

#### Endpoints Críticos
1. **Autenticación**
   - `POST /api/auth/login`
   - `POST /api/auth/refresh-token`
   - `POST /api/auth/logout`

2. **Propiedades**
   - `GET /api/propiedades` (con filtros y paginación)
   - `GET /api/propiedades/:id`
   - `POST /api/propiedades` (admin)
   - `PUT /api/propiedades/:id` (admin)
   - `DELETE /api/propiedades/:id` (admin)
   - `PATCH /api/propiedades/:id/estado` (admin)

3. **Asesores**
   - `GET /api/asesores` (público)
   - `GET /api/asesores/:id` (público)
   - CRUD endpoints (admin)

4. **Consultas/Leads**
   - `POST /api/consultas` (público)
   - `GET /api/consultas` (admin)
   - `PATCH /api/consultas/:id/estado` (admin)
   - `PATCH /api/consultas/:id/asignar` (admin)

5. **Estadísticas**
   - `GET /api/estadisticas/propiedades`
   - `GET /api/estadisticas/consultas`
   - `GET /api/estadisticas/asesores` (admin)

6. **CMS**
   - CRUD de testimonios
   - CRUD de beneficios
   - CRUD de FAQs
   - CRUD de banners
   - CRUD de páginas estáticas

7. **Notificaciones**
   - `GET /api/notificaciones`
   - `PATCH /api/notificaciones/:id/leer`
   - WebSocket para tiempo real (opcional)

---

## 🔗 Referencias

- [Mapa de Rutas y Arquitectura](./MAPA_DE_RUTAS_Y_ARQUITECTURA.md)
- [Documentación de API Backend](./API_BACKEND_INMOBILIARIA.md)
- [Documentación de Filtros](./FILTROS_PROPIEDADES.md)

---
