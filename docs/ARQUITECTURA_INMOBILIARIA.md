# Módulo Inmobiliaria - Documentación Técnica

> Documentación del módulo de propiedades: sitio público y panel de administración.
> Última actualización: Febrero 2026

---

## 1. Arquitectura General

### Stack técnico

| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 18.2 | Framework principal, standalone components |
| Bootstrap | 5.3.2 | Grid system y componentes base |
| Leaflet | 1.9.4 | Mapas interactivos (OpenStreetMap) |
| leaflet.markercluster | 1.5.3 | Agrupación de markers en mapa |
| Cloudinary | CDN | Upload y optimización de imágenes |
| Quill | 2.0.2 | Editor rich-text para descripciones |
| DOMPurify | 3.3.1 | Sanitización de HTML |
| RxJS | 7.8 | Programación reactiva |
| Angular SSR | 18.2.6 | Server-side rendering con TransferState |

### Por qué estas librerías

- **Leaflet sobre Google Maps**: es open-source, sin costos por requests, y con `markercluster` maneja bien cientos de propiedades sin perder performance.
- **Cloudinary**: permite subir imágenes y generar transformaciones on-the-fly (thumbnails, crop por cara, formatos webp). Evita tener un servidor de imágenes propio.
- **Quill**: editor WYSIWYG liviano para que los asesores carguen descripciones con formato. Se sanitiza con DOMPurify antes de renderizar.
- **Angular Signals**: reemplacé BehaviorSubjects en el search service por signals. Son más simples de leer, no requieren unsubscribe y se integran nativamente con la detección de cambios.

### Patrón Mock/API

Todos los servicios tienen un flag `useMockData = true`. Cuando el backend esté listo, se cambia a `false` y los métodos ya apuntan al endpoint real vía `HttpClient`. No hay que reescribir lógica.

```typescript
// Ejemplo en cualquier servicio:
getPropiedades(filtros?: FiltrosBusqueda) {
  if (this.useMockData) {
    return this.getPropiedadesMock(filtros);
  }
  const params = this.construirParamsHttp(filtros);
  return this.http.get<RespuestaPaginada<Propiedad>>(this.apiUrl, { params });
}
```

---

## 2. Estructura de Carpetas

```
src/app/
├── core/
│   ├── models/
│   │   ├── index.ts                      # Re-exports centralizados
│   │   ├── property.interface.ts         # Propiedad, Ubicacion, Caracteristicas, Imagen
│   │   ├── search-filters.interface.ts   # FiltrosBusqueda, RespuestaPaginada, FiltrosUsuarios
│   │   ├── user.interface.ts             # Usuario, PerfilAsesor, DTOs
│   │   ├── agent.interface.ts            # Agente (legacy), usuarioToAgente()
│   │   ├── lead.interface.ts             # Contacto
│   │   ├── geocoding.interface.ts
│   │   ├── statistics.interface.ts
│   │   ├── notificacion.interface.ts
│   │   └── testimonio.interface.ts
│   │
│   ├── services/
│   │   ├── property.service.ts           # Lectura pública de propiedades
│   │   ├── property-search.service.ts    # Estado de búsqueda con signals
│   │   ├── agent.service.ts              # Lectura pública de agentes
│   │   ├── lead.service.ts               # Envío y gestión de consultas
│   │   ├── cloudinary.service.ts         # Upload de imágenes a CDN
│   │   ├── geocoding.service.ts          # Dirección → coordenadas
│   │   └── mock-data/
│   │       └── properties.mock.ts        # MOCK_PROPIEDADES
│   │
│   └── guards/
│       └── can-deactivate.guard.ts       # Protección de cambios sin guardar
│
├── features/
│   ├── public-site/
│   │   ├── pages/
│   │   │   ├── property-listing/         # /properties, /buy, /rent
│   │   │   ├── property-detail/          # /property/:id
│   │   │   ├── agent-listing/            # /team
│   │   │   └── agent-profile/            # /team/:id
│   │   │
│   │   └── components/
│   │       ├── property-card/            # Tarjeta de propiedad reutilizable
│   │       ├── property-filters/         # Panel de filtros avanzados
│   │       ├── property-search-bar/      # Barra de búsqueda con operación/tipo/precio
│   │       ├── property-gallery/         # Galería con lightbox y tabs (fotos/video/360)
│   │       ├── property-map/             # Mapa Leaflet con clustering
│   │       ├── property-contact-form/    # Formulario de consulta con reCAPTCHA
│   │       ├── property-agent-card/      # Card del asesor en detalle
│   │       ├── related-properties/       # Propiedades similares
│   │       ├── featured-properties/      # Destacadas para homepage
│   │       ├── property-skeleton/        # Skeleton de tarjeta
│   │       └── property-detail-skeleton/ # Skeleton de detalle
│   │
│   └── member-area/
│       ├── pages/properties/
│       │   ├── property-list/            # Tabla admin con filtros y stats
│       │   └── property-form/            # Formulario crear/editar propiedad
│       │
│       ├── components/
│       │   └── property-ranking/         # Ranking de propiedades por performance
│       │
│       ├── services/
│       │   └── properties-admin.service.ts  # CRUD completo para admin
│       │
│       └── guards/
│           └── auth.guard.ts             # Protección de rutas privadas
```

