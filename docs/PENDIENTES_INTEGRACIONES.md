# Pendientes: API Keys e Integraciones

Documento interno para trackear qué falta configurar antes de ir a producción.

---

## API Keys que necesito del cliente

### 1. Cloudinary
**¿Qué necesito?**
- [ ] Cloud Name
- [ ] Upload Preset (crear uno "unsigned" en el dashboard de Cloudinary)

Se debe crear cuenta en [cloudinary.com](https://cloudinary.com)

**¿Dónde lo configuro?** `src/environments/environment.ts` y `environment.prod.ts`

---

### 2. Google reCAPTCHA Enterprise
**Estado:** ✅ Ya tiene una key configurada (de mi cuenta personal)

**Preguntar al cliente:**
- [ ] Pedir key de Fairway

---

### 3. Google Analytics (PENDIENTE IMPLEMENTAR)
**¿Qué es?** Seguimiento de visitas y conversiones

**¿Qué necesito?**
- [ ] ID de medición (formato: `G-XXXXXXXXXX`)

Se debe crear propiedad en [analytics.google.com](https://analytics.google.com)

**¿Dónde lo configuro?**
- `src/index.html` (script de gtag)
- `src/environments/environment.ts` (ID)

---

### 4. Google Maps API Key (OPCIONAL)
**¿Qué es?** Para geocoding más preciso que Nominatim

**Estado actual:** Usando Nominatim (OpenStreetMap) que es gratis. Funciona bien pero tiene límite de 1 request/segundo.

**¿Cuándo lo necesitamos?**
- Si el cliente quiere geocoding más rápido/preciso
- Si hay muchas propiedades para geocodificar en lote

**¿Qué necesito?**
- [ ] API Key de Google Maps con Geocoding API habilitada

---