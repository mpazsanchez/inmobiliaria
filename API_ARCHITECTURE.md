## ✅ Arquitectura (Un endpoint con params)

## 📊 Ejemplo: Búsqueda Completa

### Frontend envía:
```typescript
this.propertyService.getPropiedades({
  operacion: 'venta',
  tipoPropiedad: ['casa', 'ph'],
  ubicacion: 'Palermo',
  precioMinimo: 200000,
  precioMaximo: 500000,
  moneda: 'USD',
  dormitoriosMinimo: 2,
  amenidades: ['piscina', 'gimnasio'],
  ordenarPor: 'precio_menor',
  pagina: 1,
  porPagina: 10
});
```

### Backend recibe:
```
GET /api/propiedades?operacion=venta&tipoPropiedad=casa,ph&ubicacion=Palermo&precioMinimo=200000&precioMaximo=500000&moneda=USD&dormitoriosMinimo=2&amenidades=piscina,gimnasio&ordenarPor=precio_menor&pagina=1&porPagina=10
```

### Backend responde:
```json
{
  "datos": [
    { "id": 1, "titulo": "Casa en Palermo", "precio": 250000 },
    { "id": 5, "titulo": "PH moderno", "precio": 280000 },
    { "id": 12, "titulo": "Casa con jardín", "precio": 320000 }
  ],
  "paginacion": {
    "paginaActual": 1,
    "porPagina": 10,
    "totalItems": 23,
    "totalPaginas": 3,
    "tieneSiguiente": true,
    "tieneAnterior": false
  }
}
```


## Cuando utilice la API

### Paso 1: Configurar endpoint
```typescript
// src/environments/environment.ts
export const environment = {
  apiUrl: 'https://tu-api.com/api/v1/propiedades'
};
```

### Paso 2: Cambiar flag
```typescript
// src/app/core/services/property.service.ts
private useMockData = false;  // 👈 Cambiar a false
```

### Paso 3: Verificar backend
Debe:
- ✅ Aceptar todos los filtros como query params
- ✅ Devolver formato: `{ datos: [], paginacion: {} }`
---

## 📋 Backend Requirements Checklist

El backend necesita soportar estos query params:

### Filtros Básicos
- `operacion` (string: 'venta' | 'alquiler')
- `tipoPropiedad` (string o array: 'casa,ph,departamento')
- `ubicacion` (string: búsqueda texto libre)
- `provincia` (string: match exacto)
- `ciudad` (string: match exacto)

### Filtros de Precio
- `precioMinimo` (number)
- `precioMaximo` (number)
- `moneda` (string: 'USD' | 'ARS')

### Filtros de Características
- `ambientesMinimo` (number)
- `ambientesMaximo` (number)
- `dormitoriosMinimo` (number)
- `dormitoriosMaximo` (number)
- `banosMinimo` (number)
- `superficieMinima` (number)
- `superficieMaxima` (number)
- `garageMinimo` (number)
- `antiguedadMaxima` (number)

### Filtros de Amenidades
- `amenidades` (array: 'piscina,gimnasio,seguridad')
  - Backend debe verificar que la propiedad tenga TODAS las amenities solicitadas

### Filtros de Estado
- `soloDestacadas` (boolean)
- `estado` (string: 'disponible' | 'reservado' | 'vendido')

### Ordenamiento
- `ordenarPor` (string: 'reciente' | 'precio_menor' | 'precio_mayor' | 'superficie_mayor' | 'precio' | 'fecha' | 'superficie' | 'relevancia')
- `ordenDireccion` (string: 'asc' | 'desc')
  - **Nota**: Para 'precio_menor', 'precio_mayor', 'superficie_mayor' ignora dirección (son fijos)

### Paginación
- `pagina` (number: página actual, empieza en 1)
- `porPagina` (number: items por página)
- `limite` (number: total máximo de items)

### Respuesta Esperada
```json
{
  "datos": [
    {
      "id": 1,
      "titulo": "Casa moderna",
      "operacion": "venta",
      "tipoPropiedad": "casa",
      "precio": 250000,
      "moneda": "USD",
      "ubicacion": {
        "direccion": "Av. Santa Fe 1234",
        "ciudad": "CABA",
        "provincia": "Buenos Aires",
        "pais": "Argentina"
      },
      "caracteristicas": {
        "ambientes": 3,
        "dormitorios": 2,
        "banos": 2,
        "superficie_total": 120,
        "superficie_cubierta": 100,
        "garage": 1,
        "antiguedad": 5,
        "amenidades": ["piscina", "gimnasio"]
      },
      "imagenes": ["url1", "url2"],
      "descripcion": "...",
      "destacada": true,
      "estado": "disponible",
      "fechaPublicacion": "2026-01-15T10:00:00Z"
    }
  ],
  "paginacion": {
    "paginaActual": 1,
    "porPagina": 10,
    "totalItems": 45,
    "totalPaginas": 5,
    "tieneSiguiente": true,
    "tieneAnterior": false
  }
}
```

---

### ✅ Implementado:
- Todos los ordenamientos funcionan
- Métodos usan endpoint único
- Sistema listo para API con cambio mínimo