### Justificación de la estructura

- **`core/models/`**: los modelos viven en core porque los usan tanto el sitio público como el panel admin. El `index.ts` re-exporta todo para que los imports sean limpios: `import { Propiedad, FiltrosBusqueda } from '@core/models'`.
- **`core/services/`**: servicios de lectura pública (PropertyService, AgentService) van en core porque se inyectan desde cualquier feature module.
- **`features/member-area/services/`**: el `PropertiesAdminService` vive en member-area porque solo lo usan componentes admin. Tiene CRUD completo, mientras que el público solo lee.
- **Componentes vs Páginas**: las páginas son lo que se asocia a una ruta. Los componentes son piezas reutilizables que reciben data por `@Input()`.

---

## 3. Rutas del Módulo

### Sitio Público (dentro de PublicLayoutComponent)

| Ruta | Componente | Descripción |
|---|---|---|
| `/properties` | PropertyListingComponent | Listado general con filtros |
| `/buy` | PropertyListingComponent | Listado pre-filtrado por `operacion: 'venta'` |
| `/rent` | PropertyListingComponent | Listado pre-filtrado por `operacion: 'alquiler'` |
| `/property/:id` | PropertyDetailComponent | Detalle completo de propiedad |
| `/team` | AgentListingComponent | Listado de asesores activos |
| `/team/:id` | AgentProfileComponent | Perfil público del asesor |

Redirects legacy: `/propiedades` → `/properties`, `/comprar` → `/buy`, `/alquilar` → `/rent`, `/equipo` → `/team`.

### Panel Admin (dentro de AdminLayoutComponent, protegido por authGuard)

| Ruta | Componente | Guard |
|---|---|---|
| `/member-area/propiedades` | PropertyListComponent | authGuard |
| `/member-area/propiedades/nueva` | PropertyFormComponent | authGuard + canDeactivateGuard |
| `/member-area/propiedades/editar/:id` | PropertyFormComponent | authGuard + canDeactivateGuard |
| `/member-area/mis-propiedades` | PropertyListComponent | authGuard |

---

## 4. Sistema de Diseño SCSS

### Variables globales

Archivo: `src/assets/styles/_variables.scss`

```scss
// Colores de marca Fairway
$green-fairway: #1a4d2e;      // Color primario
$green-dark: #0f3820;          // Variante oscura (hovers, gradients)
$green-accent: #2b8b52;        // Acento verde claro
$orange-fairway: #e6962e;      // Acento naranja (CTAs secundarios)
$yellow-warm: #f4a541;         // Acento cálido

// Neutros
$white: #ffffff;
$gray-light: #d9d9d9;
$gray-medium: #8c8c8c;
```

### Tipografía

Definida en `src/styles.scss`:

```scss
:root {
  --font-primary: 'Poppins', sans-serif;      // Headings y UI
  --font-secondary: 'Inter', sans-serif;       // Cuerpo de texto
}
```

### Colores usados en componentes de propiedades

