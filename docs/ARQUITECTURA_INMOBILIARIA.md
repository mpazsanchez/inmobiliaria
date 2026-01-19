# Arquitectura del Módulo Inmobiliaria (Fairway)

> Documentación técnica del módulo de propiedades.
---
## Resumen General
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CAPA DE DATOS                                   │
│                                                                              │
│   properties.mock.ts          agents.mock.ts                                │
│   └── MOCK_PROPIEDADES        └── AGENTES_MOCK                              │                            │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CAPA DE SERVICIOS                               │
│                                                                              │
│   PropertyService              AgentService           PropertySearchService │
│   ├── getPropiedades()         ├── getAgentes()       ├── signals (estado)  │
│   ├── getPropiedadPorId()      ├── getAgentePorId()   ├── updateFilters()   │
│   ├── getDestacadas()          ├── getPropiedades     ├── search()          │
│   ├── getRecientes()           │   Agente()           ├── navigateToResults │
│   ├── getRelacionadas()        └── getEstadisticas    └── syncFromURL()     │
│   └── contarPropiedades()          Agente()                                 │
│                                                                              │
│   Flag: useMockData = true  →  Cuando el backend esté listo, cambiar a false│
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CAPA DE PRESENTACIÓN                            │
│                                                                              │
│   PÁGINAS                              COMPONENTES                           │
│   ├── fairway-home        (/)          ├── property-card                    │
│   ├── property-listing    (/comprar,   ├── property-filters                 │
│   │                        /alquilar)  ├── property-search-bar              │
│   ├── property-detail     (/propiedad) ├── property-map                     │
│   ├── agent-listing       (/equipo)    ├── property-gallery                 │
│   └── agent-profile       (/equipo/:id)├── featured-properties              │
│                                        ├── related-properties               │
│                                        ├── property-agent-card              │
│                                        └── property-skeleton                │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Páginas

| Página | Ruta | Servicio | Método | Descripción |
|--------|------|----------|--------|-------------|
| `fairway-home` | `/` | - | - | Homepage con search bar y propiedades destacadas |
| `property-listing` | `/comprar`, `/alquilar`, `/properties` | `PropertyService` | `getPropiedades()` | Listado con filtros y paginación |
| `property-detail` | `/propiedad/:id`, `/property/:id` | `PropertyService` | `getPropiedadPorId()`, `getPropiedadesRelacionadas()` | Detalle de propiedad |
| `agent-listing` | `/equipo`, `/team` | `AgentService` | `getAgentes()` | Listado de agentes |
| `agent-profile` | `/equipo/:id`, `/team/:id` | `AgentService` | `getAgentePorId()`, `getPropiedadesAgente()` | Perfil de agente |



## El Mapa: Cómo Funciona

### Ubicación: `src/app/features/public-site/components/property-map/`

### Características

- **Librería:** Leaflet + MarkerCluster
- **Carga dinámica:** Solo se carga en el browser (SSR safe)
- **Tiles:** OpenStreetMap

### Flujo de datos

```typescript
// El mapa NO carga datos propios
// Recibe las propiedades desde el componente padre

@Input() propiedades: Propiedad[]

// Cuando cambian las propiedades, actualiza los markers
ngOnChanges() {
  if (this.map && this.propiedades) {
    this.updateMarkers();
  }
}
```

### Creación de markers

```typescript
updateMarkers(): void {
  this.propiedades.forEach(prop => {
    const marker = L.marker(
      [prop.ubicacion.coordenadas.lat, prop.ubicacion.coordenadas.lng],
      { icon: this.createCustomIcon(prop.operacion) }
    );

    // Popup con imagen, precio, título
    marker.bindPopup(this.createPopupContent(prop));

    // Click navega a detalle
    marker.on('click', () => {
      this.router.navigate(['/property', prop.id]);
    });

    this.markersCluster.addLayer(marker);
  });
}
```

### Colores por operación

```typescript
createCustomIcon(operacion: string) {
  const color = operacion === 'venta' ? '#10B981' : '#3B82F6';
  // Verde para venta, Azul para alquiler
}
```

### Usos del mapa

| Componente | Propiedades que recibe |
|------------|------------------------|
| `property-listing` | Todas las propiedades del listado actual |
| `property-detail` | Solo la propiedad actual (array de 1) |

---



## Preparación para el Backend

### Paso 1: Cambiar el flag
```typescript
// En PropertyService y AgentService
private useMockData = false;  // Cambiar de true a false
```
### Paso 2: Configurar la URL del API
```


## Diagrama de Componentes
src/app/
├── core/
│   ├── models/
│   │   ├── property.interface.ts      # Propiedad, Ubicacion, Caracteristicas
│   │   ├── agent.interface.ts         # Agente, AgenteInfo, EstadisticasAgente
│   │   └── search-filters.interface.ts # FiltrosBusqueda, RespuestaPaginada
│   │
│   └── services/
│       ├── property.service.ts        # CRUD de propiedades
│       ├── agent.service.ts           # CRUD de agentes
│       ├── property-search.service.ts # Estado y navegación
│       └── mock-data/
│           ├── properties.mock.ts     # MOCK_PROPIEDADES
│           └── agents.mock.ts         # AGENTES_MOCK
│
└── features/public-site/
    ├── pages/
    │   ├── fairway-home/              # Homepage
    │   ├── property-listing/          # /comprar, /alquilar
    │   ├── property-detail/           # /propiedad/:id
    │   ├── agent-listing/             # /equipo
    │   └── agent-profile/             # /equipo/:id
    │
    └── components/
        ├── property-card/             # Tarjeta reutilizable
        ├── property-filters/          # Panel de filtros
        ├── property-search-bar/       # Barra de búsqueda
        ├── property-map/              # Mapa Leaflet
        ├── property-gallery/          # Galería de imágenes
        ├── featured-properties/       # Propiedades destacadas
        ├── related-properties/        # Propiedades similares
        ├── property-agent-card/       # Info del agente
        ├── property-contact-form/     # Formulario de contacto
        └── property-skeleton/         # Loading placeholder
```
