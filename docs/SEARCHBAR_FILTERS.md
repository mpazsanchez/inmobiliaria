# Filtros del Search Bar - Fairway Inmobiliaria

Este documento describe los filtros que envía el componente de búsqueda principal (search bar).

---

## Search Bar Principal (Home)

El search bar de la página principal envía los siguientes filtros:

### Filtros Enviados

| Campo | Tipo | Valores | Descripción |
|-------|------|---------|-------------|
| `operacion` | string | `venta`, `alquiler` | Seleccionado con tabs |
| `tipoPropiedad` | string | `casa`, `departamento`, `ph`, `oficina`, `terreno` | Selector dropdown |
| `ubicacion` | string | texto libre | Input de texto para buscar ciudad, barrio, zona |
| `precioMinimo` | number | cualquier número positivo | Input numérico |
| `precioMaximo` | number | cualquier número positivo | Input numérico |
| `moneda` | string | `USD`, `ARS` | Selector dropdown |

### Ejemplo de Request

Cuando el usuario busca casas en venta en Palermo con precio máximo USD 200.000:

```
GET /api/propiedades?operacion=venta&tipoPropiedad=casa&ubicacion=palermo&precioMaximo=200000&moneda=USD
```

### Notas

1. **Solo se envían los filtros con valor**: Si el usuario no selecciona tipo de propiedad, ese parámetro no se envía.

2. **La moneda solo se envía si hay precio**: Si no hay `precioMinimo` ni `precioMaximo`, no se envía `moneda`.

3. **Paginación por defecto**: Si no se especifica, usar `pagina=1` y `porPagina=12`.

---

## Flujo de Búsqueda

```
1. Usuario llena el form:
   - Selecciona tab "Comprar" → operacion=venta
   - Escribe "palermo" → ubicacion=palermo
   - Selecciona "Casa" → tipoPropiedad=casa
   - Pone precio máximo 200000 → precioMaximo=200000
   - Moneda USD → moneda=USD

2. Click en "Buscar"

3. Frontend navega a:
   /propiedades?operacion=venta&tipoPropiedad=casa&ubicacion=palermo&precioMaximo=200000&moneda=USD

4. Página de listado lee los query params y hace:
   GET /api/propiedades?operacion=venta&tipoPropiedad=casa&ubicacion=palermo&precioMaximo=200000&moneda=USD&pagina=1&porPagina=12
```

---

## Valores por Defecto

| Campo | Valor Default |
|-------|---------------|
| `operacion` | `venta` |
| `moneda` | `USD` |
| `pagina` | `1` |
| `porPagina` | `12` |

---

## UI del Search Bar

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Comprar]  [Alquilar]                          ← Tabs (operacion)  │
├─────────────────────────────────────────────────────────────────────┤
│  🔍 ¿Dónde querés mudarte?  │  🏠 Tipo ▼  │  USD ▼  Min - Max  │ 🔍 │
│     ___________________     │  _________  │  _____ ___ _____   │    │
│         (ubicacion)         │(tipoPropi.) │(moneda)(precioMin) │    │
│                             │             │       (precioMax)  │    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Filtros Adicionales (para página de listado)

En la página de listado de propiedades se pueden agregar filtros adicionales:

| Campo | Tipo | UI Sugerida |
|-------|------|-------------|
| `dormitoriosMinimo` | number | Selector: "1+", "2+", "3+", "4+" |
| `banosMinimo` | number | Selector: "1+", "2+", "3+" |
| `superficieMinima` | number | Input o slider |
| `superficieMaxima` | number | Input o slider |
| `garageMinimo` | number | Selector: "1+", "2+" |
| `amenidades` | string[] | Checkboxes múltiples |
| `ordenarPor` | string | Selector: "Más recientes", "Menor precio", etc. |

Estos filtros se combinan con los del search bar principal.
