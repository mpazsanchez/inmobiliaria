# Contenido Estático - Archivos JSON

Este directorio contiene los archivos JSON individuales para cada página de contenido estático del sitio.

## Estructura

Cada página tiene su propio archivo JSON:

- **nosotros.json** - Página "Quiénes Somos"
- **contacto.json** - Página de Contacto
- **terminos.json** - Términos y Condiciones
- **privacidad.json** - Política de Privacidad
- **servicios.json** - Nuestros Servicios
- **faqs.json** - Preguntas Frecuentes

## Formato

Cada archivo sigue la interfaz `ContenidoEstatico`:

```json
{
  "pagina": "nombre-pagina",
  "titulo": "Título de la Página",
  "contenidoHtml": "<h2>Contenido en HTML...</h2>",
  "ultimaActualizacion": "2026-01-15T10:30:00Z",
  "editadoPor": 1,
  "metaDescripcion": "Descripción SEO...",
  "metaKeywords": "palabras, clave, seo",
  "publicada": true
}
```

## Uso en el Servicio

El `ContenidoEstaticoService` carga estos archivos de forma individual:

```typescript
// Carga una página específica
getPageContent('nosotros') // → /assets/data/static-content/nosotros.json

// Carga todas las páginas en paralelo
getAllContent() // → forkJoin de todos los archivos
```

## Ventajas de Archivos Separados

1. **Organización**: Cada página en su propio archivo
2. **Mantenibilidad**: Fácil de encontrar y editar contenido específico
3. **Performance**: Solo se carga lo necesario (lazy loading)
4. **Git**: Mejor tracking de cambios por página
5. **Backend**: Estructura lista para migrar a CMS o API

## Migración a API Backend

Cuando el backend esté listo, cambiar en `contenido-estatico.service.ts`:

```typescript
private useMockData = false; // Cambiar de true a false
```

El servicio comenzará a usar los endpoints:
- `GET /api/static-content/:pagina` para páginas individuales
- `GET /api/static-content` para todas las páginas
