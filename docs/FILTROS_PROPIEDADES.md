# Sistema de Filtros de Propiedades - Documentación

## Resumen

Este documento describe el sistema de filtros implementado en el frontend para la búsqueda de propiedades. Incluye los query params esperados, la estructura de datos, y los requerimientos para el backend.

---

## 1. Query Parameters de la URL

Todos los filtros se sincronizan con la URL para permitir compartir búsquedas y mantener el estado al refrescar.

### Parámetros disponibles

| Parámetro | Tipo | Ejemplo | Descripción |
|-----------|------|---------|-------------|
| `operacion` | string | `venta`, `alquiler` | Tipo de operación |
| `tipoPropiedad` | string | `casa`, `departamento`, `ph`, `oficina`, `terreno`, `local` | Tipo de propiedad (puede ser múltiple separado por comas) |
| `ubicacion` | string | `Palermo, Buenos Aires` | Texto libre de ubicación |
| `precioMinimo` | number | `50000` | Precio mínimo |
| `precioMaximo` | number | `200000` | Precio máximo |
| `moneda` | string | `USD`, `ARS` | Moneda del precio |
| `ambientes` | number | `2` | Cantidad mínima de ambientes |
| `dormitorios` | number | `3` | Cantidad mínima de dormitorios |
| `banos` | number | `1` | Cantidad mínima de baños |
| `garageMinimo` | number | `1` | Cantidad mínima de cocheras |
| `superficieMinima` | number | `50` | Superficie mínima en m² |
| `superficieMaxima` | number | `200` | Superficie máxima en m² |
| `amenidades` | string | `piscina,gimnasio,seguridad` | Lista separada por comas |
| `ordenarPor` | string | `reciente`, `precio_menor`, `precio_mayor`, `superficie_mayor` | Criterio de ordenamiento |
| `pagina` | number | `1` | Número de página actual |

### Ejemplo de URL completa

```
/rent?operacion=alquiler&tipoPropiedad=departamento&ubicacion=Palermo&precioMinimo=50000&precioMaximo=150000&moneda=USD&ambientes=2&dormitorios=2&banos=1&garageMinimo=1&superficieMinima=60&superficieMaxima=120&amenidades=piscina,gimnasio&ordenarPor=precio_menor&pagina=1
```

---

## 2. Interfaz TypeScript (Frontend)

```typescript
// src/app/core/models/search-filters.interface.ts

interface FiltrosBusqueda {
  // Operación
  operacion?: 'venta' | 'alquiler';

  // Tipo y ubicación
  tipoPropiedad?: string | string[];
  ubicacion?: string;
  provincia?: string;
  ciudad?: string;
  barrio?: string;

  // Precio
  precioMinimo?: number;
  precioMaximo?: number;
  moneda?: 'USD' | 'ARS';

  // Características
  ambientes?: number;
  dormitorios?: number;
  banos?: number;
  garageMinimo?: number;
  superficieMinima?: number;
  superficieMaxima?: number;

  // Amenidades
  amenidades?: string[];

  // Estado y destacadas
  soloDestacadas?: boolean;
  estado?: string;  // 'disponible' | 'reservada' | 'vendida'

  // Ordenamiento
  ordenarPor?: 'reciente' | 'precio_menor' | 'precio_mayor' | 'superficie_mayor';

  // Paginación
  pagina?: number;
  limite?: number;
}
```

---

## 3. Endpoints Requeridos del Backend

### 3.1 Listar propiedades con filtros

```
GET /api/propiedades
```

**Query Parameters:** Todos los listados en la sección 1.

**Respuesta esperada:**

```typescript
interface RespuestaPaginada<T> {
  datos: T[];
  paginacion: {
    paginaActual: number;
    porPagina: number;
    totalItems: number;
    totalPaginas: number;
    tieneSiguiente: boolean;
    tieneAnterior: boolean;
  };
}
```

**Ejemplo de respuesta:**

```json
{
  "datos": [
    {
      "id": 1,
      "titulo": "Departamento en Palermo",
      "operacion": "alquiler",
      "tipoPropiedad": "departamento",
      "precio": 1200,
      "moneda": "USD",
      "ubicacion": {
        "direccion": "Av. Santa Fe 1234",
        "ciudad": "Buenos Aires",
        "provincia": "CABA",
        "barrio": "Palermo"
      },
      "caracteristicas": {
        "ambientes": 3,
        "dormitorios": 2,
        "banos": 1,
        "superficie": 75,
        "cocheras": 1,
        "amenidades": ["piscina", "gimnasio"]
      },
      "imagenes": ["url1.jpg", "url2.jpg"],
      "destacada": false,
      "estado": "disponible"
    }
  ],
  "paginacion": {
    "paginaActual": 1,
    "porPagina": 12,
    "totalItems": 45,
    "totalPaginas": 4,
    "tieneSiguiente": true,
    "tieneAnterior": false
  }
}
```

### 3.2 Obtener propiedades destacadas

```
GET /api/propiedades?soloDestacadas=true&limite=6
```

Se usa en el home para mostrar las propiedades destacadas.

### 3.3 Obtener detalle de propiedad

```
GET /api/propiedades/:id
```

---

## 4. Lógica de Filtrado (Referencia para Backend)

### Filtros de texto
- `ubicacion`: Buscar en `direccion`, `ciudad`, `provincia`, `barrio` (búsqueda parcial, case-insensitive)
- `tipoPropiedad`: Match exacto, puede ser múltiple (OR)

### Filtros numéricos (rangos)
- `precioMinimo` / `precioMaximo`: Rango inclusivo
- `superficieMinima` / `superficieMaxima`: Rango inclusivo