Cada componente define sus propias variables locales, pero siguen esta paleta:

```scss
// Textos
$text-dark: #1e293b;
$text-muted: #64748b;

// Fondos
$bg-light: #f8fafc;        // Fondo de páginas
$bg-border: #e2e8f0;       // Bordes de inputs y cards

// Estados de propiedad
Disponible: linear-gradient(135deg, #10b981, #059669)   // Verde
Reservado:  linear-gradient(135deg, #f59e0b, #d97706)   // Ámbar
Vendido:    linear-gradient(135deg, #6b7280, #4b5563)   // Gris

// Operaciones
Venta:   #10B981 (verde)  // También para markers del mapa
Alquiler: #3B82F6 (azul)

// Acciones de contacto
WhatsApp: #25D366
Teléfono: #3b82f6
```

### Patrones de estilo repetidos

**Cards**: `border-radius: 12px`, `box-shadow: 0 2px 8px rgba(0,0,0,0.08)`, hover con `translateY(-4px)`.

**Inputs**: `padding: 0.75rem`, `border: 1px solid #e2e8f0`, `border-radius: 8px`, focus con `box-shadow: 0 0 0 3px rgba($green-fairway, 0.1)`.

**Botones primarios**: `background: linear-gradient(135deg, $green-fairway, $green-dark)`, `border-radius: 8px`, `font-weight: 600`.

**Imágenes de propiedades**: aspect ratio 3:2 (`padding-top: 66.67%`).

### Breakpoints responsive

```scss
// Aplicados en cada componente con @media
Desktop:  1200px+
Tablet:   768px - 991px
Mobile:   < 768px
Small:    < 640px
Smallest: < 480px (font-size baja a 14px)
```

### Estructura SCSS por componente

Cada componente tiene su `.scss` encapsulado (ViewEncapsulation default de Angular). No hay un archivo SCSS global para propiedades. Las variables de marca se importan desde `_variables.scss` solo en `styles.scss`, y los componentes definen las suyas localmente.

---

## 5. Modelos

### Propiedad (entidad principal)

Archivo: `src/app/core/models/property.interface.ts`

```typescript
interface Propiedad {
  id: number;
  titulo: string;
  descripcion: string;
  tipoPropiedad: string;   // 'casa' | 'departamento' | 'ph' | 'local' | 'oficina' | 'terreno'
  operacion: string;        // 'venta' | 'alquiler'
  precio: number;
  moneda: string;           // 'USD' | 'ARS'
  ubicacion: Ubicacion;
  caracteristicas: Caracteristicas;
  imagenes: Imagen[];
  estado: string;           // 'disponible' | 'reservado' | 'vendido' | 'alquilado'
  destacada: boolean;
  visible: boolean;         // Si se muestra en el sitio público
  asesorId: number;
  fechaPublicacion: string;
  ultimaActualizacion: string;
  agente?: AgenteInfo;      // Se enriquece en el servicio, no viene del backend
}

interface Ubicacion {
  direccion: string;
  barrio?: string;
  ciudad: string;
  provincia: string;
  pais: string;
  coordenadas: Coordenadas;
}

interface Coordenadas { lat: number; lng: number; }

interface Caracteristicas {
  ambientes: number;
  dormitorios: number;
  banos: number;
  superficie_cubierta: number;   // m2
  superficie_total: number;      // m2
  antiguedad: number;            // años
  garage: number;
  amenidades: string[];          // ['pileta', 'parrilla', 'gym', ...]
}

interface Imagen { url: string; descripcion: string; }

interface AgenteInfo {
  id: number;
  nombre: string;    // Nombre completo ("Juan Pérez")
  telefono: string;
  email: string;
  fotoUrl: string;
}
```

`AgenteInfo` es una versión reducida del agente que se embebe en la propiedad. El `PropertyService` la genera a partir del `Usuario` vinculado por `asesorId`. En el backend real, esto se resolvería con un `?expand=agente` o similar.

### Filtros de Búsqueda

Archivo: `src/app/core/models/search-filters.interface.ts`

