# TransferState para SSR - Evitar Doble Carga

## El Problema

Con SSR, Angular renderiza en servidor Y cliente, causando:
- Servidor: fetch API → renderiza HTML
- Cliente: se hidrata → fetch API otra vez → muestra skeleton → renderiza

**Resultado**: Usuario ve contenido → skeleton → contenido (parpadeo)

## La Solución: TransferState

**Servidor guarda datos** → **Cliente los reutiliza** (sin segundo fetch)

## Implementación

### 1. En el servicio (ej: property.service.ts)

```typescript
import { TransferState, makeStateKey } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private transferState = inject(TransferState);
  
  getPropiedades(filtros?: FiltrosBusqueda): Observable<RespuestaPaginada<Propiedad>> {
    // Clave única por filtros
    const stateKey = makeStateKey(`propiedades-${JSON.stringify(filtros)}`);
    
    // ¿Datos del servidor?
    const cached = this.transferState.get(stateKey, null);
    if (cached) {
      this.transferState.remove(stateKey); // Limpiar
      return of(cached); // Instantáneo
    }
    
    // Fetch normal + guardar para cliente
    return this.http.get(url).pipe(
      tap(data => this.transferState.set(stateKey, data))
    );
  }
}
```

## Cuándo se muestra skeleton

- ✅ **SÍ**: Cambios de filtros, paginación, reordenamiento (fetch nuevo)
- ❌ **NO**: Primera carga (datos del servidor)

## Componentes que lo necesitan

Cualquier componente que haga fetch en `ngOnInit`:
- `property-listing.component.ts` ✅ (ya implementado)
- `team.component.ts` (equipo)
- `home.component.ts` (datos del home)
- `property-detail.component.ts` (detalle de propiedad)
- Otros que carguen datos al inicializar

## Beneficios

1. **SEO**: Contenido completo para bots
2. **Performance**: Sin fetch duplicado
3. **UX**: Sin parpadeo de skeleton
4. **Core Web Vitals**: Mejor LCP
