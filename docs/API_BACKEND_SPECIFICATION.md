# API Backend Specification - Fairway Inmobiliaria

> Documento de especificaciones de API para el equipo de Backend.
> Generado: Febrero 2026

---

## Tabla de Contenidos

1. [Información General](#1-información-general)
2. [Autenticación](#2-autenticación)
3. [Propiedades](#3-propiedades)
4. [Usuarios (Admin + Asesores)](#4-usuarios-admin--asesores)
5. [Leads/Contactos](#5-leadscontactos)
6. [Notificaciones](#6-notificaciones)
7. [Estadísticas](#7-estadísticas)
8. [Contenido Estático](#8-contenido-estático)
9. [Modelos de Datos](#9-modelos-de-datos)

---

## 1. Información General

### Base URL
```
Production: https://api.fairway.com/api/v1
Development: http://localhost:3000/api/v1
```

### Headers Comunes
```
Content-Type: application/json
Authorization: Bearer <token>  (para endpoints protegidos)
```

### Respuesta Estándar de Error
```typescript
{
  "error": true,
  "message": "Descripción del error",
  "code": "ERROR_CODE",
  "details"?: any
}
```

---

## 2. Autenticación

### POST `/auth/login`
**Descripción:** Iniciar sesión de usuario

**Request Body:**
```typescript
{
  email: string;      // required
  password: string;   // required
}
```

**Response 200:**
```typescript
{
  token: string;
  user: Usuario;
}
```

**Dónde se usa:**
- [login.component.ts](src/app/features/member-area/pages/login/login.component.ts) - Página de login del CMS

---

## 3. Propiedades

### GET `/propiedades`
**Descripción:** Obtener listado de propiedades con filtros y paginación

**Query Parameters:**
```typescript
{
  // Filtros básicos
  operacion?: 'venta' | 'alquiler';
  tipoPropiedad?: string | string[];  // 'casa', 'departamento', 'ph', 'oficina', 'terreno', 'local'
  ubicacion?: string;                  // texto libre: ciudad, barrio, zona
  provincia?: string;
  ciudad?: string;
  barrio?: string;

  // Filtros de precio
  precioMinimo?: number;
  precioMaximo?: number;
  moneda?: 'USD' | 'ARS';

  // Filtros de características
  ambientes?: number;
  ambientesMinimo?: number;
  ambientesMaximo?: number;
  dormitorios?: number;
  dormitoriosMinimo?: number;
  dormitoriosMaximo?: number;
  banos?: number;
  banosMinimo?: number;
  superficieMinima?: number;
  superficieMaxima?: number;
  garageMinimo?: number;
  antiguedadMaxima?: number;

  // Filtros de amenidades
  amenidades?: string[];  // ['pileta', 'parrilla', 'gym', etc]

  // Filtros de estado
  soloDestacadas?: boolean;
  estado?: 'disponible' | 'reservado' | 'vendido' | 'alquilado';

  // Ordenamiento
  ordenarPor?: 'reciente' | 'precio_menor' | 'precio_mayor' | 'superficie_mayor' | 'relevancia';
  ordenDireccion?: 'asc' | 'desc';

  // Paginación
  pagina?: number;        // default: 1
  porPagina?: number;     // default: 10, alias: limite
}
```

**Response 200:**
```typescript
{
  datos: Propiedad[];
  paginacion: {
    paginaActual: number;
    porPagina: number;
    totalItems: number;
    totalPaginas: number;
    tieneSiguiente: boolean;
    tieneAnterior: boolean;
  }
}
```

**Dónde se usa:**
- [property-listing.component.ts](src/app/features/public-site/pages/property-listing/property-listing.component.ts) - Listado público
- [property-list.component.ts](src/app/features/member-area/pages/properties/property-list/property-list.component.ts) - Admin listado

---

### GET `/propiedades/:id`
**Descripción:** Obtener detalle de una propiedad por ID

**Response 200:**
```typescript
Propiedad  // Ver modelo completo abajo
```

**Dónde se usa:**
- [property-detail.component.ts](src/app/features/public-site/pages/property-detail/property-detail.component.ts) - Detalle público
- [property-form.component.ts](src/app/features/member-area/pages/properties/property-form/property-form.component.ts) - Edición en admin

---

### GET `/propiedades/:id/relacionadas`
**Descripción:** Obtener propiedades similares

**Query Parameters:**
```typescript
{
  limite?: number;  // default: 4
}
```

**Response 200:**
```typescript
Propiedad[]
```

**Dónde se usa:**
- [related-properties.component.ts](src/app/features/public-site/components/related-properties/related-properties.component.ts)

---

### GET `/propiedades/contar`
**Descripción:** Obtener conteo de propiedades según filtros

**Query Parameters:** (mismos que GET /propiedades)

**Response 200:**
```typescript
number
```

---

### POST `/propiedades` (Admin)
**Descripción:** Crear nueva propiedad

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```typescript
{
  titulo: string;
  descripcion: string;
  tipoPropiedad: string;
  operacion: 'venta' | 'alquiler';
  precio: number;
  moneda: 'USD' | 'ARS';
  ubicacion: Ubicacion;
  caracteristicas: Caracteristicas;
  imagenes: Imagen[];
  estado: string;
  destacada: boolean;
  asesorId: number;
}
```

**Response 201:**
```typescript
Propiedad
```

**Dónde se usa:**
- [property-form.component.ts](src/app/features/member-area/pages/properties/property-form/property-form.component.ts)

---

### PUT `/propiedades/:id` (Admin)
**Descripción:** Actualizar propiedad existente

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Partial<Propiedad>

**Response 200:**
```typescript
Propiedad
```

---

### DELETE `/propiedades/:id` (Admin)
**Descripción:** Eliminar propiedad

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```typescript
{ success: true }
```

---

## 4. Usuarios (Admin + Asesores)

> **Nota:** En la arquitectura actual, los "agentes/asesores" son usuarios con `rol: 'asesor'`.
> No existe una entidad "Agente" separada. Los datos públicos del asesor están en `perfilAsesor`.

### GET `/usuarios`
**Descripción:** Obtener listado de usuarios

**Query Parameters:**
```typescript
{
  rol?: 'admin' | 'asesor';
  activo?: boolean;
  destacado?: boolean;
  limite?: number;
  busqueda?: string;
}
```

**Response 200:**
```typescript
Usuario[]
```

**Dónde se usa:**
- [agent-listing.component.ts](src/app/features/public-site/pages/agent-listing/agent-listing.component.ts) - Listado público (filtro: rol=asesor, activo=true)
- [user-list.component.ts](src/app/features/member-area/pages/users/user-list/user-list.component.ts) - Admin

---

### GET `/usuarios/:id`
**Descripción:** Obtener detalle de un usuario

**Query Parameters:**
```typescript
{
  expand?: 'propiedades' | 'estadisticas' | 'propiedades,estadisticas';
}
```

**Response 200:**
```typescript
Usuario
```

**Dónde se usa:**
- [agent-profile.component.ts](src/app/features/public-site/pages/agent-profile/agent-profile.component.ts)

---

### GET `/usuarios/:id/propiedades`
**Descripción:** Obtener propiedades de un usuario/asesor

**Response 200:**
```typescript
Propiedad[]
```

---

### GET `/usuarios/:id/estadisticas`
**Descripción:** Obtener estadísticas de un asesor

**Response 200:**
```typescript
{
  totalPropiedades: number;
  propiedadesVenta: number;
  propiedadesAlquiler: number;
  valorTotalCartera: number;
  moneda: string;
  consultasRecibidas?: number;
}
```

---

### GET `/usuarios/destacados`
**Descripción:** Obtener asesores destacados para home

**Query Parameters:**
```typescript
{
  limite?: number;  // default: 4
}
```

**Response 200:**
```typescript
Usuario[]  // Solo usuarios con rol='asesor' y destacado=true
```

---

### POST `/usuarios` (Admin)
**Descripción:** Crear nuevo usuario

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```typescript
{
  email: string;
  password: string;
  rol: 'admin' | 'asesor';
  nombre: string;
  apellido: string;
  telefono: string;
  fotoUrl?: string;
  perfilAsesor?: Partial<PerfilAsesor>;  // Solo para rol='asesor'
}
```

**Response 201:**
```typescript
Usuario
```

---

### PUT `/usuarios/:id` (Admin)
**Descripción:** Actualizar usuario

**Request Body:**
```typescript
{
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  fotoUrl?: string;
  activo?: boolean;
  destacado?: boolean;
  perfilAsesor?: Partial<PerfilAsesor>;
}
```

**Response 200:**
```typescript
Usuario
```

---

### PUT `/usuarios/:id/password` (Admin o propio usuario)
**Descripción:** Cambiar contraseña

**Request Body:**
```typescript
{
  passwordActual: string;  // Requerido si es el propio usuario
  nuevaPassword: string;
}
```

**Response 200:**
```typescript
{ success: true }
```

---

### PATCH `/usuarios/:id/estado` (Admin)
**Descripción:** Activar/desactivar usuario

**Request Body:**
```typescript
{
  activo: boolean;
}
```

**Response 200:**
```typescript
Usuario
```

---

### DELETE `/usuarios/:id` (Admin)
**Response 200:**
```typescript
{ success: true }
```

---

### GET `/usuarios/stats` (Admin)
**Descripción:** Estadísticas generales de usuarios

**Response 200:**
```typescript
{
  total: number;
  admins: number;
  asesores: number;
  activos: number;
  inactivos: number;
  destacados: number;
}
```

---

## 5. Leads/Contactos

### POST `/contactos`
**Descripción:** Enviar consulta de contacto (público)

**Request Body:**
```typescript
{
  propiedadId: number;
  asesorId: number;
  nombreContacto: string;
  emailContacto: string;
  telefonoContacto: string;
  mensaje: string;
  recaptchaToken?: string;  // Token de reCAPTCHA Enterprise
}
```

**Response 201:**
```typescript
{
  id: number;
  propiedadId: number;
  asesorId: number;
  nombreContacto: string;
  emailContacto: string;
  telefonoContacto: string;
  mensaje: string;
  fechaEnvio: string;  // ISO 8601
  respondida: boolean;
}
```

**Dónde se usa:**
- [property-contact-form.component.ts](src/app/features/public-site/components/property-contact-form/property-contact-form.component.ts)
- [contact-form.component.ts](src/app/features/public-site/components/contact/contact-form/contact-form.component.ts)

---

### GET `/contactos` (Admin)
**Descripción:** Obtener listado de consultas

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```typescript
{
  asesorId?: number;
  propiedadId?: number;
  respondida?: boolean;
  pagina?: number;
  porPagina?: number;
}
```

**Response 200:**
```typescript
{
  datos: Contacto[];
  paginacion: InfoPaginacion;
}
```

**Dónde se usa:**
- [leads-inbox.component.ts](src/app/features/member-area/pages/leads/leads-inbox.component.ts)

---

### GET `/contactos/:id` (Admin)
**Response 200:**
```typescript
Contacto
```

---

### PATCH `/contactos/:id` (Admin)
**Descripción:** Actualizar estado de consulta (marcar como respondida)

**Request Body:**
```typescript
{
  respondida: boolean;
}
```

**Response 200:**
```typescript
Contacto
```

---

### GET `/contactos/estadisticas` (Admin)
**Descripción:** Estadísticas de consultas

**Response 200:**
```typescript
{
  totalInquiries: number;
  pendingInquiries: number;
  answeredInquiries: number;
  inquiriesByAgent: { agentId: number; total: number }[];
  inquiriesByProperty: { propertyId: number; total: number }[];
}
```

---

## 6. Notificaciones

### GET `/notificaciones` (Admin)
**Descripción:** Obtener notificaciones del usuario actual

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
```typescript
{
  tipo?: TipoNotificacion;
  leida?: boolean;
  prioridad?: 'baja' | 'media' | 'alta' | 'urgente';
  desde?: string;  // ISO 8601
  hasta?: string;  // ISO 8601
  limite?: number;
}
```

**Response 200:**
```typescript
Notificacion[]
```

**Dónde se usa:**
- [notifications-bell.component.ts](src/app/layout/admin-layout/components/notifications-bell/notifications-bell.component.ts)
- [notifications-page.component.ts](src/app/features/member-area/pages/notifications/notifications-page.component.ts)

---

### PATCH `/notificaciones/:id/leer` (Admin)
**Descripción:** Marcar notificación como leída

**Response 200:**
```typescript
void
```

---

### PATCH `/notificaciones/leer-todas` (Admin)
**Descripción:** Marcar todas las notificaciones como leídas

**Response 200:**
```typescript
void
```

---

### DELETE `/notificaciones/:id` (Admin)
**Descripción:** Eliminar notificación

**Response 200:**
```typescript
void
```

---

## 7. Estadísticas

### GET `/estadisticas/resumen` (Admin)
**Descripción:** Resumen ejecutivo para dashboard

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```typescript
{
  propiedades: PropiedadesStats;
  consultas: ConsultasStats;
  visitas?: VisitasStats;
  topAsesores: AsesorStats[];
  propiedadesMasVistas: PropiedadVisitas[];
  ultimaActualizacion: string;
}
```

**Dónde se usa:**
- [dashboard.component.ts](src/app/features/member-area/pages/dashboard/dashboard.component.ts)
- [statistics.component.ts](src/app/features/member-area/pages/statistics/statistics.component.ts)

---

### GET `/estadisticas/propiedades` (Admin)
**Response 200:**
```typescript
{
  totalActivas: number;
  enVenta: number;
  enAlquiler: number;
  vendidas: number;
  alquiladas: number;
  reservadas: number;
  vendidasEsteMes: number;
  alquiladasEsteMes: number;
  nuevasEsteMes: number;
}
```

---

### GET `/estadisticas/propiedades/por-tipo` (Admin)
**Response 200:**
```typescript
{
  tipo: string;
  label: string;
  cantidad: number;
  porcentaje: number;
}[]
```

---

### GET `/estadisticas/propiedades/mas-vistas` (Admin)
**Query Parameters:**
```typescript
{ limite?: number }
```

**Response 200:**
```typescript
{
  propiedadId: number;
  titulo: string;
  visitas: number;
  compartidos: number;
  consultasGeneradas: number;
  tasaConversion: number;
}[]
```

---

### GET `/estadisticas/consultas` (Admin)
**Response 200:**
```typescript
{
  totalConsultas: number;
  consultasEsteMes: number;
  consultasSemana: number;
  consultasHoy: number;
  pendientes: number;
  respondidas: number;
  convertidas: number;
  tasaRespuesta: number;
  tasaConversion: number;
  tiempoPromedioRespuesta: string;
}
```

---

### GET `/estadisticas/consultas/por-mes` (Admin)
**Response 200:**
```typescript
{
  mes: string;
  anio: number;
  cantidad: number;
  respondidas: number;
  convertidas: number;
}[]
```

---

### GET `/estadisticas/asesores` (Admin)
**Response 200:**
```typescript
AsesorStats[]
```

---

### GET `/estadisticas/asesores/:id` (Admin)
**Response 200:**
```typescript
AsesorStats
```

---

### POST `/estadisticas/exportar` (Admin)
**Descripción:** Exportar datos a CSV/XLSX

**Request Body:**
```typescript
{
  tipo: 'propiedades' | 'consultas' | 'asesores';
  formato: 'csv' | 'xlsx';
  filtros?: FiltrosReporte;
  columnas?: string[];
}
```

**Response 200:**
```typescript
{
  success: boolean;
  filename?: string;
  error?: string;
  totalRegistros?: number;
}
```

---

## 8. Contenido Estático

### GET `/contenido/:pagina`
**Descripción:** Obtener contenido de página estática

**Parámetros de ruta:**
- `pagina`: 'nosotros' | 'contacto' | 'terminos' | 'privacidad' | 'faqs' | 'servicios'

**Response 200:**
```typescript
{
  pagina: string;
  titulo: string;
  contenidoHtml: string;
  ultimaActualizacion: string;
  editadoPor?: number;
  metaDescripcion?: string;
  metaKeywords?: string;
  publicada?: boolean;
}
```

**Dónde se usa:**
- [about-us.component.ts](src/app/features/public-site/pages/about-us/about-us.component.ts)
- [contact.component.ts](src/app/features/public-site/pages/contact/contact.component.ts)

---

### PUT `/contenido/:pagina` (Admin)
**Descripción:** Actualizar contenido de página estática

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```typescript
{
  titulo: string;
  contenidoHtml: string;
  metaDescripcion?: string;
  metaKeywords?: string;
  publicada?: boolean;
}
```

**Response 200:**
```typescript
ContenidoEstatico
```

**Dónde se usa:**
- [static-page-editor.component.ts](src/app/features/member-area/pages/static-pages/static-page-editor/static-page-editor.component.ts)

---

## 9. Modelos de Datos

### Propiedad
```typescript
interface Propiedad {
  id: number;
  titulo: string;
  descripcion: string;
  tipoPropiedad: string;  // 'departamento' | 'casa' | 'ph' | 'oficina' | 'local' | 'terreno'
  operacion: string;      // 'venta' | 'alquiler'
  precio: number;
  moneda: string;         // 'USD' | 'ARS'
  ubicacion: Ubicacion;
  caracteristicas: Caracteristicas;
  imagenes: Imagen[];
  estado: string;         // 'disponible' | 'reservado' | 'vendido' | 'alquilado'
  destacada: boolean;
  asesorId: number;
  fechaPublicacion: string;      // ISO 8601
  ultimaActualizacion: string;   // ISO 8601
  agente?: AgenteInfo;
}

interface Ubicacion {
  direccion: string;
  barrio?: string;
  ciudad: string;
  provincia: string;
  pais: string;
  coordenadas: {
    lat: number;
    lng: number;
  };
}

interface Caracteristicas {
  ambientes: number;
  dormitorios: number;
  banos: number;
  superficie_cubierta: number;
  superficie_total: number;
  antiguedad: number;
  garage: number;
  amenidades: string[];
}

interface Imagen {
  url: string;
  descripcion: string;
}

interface AgenteInfo {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  fotoUrl: string;
}
```

---

### Contacto (Lead)
```typescript
interface Contacto {
  id: number;
  propiedadId: number;
  asesorId: number;
  nombreContacto: string;
  emailContacto: string;
  telefonoContacto: string;
  mensaje: string;
  fechaEnvio: string;     // ISO 8601
  respondida: boolean;
  recaptchaToken?: string;  // Solo en envío
}
```

---

### Usuario
```typescript
type RolUsuario = 'admin' | 'asesor';

interface Usuario {
  id: number;

  // Autenticación
  email: string;
  passwordHash: string;   // Solo backend, nunca se envía al frontend
  rol: RolUsuario;
  activo: boolean;

  // Datos personales básicos
  nombre: string;
  apellido: string;
  telefono: string;
  fotoUrl: string;

  // Fechas de control
  fechaRegistro: string;   // ISO 8601
  ultimoAcceso?: string;   // ISO 8601

  // Visibilidad (para asesores en home)
  destacado?: boolean;

  // Extensión de perfil público (solo para rol='asesor')
  perfilAsesor?: PerfilAsesor;
}

// Datos públicos extendidos para asesores
interface PerfilAsesor {
  // Información profesional
  cargo: string;              // "Agente Asociado", "Broker", etc.
  especialidad?: string;      // "Propiedades de lujo", "Primera vivienda"
  slogan?: string;            // Frase breve para el listado
  biografia?: string;         // Biografía completa para perfil público
  experienciaAnios?: number;

  // Idiomas
  idiomas?: string[];         // ["Español", "Inglés", "Portugués"]

  // Redes sociales y contacto adicional
  whatsapp?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;

  // Estadísticas públicas
  propiedadesVendidas?: number;
  propiedadesActivas?: number;
  clientesSatisfechos?: number;

  // Certificaciones y logros
  certificaciones?: string[];
  premios?: string[];

  // Visibilidad
  destacado?: boolean;        // Para mostrar primero en listado público
}

// DTO para crear usuario
interface CrearUsuarioDto {
  email: string;
  password: string;
  rol: RolUsuario;
  nombre: string;
  apellido: string;
  telefono: string;
  fotoUrl?: string;
  perfilAsesor?: Partial<PerfilAsesor>;
}

// DTO para actualizar usuario
interface ActualizarUsuarioDto {
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  fotoUrl?: string;
  activo?: boolean;
  destacado?: boolean;
  perfilAsesor?: Partial<PerfilAsesor>;
}

// Estadísticas de asesor
interface EstadisticasAsesor {
  totalPropiedades: number;
  propiedadesVenta: number;
  propiedadesAlquiler: number;
  valorTotalCartera: number;
  moneda: string;
  consultasRecibidas?: number;
}
```

---

### Notificacion
```typescript
type TipoNotificacion =
  | 'nueva_consulta'
  | 'propiedad_vendida'
  | 'propiedad_alquilada'
  | 'nuevo_usuario'
  | 'usuario_pendiente'
  | 'asignacion_lead'
  | 'mensaje_nuevo'
  | 'propiedad_destacada'
  | 'vencimiento_propiedad'
  | 'sistema';

type PrioridadNotificacion = 'baja' | 'media' | 'alta' | 'urgente';

interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  prioridad: PrioridadNotificacion;
  leida: boolean;
  fechaCreacion: string;  // ISO 8601
  usuarioId: number;
  enlace?: string;
  icono?: string;
  entidadId?: number;
  entidadTipo?: string;
}
```

---

### Estadísticas
```typescript
interface PropiedadesStats {
  totalActivas: number;
  enVenta: number;
  enAlquiler: number;
  vendidas: number;
  alquiladas: number;
  reservadas: number;
  vendidasEsteMes: number;
  alquiladasEsteMes: number;
  nuevasEsteMes: number;
}

interface ConsultasStats {
  totalConsultas: number;
  consultasEsteMes: number;
  consultasSemana: number;
  consultasHoy: number;
  pendientes: number;
  respondidas: number;
  convertidas: number;
  tasaRespuesta: number;
  tasaConversion: number;
  tiempoPromedioRespuesta: string;
}

interface AsesorStats {
  asesorId: number;
  nombre: string;
  fotoUrl?: string;
  propiedadesActivas: number;
  propiedadesVendidas: number;
  propiedadesAlquiladas: number;
  consultasRecibidas: number;
  consultasRespondidas: number;
  consultasConvertidas: number;
  tasaConversion: number;
  tiempoPromedioRespuesta: string;
  ranking?: number;
  performanceScore: 'excelente' | 'bueno' | 'regular' | 'bajo';
}
```

---

## Notas para Backend

### Validaciones Requeridas
1. **Propiedades:**
   - `titulo`: max 200 caracteres
   - `precio`: > 0
   - `imagenes`: al menos 1 imagen requerida
   - Coordenadas válidas para Argentina

2. **Usuarios:**
   - `email`: único, formato válido
   - `telefono`: formato válido
   - `rol`: debe ser 'admin' o 'asesor'

3. **Contactos:**
   - Validar reCAPTCHA token si está presente
   - `emailContacto`: formato válido