```typescript
interface FiltrosBusqueda {
  operacion?: string;                // 'venta' | 'alquiler'
  tipoPropiedad?: string | string[]; // Acepta uno o varios tipos
  ubicacion?: string;                // Texto libre: busca en ciudad, provincia, dirección
  provincia?: string;
  ciudad?: string;
  barrio?: string;
  precioMinimo?: number;
  precioMaximo?: number;
  moneda?: string;                   // 'USD' | 'ARS'
  ambientes?: number;                // Se interpreta como mínimo
  ambientesMinimo?: number;
  ambientesMaximo?: number;
  dormitorios?: number;              // Se interpreta como mínimo
  dormitoriosMinimo?: number;
  dormitoriosMaximo?: number;
  banos?: number;                    // Se interpreta como mínimo
  banosMinimo?: number;
  superficieMinima?: number;
  superficieMaxima?: number;
  garageMinimo?: number;
  antiguedadMaxima?: number;
  amenidades?: string[];
  soloDestacadas?: boolean;
  estado?: string;
  ordenarPor?: OrdenBusqueda;
  ordenDireccion?: 'asc' | 'desc';
  pagina?: number;
  porPagina?: number;
  limite?: number;                   // Alias para porPagina
}

type OrdenBusqueda =
  | 'reciente' | 'precio_menor' | 'precio_mayor' | 'superficie_mayor'
  | 'precio' | 'fecha' | 'superficie' | 'relevancia';
```

### Respuesta Paginada

```typescript
interface RespuestaPaginada<T> {
  datos: T[];
  items?: T[];          // Alias de compatibilidad
  total?: number;       // Alias de compatibilidad
  paginacion: InfoPaginacion;
}

interface InfoPaginacion {
  paginaActual: number;
  porPagina: number;
  totalItems: number;
  totalPaginas: number;
  tieneSiguiente: boolean;
  tieneAnterior: boolean;
  total?: number;       // Alias para totalItems
}
```

### Usuario y Perfil de Asesor

Archivo: `src/app/core/models/user.interface.ts`

```typescript
type RolUsuario = 'admin' | 'asesor';

interface Usuario {
  id: number;
  email: string;
  passwordHash: string;
  rol: RolUsuario;
  activo: boolean;
  nombre: string;
  apellido: string;
  telefono: string;
  fotoUrl: string;
  fechaRegistro: string;
  ultimoAcceso?: string;
  destacado?: boolean;
  perfilAsesor?: PerfilAsesor;    // Solo para rol 'asesor'
}

interface PerfilAsesor {
  cargo: string;                   // "Agente Asociado", "Broker"
  especialidad?: string;
  slogan?: string;
  biografia?: string;
  experienciaAnios?: number;
  idiomas?: string[];
  whatsapp?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  propiedadesVendidas?: number;
  propiedadesActivas?: number;
  clientesSatisfechos?: number;
  certificaciones?: string[];
  premios?: string[];
  destacado?: boolean;
}
```

DTOs del usuario:

```typescript
interface CrearUsuarioDto {
  email: string; password: string; rol: RolUsuario;
  nombre: string; apellido: string; telefono: string;
  fotoUrl?: string; perfilAsesor?: Partial<PerfilAsesor>;
}

interface ActualizarUsuarioDto {
  nombre?: string; apellido?: string; email?: string;
  telefono?: string; fotoUrl?: string; activo?: boolean;
  destacado?: boolean; perfilAsesor?: Partial<PerfilAsesor>;
}

interface TokenRecuperacion {
  id: number; usuarioId: number; token: string;
  fechaCreacion: Date; fechaExpiracion: Date; usado: boolean;
}

interface EstadisticasAsesor {
  totalPropiedades: number; propiedadesVenta: number;
  propiedadesAlquiler: number; valorTotalCartera: number;
  moneda: string; consultasRecibidas?: number;
}

interface ReasignacionPropiedadesDto {
  usuarioOrigenId: number; usuarioDestinoId: number;
  propiedadesIds: number[];
}
```

### Agente (DTO público)

Archivo: `src/app/core/models/agent.interface.ts`

