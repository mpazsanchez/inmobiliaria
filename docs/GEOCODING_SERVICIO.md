# Servicio de Geocoding - Documentación

## ¿Qué es Geocoding?

**Geocoding** es el proceso de convertir una dirección de texto (ej: "Zona 10, Argentina") en coordenadas geográficas (latitud y longitud) que pueden usarse para mostrar un punto en un mapa.

**Geocoding Inverso** es lo contrario: convertir coordenadas en una dirección legible.

---

## Proveedores Disponibles

### 1. Nominatim (OpenStreetMap) - **GRATUITO**

- **URL**: https://nominatim.openstreetmap.org
- **Costo**: Gratis
- **Límite**: 1 solicitud por segundo
- **Requiere**: User-Agent personalizado
- **Documentación oficial**: https://nominatim.org/release-docs/latest/api/Search/

**¿Por qué lo usamos por defecto?**
- No requiere API key ni cuenta
- Datos de OpenStreetMap (comunidad)
- Suficiente para proyectos pequeños/medianos

### 2. Google Maps Geocoding API - **DE PAGO**

- **URL**: https://maps.googleapis.com/maps/api/geocode/json
- **Costo**: $5 USD por cada 1,000 solicitudes (después de crédito gratuito)
- **Documentación oficial**: https://developers.google.com/maps/documentation/geocoding/overview

**¿Cuándo usarlo?**
- Mayor precisión requerida
- Alto volumen de solicitudes
- Presupuesto disponible

---

## Interfaces (Tipos de Datos)

```typescript
// Resultado que devuelve el servicio
interface ResultadoGeocoding {
  coordenadas: { lat: number; lng: number };
  direccionFormateada: string;    // Dirección completa normalizada
  ciudad?: string;
  departamento?: string;
  pais?: string;
  codigoPostal?: string;
}

// Opciones para configurar el servicio
interface OpcionesGeocoding {
  proveedor: 'nominatim' | 'google';
  apiKey?: string;  // Solo necesario para Google
}
```

---

## Funciones del Servicio

### `geocodificar(direccion, opciones?)`

**Propósito**: Función principal que convierte una dirección en coordenadas.

**Parámetros**:
- `direccion`: String con la dirección a buscar
- `opciones`: (Opcional) Configuración del proveedor

**Retorna**: `Observable<ResultadoGeocoding | null>`

**Ejemplo**:
```typescript
this.geocodingService.geocodificar('Palermo, Buenos Aires, Argentina')
  .subscribe(resultado => {
    console.log(resultado?.coordenadas); // { lat: -34.xxx, lng: -58.xxx }
  });
```

**¿Por qué Observable y no Promise?**
- Angular usa RxJS por convención
- Permite cancelar la solicitud si el usuario navega
- Facilita el manejo de errores con `catchError`

---

### `geocodificarConNominatim(direccion)` (privada)

**Propósito**: Implementación específica para Nominatim.

**Detalles técnicos**:

```typescript
const params = {
  q: direccion,           // Query de búsqueda
  format: 'json',         // Formato de respuesta
  limit: '1',             // Solo el primer resultado
  addressdetails: '1'     // Incluir detalles de dirección
};
```

**¿Por qué `delay(1000)`?**
- Nominatim tiene un **rate limit** de 1 solicitud por segundo
- Sin este delay, el servicio puede bloquearnos temporalmente
- Documentación: https://operations.osmfoundation.org/policies/nominatim/

**¿Por qué User-Agent personalizado?**
- Es **obligatorio** según las políticas de Nominatim
- Identifica nuestra aplicación
- Sin él, las solicitudes pueden ser rechazadas

---

### `geocodificarConGoogle(direccion, apiKey)` (privada)

**Propósito**: Implementación para Google Maps API.

**Diferencias con Nominatim**:
- Requiere API key (de pago)
- No tiene delay (sin rate limit estricto)
- Estructura de respuesta diferente

