# 🖼️ Gestión de Imágenes con Cloudinary

## Descripción General

Este proyecto está preparado para usar **Cloudinary** como servicio de almacenamiento y optimización de imágenes.

---

## 📋 Configuración Inicial

### 1. Crear Cuenta en Cloudinary

1. Registrarse en: https://cloudinary.com/users/register/free
2. Completar el registro y verificar email
3. Acceder al Dashboard

### 2. Obtener Credenciales

En el Dashboard de Cloudinary encontrarás:

```
Cloud Name: tu_cloud_name
API Key: 123456789012345
API Secret: AbCdEfGhIjKlMnOpQrStUvWxYz
```

### 3. Crear Upload Preset (Importante!)

Un **Upload Preset** permite subir imágenes sin usar tu API Secret (más seguro para frontend).

**Pasos:**
1. En Dashboard → Settings → Upload
2. Scroll hasta "Upload presets"
3. Click en "Add upload preset"
4. Configuración recomendada:
   ```
   Preset name: fairway_unsigned
   Signing Mode: Unsigned ⚠️ (Importante!)
   Folder: fairway
   Unique filename: true
   Overwrite: false
   ```
5. En "Transformations" (opcional):
   ```
   Max dimensions: 2000x2000
   Format: Auto
   Quality: Auto
   ```
6. Guardar

### 4. Configurar en Angular

Editar `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',

  cloudinary: {
    cloudName: 'tu_cloud_name',        // ⬅️ REEMPLAZAR
    uploadPreset: 'fairway_unsigned',  // Nombre del preset creado
    folder: 'fairway-dev'              // Carpeta para desarrollo
  }
};
```

Editar `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.fairway.com/api',

  cloudinary: {
    cloudName: 'tu_cloud_name',        // ⬅️ REEMPLAZAR
    uploadPreset: 'fairway_prod',      // Crear otro preset para prod
    folder: 'fairway'                  // Carpeta de producción
  }
};
```

---

## 🚀 Uso en el Código

### Subir Imágenes

El servicio `CloudinaryService` tiene métodos específicos para cada tipo de contenido:

```typescript
import { CloudinaryService } from '@core/services/cloudinary.service';


// Subir foto de agente
uploadAgentPhoto(file: File) {
}

// Subir imagen de propiedad
uploadPropertyImage(file: File) {
}

// Subir imagen de contenido (banners, testimonios)
uploadContentImage(file: File) {
}

// Subir a carpeta personalizada
uploadCustom(file: File) {
}
```

### Optimizar Imágenes Existentes

Usa el pipe `optimizeImage` para optimizar automáticamente las URLs:

```html
<!-- Thumbnail pequeño (400x300) -->
<img [src]="propertyImage | optimizeImage:'thumb'" alt="Propiedad">

<!-- Tamaño medio (800x600) - Default -->
<img [src]="propertyImage | optimizeImage:'medium'" alt="Propiedad">

<!-- Tamaño grande (1200x800) -->
<img [src]="propertyImage | optimizeImage:'large'" alt="Propiedad">

<!-- Foto de agente (400x400, cara centrada) -->
<img [src]="agentPhoto | optimizeImage:'agent'" alt="Agente">
```

**Ventajas del pipe:**
- ✅ Redimensiona automáticamente según tamaño
- ✅ Optimiza calidad y formato (WebP automático)
- ✅ Funciona con Cloudinary, Unsplash y URLs locales
- ✅ Muestra placeholder si no hay imagen

---

## 📦 Estructura de Carpetas en Cloudinary

Las imágenes se organizan automáticamente en carpetas:

```
cloudinary/
└── fairway-dev/              (o 'fairway' en producción)
    ├── agents/               → Fotos de agentes
    ├── properties/           → Imágenes de propiedades
    └── content/              → Banners, testimonios, etc.
```

---

## 🎨 Transformaciones Disponibles

### Desde el Código

```typescript
// Generar URL con transformaciones específicas
const optimizedUrl = this.cloudinary.getTransformedUrl(publicId, {
  width: 800,
  height: 600,
  crop: 'fill',
  quality: 'auto',
  format: 'auto',
  gravity: 'center'
});
```

### Desde el Template

```html
<!-- El pipe hace estas transformaciones automáticamente -->
<img [src]="imageUrl | optimizeImage:'thumb'">
<!-- Resultado: w_400,h_300,c_fill,q_auto,f_auto/imagen.jpg -->
```

---

## 🔄 Modo Mock (Sin Cloudinary)

Si **NO** se configura Cloudinary, el servicio funciona en **modo mock**:

- ✅ Uploads simulados (usa imágenes de Unsplash)
- ✅ Delay de 1.5s para simular upload real
- ✅ Útil para desarrollo sin cuenta de Cloudinary

**Verificar estado:**

```typescript
if (this.cloudinary.isConfigured()) {
  console.log('Cloudinary está configurado ✅');
} else {
  console.log('Usando modo MOCK ⚠️');
}

// Ver configuración actual
const config = this.cloudinary.getConfig();
console.log(config);
// { cloudName: 'mi_cloud', folder: 'fairway', isConfigured: true }
```

---

## 📱 Optimización para Móviles

### Responsive Images

Sirve diferentes tamaños según el dispositivo:

```html
<picture>
  <!-- Móvil: thumbnail -->
  <source 
    media="(max-width: 576px)" 
    [srcset]="image | optimizeImage:'thumb'">
  
  <!-- Tablet: medium -->
  <source 
    media="(max-width: 992px)" 
    [srcset]="image | optimizeImage:'medium'">
  
  <!-- Desktop: large -->
  <img 
    [src]="image | optimizeImage:'large'" 
    alt="Propiedad">
</picture>
```

### Lazy Loading

```html
<img 
  [src]="image | optimizeImage:'medium'" 
  loading="lazy"
  alt="Propiedad">
```

---

## 💰 Plan Gratuito

**Para un sitio web típico:** El plan gratuito es suficiente para:
- 100-200 propiedades con 5 fotos cada una
- Miles de visitas mensuales
- Renovación automática cada mes

---

## 🚀 Next Steps

1. [ ] Crear cuenta en Cloudinary
2. [ ] Configurar upload preset
3. [ ] Actualizar `environment.ts` y `environment.prod.ts`
4. [ ] Actualizar componentes de carga de imágenes
5. [ ] Implementar la pipe `optimizeImage` en todos los `<img>`

---