Este es el modelo que consume el sitio público (agent-listing, agent-profile, property-agent-card). Representa lo que devolvería `GET /api/v1/agentes` — solo datos seguros para mostrar, sin campos internos como `passwordHash` o `rol`. El panel admin trabaja con `Usuario + PerfilAsesor`. En modo mock, la función `usuarioToAgente()` convierte de un formato al otro; con backend real esa conversión la hace el servidor.

```typescript
interface Agente {
  id: number; usuarioId: number;
  nombre: string; apellido: string;
  email: string; telefono: string; fotoUrl: string;
  cargo: string; especialidad?: string;
  slogan?: string; biografia?: string;
  experienciaAnios?: number; idiomas?: string[];
  whatsapp?: string; linkedin?: string;
  instagram?: string; facebook?: string;
  propiedadesVendidas?: number; propiedadesActivas?: number;
  clientesSatisfechos?: number;
  certificaciones?: string[]; premios?: string[];
  activo: boolean; destacado?: boolean;
}

interface ValoracionAgente {
  id: number; agenteId: number;
  clienteNombre: string; clienteAvatar?: string;
  comentario: string; calificacion: number;  // 1-5
  fecha: Date; propiedad?: string;
}
```

### Contacto (Lead)

Archivo: `src/app/core/models/lead.interface.ts`

```typescript
interface Contacto {
  id: number;
  propiedadId: number;
  asesorId: number | null;      // null = sin asignar
  nombreContacto: string;
  emailContacto: string;
  telefonoContacto: string;
  mensaje: string;
  fechaEnvio: string;
  respondida: boolean;
  recaptchaToken?: string;      // Solo en envío, no se persiste
}
```

### Filtros de Admin (propiedades)

Definidos en `properties-admin.service.ts`:

```typescript
interface PropertyFilters {
  search?: string;          // Busca en título, dirección, ciudad
  operacion?: string;
  tipoPropiedad?: string;
  estado?: string;
  asesorId?: number;
  pagina?: number;
  limite?: number;
}

interface PropertyStats {
  total: number;
  disponibles: number;
  reservadas: number;
  vendidas: number;
  alquiladas: number;
  destacadas: number;
}
```

### Filtros de Usuarios

Definidos en `search-filters.interface.ts`:

```typescript
interface FiltrosUsuarios {
  search?: string;           // nombre, apellido, email
  busqueda?: string;         // Alias
  rol?: 'admin' | 'asesor';
  activo?: boolean;
  destacado?: boolean;
  ordenarPor?: 'nombre' | 'email' | 'fechaRegistro' | 'ultimoAcceso';
  ordenDireccion?: 'asc' | 'desc';
  pagina?: number;
  limite?: number;
  porPagina?: number;
}
```

---

## 6. Servicios y Llamadas a la API

### PropertyService (lectura pública)

Archivo: `src/app/core/services/property.service.ts`
Inyección: `providedIn: 'root'`

| Método | Retorno | Descripción |
|---|---|---|
| `getPropiedades(filtros?)` | `Observable<RespuestaPaginada<Propiedad>>` | Listado con filtros y paginación |
| `getPropiedadPorId(id)` | `Observable<Propiedad \| null>` | Propiedad por ID |
| `getPropiedadesDestacadas(limite=6)` | `Observable<Propiedad[]>` | Propiedades destacadas |
| `getPropiedadesRecientes(limite=6)` | `Observable<Propiedad[]>` | Más recientes |
| `getPropiedadesRelacionadas(id, limite=4)` | `Observable<Propiedad[]>` | Similares por tipo y operación |
| `contarPropiedades(filtros?)` | `Observable<number>` | Total filtrado |
| `setUseMockData(useMock)` | `void` | Cambiar entre mock y API |

Internamente enriquece cada propiedad con `AgenteInfo` leyendo `usuarios.json` y cacheando con `shareReplay(1)`. Usa `TransferState` para SSR.

**Endpoints reales** (cuando `useMockData = false`):
- `GET {apiUrl}/propiedades` + query params
- `GET {apiUrl}/propiedades/:id`
- `GET {apiUrl}/propiedades/:id/relacionadas`
- `GET {apiUrl}/propiedades/contar`

### PropertySearchService (estado de búsqueda)