**Extracción de componentes**:
```typescript
const getCityComponent = (type: string) => {
  const component = addressComponents.find(c => c.types.includes(type));
  return component?.long_name;
};
```

Google devuelve la dirección en "componentes" con tipos como:
- `locality` → Ciudad
- `administrative_area_level_1` → Departamento/Estado
- `country` → País
- `postal_code` → Código postal

---

### `geocodificarArgentina(direccion, ciudad?, provincia?)`

**Propósito**: Función helper específica para Argentina.

**¿Por qué existe?**
- Agrega automáticamente ", Argentina" al final
- Mejora la precisión de búsqueda
- Evita confusiones con ciudades de otros países

**Ejemplo**:
```typescript
// En lugar de:
this.geocodificar('Av. Corrientes 1234, Buenos Aires, Argentina')

// Puedes usar:
this.geocodificarArgentina('Av. Corrientes 1234', 'Buenos Aires', 'CABA')
```

---

### `geocodificacionInversa(coordenadas)`

**Propósito**: Convertir coordenadas en dirección (proceso inverso).

**Caso de uso**:
- Usuario hace click en un mapa
- Queremos mostrar qué dirección corresponde a ese punto

**Ejemplo**:
```typescript
this.geocodingService.geocodificacionInversa({ lat: -34.5889, lng: -58.3974 })
  .subscribe(resultado => {
    console.log(resultado?.direccionFormateada);
    // "Palermo, Buenos Aires, Argentina"
  });
```

---

### `validarCoordenadas(coordenadas)`

**Propósito**: Verificar que las coordenadas son geográficamente válidas.

**Reglas**:
- Latitud: entre -90 y 90
- Longitud: entre -180 y 180

**¿Por qué es necesario?**
- Previene errores al mostrar mapas
- Valida datos de entrada del usuario
- Evita llamadas innecesarias a la API

---

### `calcularDistancia(coord1, coord2)`

**Propósito**: Calcular la distancia entre dos puntos geográficos.

**Algoritmo**: Fórmula Haversine

**¿Qué es Haversine?**
- Fórmula matemática que calcula distancias en una esfera
- Considera la curvatura de la Tierra
- Más preciso que el teorema de Pitágoras para distancias geográficas

**Documentación**: https://en.wikipedia.org/wiki/Haversine_formula

**La fórmula**:
```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
c = 2 × atan2(√a, √(1−a))
d = R × c
```

Donde `R = 6371 km` (radio de la Tierra)

**Ejemplo**:
```typescript
const distancia = this.geocodingService.calcularDistancia(
  { lat: -34.6037, lng: -58.3816 },  // Buenos Aires
  { lat: -31.4201, lng: -64.1888 }   // Córdoba
);
console.log(distancia); // ~695 km
```

---

## Uso en el Formulario de Propiedades

```typescript
// Al guardar una propiedad:
this.geocodingService.geocodificarArgentina(
  propiedad.direccion,
  propiedad.ciudad,
  propiedad.provincia
).subscribe(resultado => {
  if (resultado) {
    propiedad.coordenadas = resultado.coordenadas;
    propiedad.direccionFormateada = resultado.direccionFormateada;
  }
});
```

---

## Manejo de Errores

El servicio usa `catchError` para manejar fallos silenciosamente:

```typescript
catchError(error => {
  console.error('Error en geocoding:', error);
  return of(null);  // Retorna null en lugar de romper la app
})
```

**¿Por qué retornar `null` en lugar de error?**
- El geocoding es una funcionalidad secundaria
- Si falla, la propiedad aún puede guardarse (sin coordenadas)
- Mejor UX: no interrumpe el flujo del usuario

---
## Resumen

| Función | Propósito |
|---------|-----------|
| `geocodificar()` | Dirección → Coordenadas |
| `geocodificacionInversa()` | Coordenadas → Dirección |
| `geocodificarArgentina()` | Helper para direcciones de Argentina |
| `validarCoordenadas()` | Verificar coordenadas válidas |
| `calcularDistancia()` | Distancia entre dos puntos |