### Filtros numéricos (mínimos)
- `ambientes`: >= valor
- `dormitorios`: >= valor
- `banos`: >= valor
- `garageMinimo`: >= valor

### Filtro de moneda
- `moneda`: Solo mostrar propiedades en esa moneda

### Filtro de amenidades
- `amenidades`: La propiedad debe tener TODAS las amenidades seleccionadas (AND)

### Ordenamiento
| Valor | Ordenar por |
|-------|-------------|
| `reciente` | Fecha de publicación DESC |
| `precio_menor` | Precio ASC |
| `precio_mayor` | Precio DESC |
| `superficie_mayor` | Superficie DESC |

---

## 5. Valores de Amenidades

Los valores que el frontend envía para amenidades:

| Valor | Descripción |
|-------|-------------|
| `piscina` | Piscina |
| `gimnasio` | Gimnasio |
| `seguridad` | Seguridad 24hs |
| `cochera` | Cochera |
| `jardin` | Jardín |
| `parrilla` | Parrilla |

---

## 6. Valores de Tipo de Propiedad

| Valor | Descripción |
|-------|-------------|
| `casa` | Casa |
| `departamento` | Departamento |
| `ph` | PH |
| `local` | Local Comercial |
| `oficina` | Oficina |
| `terreno` | Terreno |

---

## 7. Flujo del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                         HOME PAGE                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ PropertySearchBarComponent                          │   │
│  │ - Operación (venta/alquiler)                       │   │
│  │ - Ubicación (texto libre)                          │   │
│  │ - Tipo de propiedad                                │   │
│  │ - Precio mín/máx + Moneda                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼                                 │
│              router.navigate(['/rent'], { queryParams })    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      LISTING PAGE                           │
│  ┌──────────────────┐    ┌─────────────────────────────┐   │
│  │ PropertyFilters  │    │   PropertyListingComponent  │   │
│  │ (Panel lateral)  │    │                             │   │
│  │                  │    │  1. Lee queryParams de URL  │   │
│  │ - Tipo propiedad │    │  2. Llama API con filtros   │   │
│  │ - Precio + moneda│◄──►│  3. Muestra resultados      │   │
│  │ - Ambientes      │    │  4. Actualiza URL al        │   │
│  │ - Dormitorios    │    │     cambiar filtros         │   │
│  │ - Baños          │    │                             │   │
│  │ - Cocheras       │    └─────────────────────────────┘   │
│  │ - Superficie     │                  │                   │
│  │ - Amenidades     │                  ▼                   │
│  └──────────────────┘     GET /api/propiedades?...         │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Archivos del Frontend Relacionados

| Archivo | Descripción |
|---------|-------------|
| `src/app/core/models/search-filters.interface.ts` | Interfaz de filtros |
| `src/app/core/services/property.service.ts` | Servicio que llama a la API |
| `src/app/core/services/property-search.service.ts` | Manejo de estado y navegación |
| `src/app/features/public-site/components/property-search-bar/` | Barra de búsqueda del home |
| `src/app/features/public-site/components/property-filters/` | Panel de filtros lateral |
| `src/app/features/public-site/pages/property-listing/` | Página de listado |

---

## 9. Filtros Definidos pero Sin UI (más adelante)

Estos filtros están en la interfaz y el servicio los soporta, pero no tienen UI todavía:

| Filtro | Descripción |
|--------|-------------|
| `provincia` | Filtrar por provincia específica |
| `ciudad` | Filtrar por ciudad específica |
| `barrio` | Filtrar por barrio específico |
| `antiguedadMaxima` | Antigüedad máxima en años |
| `estado` | Estado de la propiedad (disponible/reservada/vendida) |

---

## 10. Notas para el Backend

1. **Paginación por defecto:** Si no se envía `pagina`, asumir página 1. Si no se envía `limite`, usar 12 items por página.

2. **Ordenamiento por defecto:** Si no se envía `ordenarPor`, ordenar por fecha de publicación descendente (`reciente`).

3. **Filtros vacíos:** Los filtros no enviados deben ignorarse (no filtrar por ese campo).

4. **Moneda:** Si se filtra por moneda, solo devolver propiedades en esa moneda. Si no se filtra, devolver todas.

5. **Amenidades:** El filtro de amenidades usa lógica AND (la propiedad debe tener todas las amenidades seleccionadas).

6. **Texto de ubicación:** La búsqueda debe ser parcial y case-insensitive. Buscar en múltiples campos: dirección, ciudad, provincia, barrio.

7. **Propiedades destacadas:** El campo `soloDestacadas=true` se usa para obtener las propiedades destacadas del home.

---

## 11. Sistema Mock (Sin Backend)

Actualmente el frontend funciona con datos mock mientras no haya backend.

### Cómo funciona

```typescript
// src/app/core/services/property.service.ts

private useMockData = true;  // Flag para cambiar entre mock y API real

getPropiedades(filtros?: FiltrosBusqueda) {
  if (this.useMockData) {
    return this.getPropiedadesMock(filtros);  // Filtra array en memoria
  }
  return this.http.get('/api/propiedades', { params });  // Llama API real
}
```

### Datos mock

Los datos están en: `src/app/core/services/mock-data/properties.mock.ts`

Es un array de propiedades hardcodeadas que el servicio filtra y pagina en JavaScript.

### Para conectar el backend real

1. Cambiar `useMockData = false` en `property.service.ts` (línea 16)
2. Configurar `environment.apiUrl` con la URL del backend
3. El servicio automáticamente llamará a `GET /api/propiedades` con los query params

### Método alternativo (dinámico)

```typescript
// En algún componente o servicio de inicialización
this.propertyService.setUseMockData(false);
```

---