Archivo: `src/app/core/services/property-search.service.ts`
Inyección: `providedIn: 'root'`

Maneja el estado reactivo de la búsqueda con Angular signals. No hace llamadas HTTP directas; delega en `PropertyService`.

**Signals públicos (readonly):**

```typescript
filters: Signal<FiltrosBusqueda>           // Filtros actuales
loading: Signal<boolean>                    // Estado de carga
error: Signal<string | null>                // Error si hubo
results: Signal<RespuestaPaginada | null>   // Última respuesta

// Computed
properties: Signal<Propiedad[]>             // results.datos
totalResults: Signal<number>                // results.paginacion.totalItems
pagination: Signal<InfoPaginacion | null>
hasResults: Signal<boolean>
```

**Métodos principales:**

| Método | Descripción |
|---|---|
| `updateFilters(newFilters)` | Actualiza filtros y resetea a página 1 |
| `setFilter(key, value)` | Actualiza un filtro individual |
| `clearFilters()` | Resetea a defaults (`operacion: 'venta', pagina: 1, limite: 12`) |
| `clearSpecificFilters(...keys)` | Limpia filtros puntuales |
| `search()` | Ejecuta búsqueda con filtros actuales |
| `searchWithFilters(newFilters)` | Actualiza filtros y busca en un paso |
| `navigateToResults()` | Navega a `/properties` con filtros como query params |
| `searchAndNavigate(newFilters?)` | Actualiza y navega |
| `syncFromQueryParams(queryParams)` | Sincroniza state desde URL |
| `goToPage(page)` | Ir a página específica |
| `nextPage()` / `previousPage()` | Paginación secuencial |

**Sincronización con URL:** los filtros se convierten a query params y viceversa. La URL es la fuente de verdad en el listing. Valores default (página 1, límite 12) no se incluyen en la URL para mantenerla limpia.

### PropertiesAdminService (CRUD admin)

Archivo: `src/app/features/member-area/services/properties-admin.service.ts`
Inyección: `providedIn: 'root'`

| Método | Retorno | HTTP Real |
|---|---|---|
| `getProperties(filters?)` | `Observable<Propiedad[]>` | `GET /api/v1/admin/properties` |
| `getPropertiesPaginated(filters?)` | `Observable<RespuestaPaginada<Propiedad>>` | `GET /api/v1/admin/properties` |
| `getPropertyById(id)` | `Observable<Propiedad \| null>` | `GET /api/v1/admin/properties/:id` |
| `createProperty(propiedad)` | `Observable<Propiedad>` | `POST /api/v1/admin/properties` |
| `updateProperty(id, data)` | `Observable<Propiedad>` | `PUT /api/v1/admin/properties/:id` |
| `deleteProperty(id)` | `Observable<boolean>` | `DELETE /api/v1/admin/properties/:id` |
| `changeStatus(id, estado)` | `Observable<Propiedad>` | Usa `updateProperty` internamente |
| `toggleDestacada(id)` | `Observable<Propiedad>` | Usa `updateProperty` internamente |
| `getStats(asesorId?)` | `Observable<PropertyStats>` | Calculado desde el state |
| `uploadImage(file)` | `Observable<Imagen>` | Delega en `CloudinaryService` |

En modo mock usa un `BehaviorSubject<Propiedad[]>` como store local. El CRUD opera sobre ese state con actualizaciones optimistas.

**Datos estáticos disponibles:**
- `getTiposPropiedad()`: `['departamento', 'casa', 'ph', 'oficina', 'local', 'terreno']`
- `getOperaciones()`: `['venta', 'alquiler']`
- `getEstados()`: `['disponible', 'reservado', 'vendido', 'alquilado']`
- `getAmenidades()`: `['balcon', 'terraza', 'jardin', 'patio', 'pileta', 'gym', 'sum', 'parrilla', 'cochera', 'lavadero', 'baulera', 'seguridad-24hs', 'aire-acondicionado', 'calefaccion', 'laundry', 'solarium', 'spa', 'recepcion']`

### LeadService (consultas de contacto)

Archivo: `src/app/core/services/lead.service.ts`
Inyección: `providedIn: 'root'`

| Método | Retorno | HTTP Real |
|---|---|---|
| `submitInquiry(contact)` | `Observable<Contacto>` | `POST {apiUrl}/contactos` |
| `inquireAboutProperty(propertyId, data)` | `Observable<Contacto>` | Atajo para `submitInquiry` |
| `scheduleVisit(propertyId, data)` | `Observable<Contacto>` | Genera mensaje predefinido de visita |
| `getInquiries(filters?)` | `Observable<RespuestaPaginada<Contacto>>` | `GET {apiUrl}/contactos` |
| `getInquiryById(id)` | `Observable<Contacto>` | `GET {apiUrl}/contactos/:id` |
| `markAsAnswered(id)` | `Observable<Contacto>` | `PATCH {apiUrl}/contactos/:id` |
| `getStatistics()` | `Observable<{...}>` | `GET {apiUrl}/contactos/estadisticas` |

El `submitInquiry` recibe `Omit<Contacto, 'id' | 'fechaEnvio' | 'respondida'>`, o sea, solo los campos que llena el formulario.

### CloudinaryService

Archivo: `src/app/core/services/cloudinary.service.ts`
Inyección: `providedIn: 'root'`

| Método | Descripción |
|---|---|
| `uploadImage(file, subfolder?)` | Upload genérico. Valida tipo imagen y max 10MB |
| `uploadAgentPhoto(file)` | Upload en carpeta `agents` |
| `uploadPropertyImage(file)` | Upload en carpeta `properties` |
| `uploadContentImage(file)` | Upload en carpeta `content` |
| `getTransformedUrl(publicId, options)` | Genera URL con transformaciones (width, height, crop, quality, format, gravity) |
| `getAgentThumbnail(url)` | Thumbnail 400x400 con crop en cara |
| `getPropertyImage(url, size)` | Imagen optimizada: thumb (400x300), medium (800x600), large (1200x800) |
| `isConfigured()` | Retorna si Cloudinary está configurado |

Si Cloudinary no está configurado (`cloudName` vacío o `TU_CLOUD_NAME`), opera en modo mock con URLs de Unsplash.

**Interfaz de resultado:**

```typescript
interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  originalFilename: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}
```

---

## 7. Componentes Públicos

### PropertyCardComponent

**Input:** `propiedad: Propiedad`, `compactMode: boolean`
**Muestra:** imagen con aspect ratio 3:2, badge de operación y estado, precio formateado, features rápidos (ambientes, dormitorios, baños, m²), info del agente con botones de WhatsApp/teléfono/email, botón de favorito.

### PropertyFiltersComponent

**Input:** `filtrosActivos: FiltrosBusqueda`
**Output:** `filtrosChange`, `limpiarFiltros`, `cerrar`
**Filtros disponibles:** tipo de propiedad (dropdown), rango de precio con selector de moneda, ambientes (1+ a 4+), dormitorios (1+ a 4+), baños (1+ a 3+), garage (1+ a 3+), rango de superficie (m²), amenidades (checkboxes). Conteo de filtros activos.

### PropertySearchBarComponent

**Input:** `navigateOnSearch: boolean`, `initialFilters?`
**Integración:** usa `PropertySearchService`. Selector de operación (Comprar/Alquilar), tipo de propiedad, ubicación (texto libre), rango de precio, moneda.

### PropertyGalleryComponent

**Input:** `imagenes: Imagen[]`, `titulo: string`, `videoUrl?`, `video360Url?`
**Features:** imagen principal + grid de thumbnails (primeros 5), indicador "+N fotos", lightbox modal con navegación por teclado (Escape, flechas), tabs Fotos/Videos/360°, contador de imágenes.

### PropertyMapComponent

**Input:** `propiedades: Propiedad[]`
**Features:** Leaflet con tiles de OpenStreetMap, markers custom (verde venta, azul alquiler), clustering con `markercluster`, popup con preview, click navega a detalle, auto-fit de bounds. SSR safe (solo carga en browser).

### PropertyContactFormComponent

**Input:** `propiedadId`, `propiedadTitulo`, `agenteId`, `agenteNombre`, `agenteEmail`
**Output:** `formSubmit`
**Campos:** nombre (min 2), email (validado), teléfono (pattern), mensaje (min 10, pre-llenado).
**Features:** integración reCAPTCHA, loading state, mensajes success/error con auto-dismiss (5s), envío vía `LeadService`.

### PropertyAgentCardComponent

**Input:** `agente: AgenteInfo`, `propertyTitle: string`
**Muestra:** foto, nombre, botones de contacto (WhatsApp con mensaje armado, teléfono, email). Link al perfil del agente.

### Skeletons

`PropertySkeletonComponent` y `PropertyDetailSkeletonComponent`: placeholders animados que se muestran mientras cargan los datos.

---

## 8. Componentes Admin

### PropertyListComponent

**Features:** tabla de propiedades con búsqueda por texto, filtros por estado/operación/tipo, estadísticas rápidas (cards con totales por estado), acciones rápidas (editar, eliminar, toggle visibilidad, toggle destacada), paginación. Admin ve todas las propiedades, asesor ve solo las suyas.

### PropertyFormComponent

**Modo:** detecta si es creación o edición según la presencia de `:id` en la ruta.
**Tabs del formulario:**
1. **Básicos:** título (min 10), descripción (min 50, editor Quill), tipo, operación, precio, moneda, estado, destacada, visible, asesor asignado.
2. **Ubicación:** dirección, barrio, ciudad, provincia, país, mapa interactivo con geocoding (dirección → coordenadas automático).
3. **Características:** ambientes, dormitorios, baños, superficie cubierta/total, antigüedad, garage, amenidades (checkboxes).
4. **Imágenes:** upload múltiple vía Cloudinary, drag & drop, gestión de thumbnails, descripción por imagen.

**Guards:** `canDeactivateGuard` pregunta antes de navegar si hay cambios sin guardar.

---

## 9. Flujo de Datos

### Búsqueda pública (listing)

```
URL query params
  → PropertyListingComponent.ngOnInit()
    → PropertySearchService.syncFromQueryParams()
      → PropertySearchService.search()
        → PropertyService.getPropiedades(filtros)
          → (mock) filtrar + paginar + enriquecer con agente
          → (real) HTTP GET con params
        → PropertySearchService._results.set(response)
          → Signal update propaga a componentes
```

### Detalle de propiedad

```
Route param :id
  → PropertyDetailComponent.ngOnInit()
    → PropertyService.getPropiedadPorId(id)
    → PropertyService.getPropiedadesRelacionadas(id)
    → (ambos en paralelo)
```

### CRUD admin

```
PropertyFormComponent
  → submit()
    → PropertiesAdminService.createProperty() o .updateProperty()
      → (mock) actualiza BehaviorSubject
      → (real) POST/PUT a /api/v1/admin/properties
    → router.navigate(['/member-area/propiedades'])
```

### Envío de consulta

```
PropertyContactFormComponent
  → onSubmit()
    → LeadService.submitInquiry({
        propiedadId, asesorId,
        nombreContacto, emailContacto,
        telefonoContacto, mensaje
      })
    → Mostrar mensaje de éxito/error
```

---

## 10. Activar API Real

Cuando el backend esté listo:

1. Configurar `environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.fairway.com/api/v1',
  cloudinary: { cloudName: '...', uploadPreset: '...', folder: 'fairway' },
  recaptcha: { siteKey: '...' }
};
```

2. Cambiar el flag en cada servicio:
```typescript
private useMockData = false;
```

Servicios a actualizar:
- `PropertyService`
- `PropertiesAdminService`
- `LeadService`
- `AgentService`
- `AuthService`

3. Verificar que el backend responda con el formato `RespuestaPaginada<T>`:
```json
{
  "datos": [...],
  "paginacion": {
    "paginaActual": 1,
    "porPagina": 12,
    "totalItems": 150,
    "totalPaginas": 13,
    "tieneSiguiente": true,
    "tieneAnterior": false
  }
}
```

Los query params que envía el frontend son los mismos campos de `FiltrosBusqueda`, serializados como strings o arrays separados por comas.
