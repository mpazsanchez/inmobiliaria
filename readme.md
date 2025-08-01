# Glazing.me - Documentación Técnica

## 📋 Descripción del Proyecto

Glazing.me es una plataforma digital que integra una **aplicación web Angular 18** con **Server-Side Rendering (SSR)** diseñada para transformar el mercado de láminas solares y polarizado de vidrios. La aplicación sigue una arquitectura modular y escalable preparada para soportar múltiples tipos de usuarios y funcionalidades complejas.

> 📄 **Nota**: Para información detallada sobre el modelo de negocio, consultar `BUSINESS_MODEL.md`


## 🚀 Stack Tecnológico

### **Frontend**
- **Angular 18.2.0** - Framework principal
- **Angular SSR** - Server-Side Rendering para SEO y performance
- **Bootstrap 5.3.2** - Framework CSS responsive
- **ng-bootstrap 17.0.1** - Componentes Angular para Bootstrap
- **SCSS** - Preprocesador CSS

### **Backend**
- **Express.js** - Servidor para SSR
- **Node.js** - Runtime environment

### **Herramientas de Desarrollo**
- **TypeScript 5.5.2** - Lenguaje de programación
- **Angular CLI 18.2.6** - Herramientas de desarrollo
- **Karma + Jasmine** - Framework de testing
- **FontAwesome 7.0.0** - Librería de iconos


## 📁 Arquitectura del Proyecto

### **Estructura de Directorios**

```
Glazing.me/
├── 📁 public/                          # Archivos estáticos públicos
│   └── favicon.ico
├── 📁 src/                             # Código fuente principal
│   ├── 📄 index.html                   # Plantilla HTML principal
│   ├── 📄 main.ts                      # Bootstrap cliente
│   ├── 📄 main.server.ts               # Bootstrap servidor (SSR)
│   ├── 📄 styles.scss                  # Estilos globales
│   │
│   ├── 📁 app/                         # Core de la aplicación Angular
│   │   ├── 📄 app.component.*          # Componente raíz
│   │   ├── 📄 app.config.ts            # Configuración cliente
│   │   ├── 📄 app.config.server.ts     # Configuración servidor
│   │   ├── 📄 app.routes.ts            # Definición de rutas
│   │   │
│   │   ├── 📁 features/                # 🎯 FUNCIONALIDADES POR MÓDULOS
│   │   │   └── 📁 public-site/         # Sitio web público
│   │   │       ├── 📁 components/      # Componentes reutilizables
│   │   │       │   ├── 📁 home/        # Componentes página principal
│   │   │       │   │   └── 📁 hero-section/
│   │   │       │   └── 📁 home-two/    # Componentes página alternativa
│   │   │       │       └── 📁 hero-section-sliders/
│   │   │       └── 📁 pages/           # Páginas completas
│   │   │           ├── 📁 home/        # Página principal
│   │   │           └── 📁 home-two/    # Página alternativa
│   │   │
│   │   └── 📁 layout/                  # 🏗️ SISTEMA DE LAYOUTS
│   │       └── 📁 public-layout/       # Layout sitio público
│   │           ├── 📄 public-layout.component.*
│   │           └── 📁 components/      # Componentes del layout
│   │               └── 📁 public-navbar/ # Barra de navegación
│   │
│   ├── 📁 assets/                      # 🎨 RECURSOS ESTÁTICOS
│   │   ├── 📁 i18n/                    # Internacionalización
│   │   │   ├── 📄 en.json              # Inglés (preparado)
│   │   │   └── 📄 es.json              # Español (preparado)
│   │   ├── 📁 images/                  # Recursos visuales
│   │   │   ├── 📁 backgrounds/         # Imágenes de fondo
│   │   │   │   └── 📁 solarcheck/      # Assets específicos del proyecto
│   │   │   └── 📁 logos/               # Logotipos de marca
│   │   └── 📁 styles/                  # Sistema de estilos
│   │       ├── 📄 _variables.scss      # Variables globales SCSS
│   │       ├── 📄 _responsive.scss     # Breakpoints y mixins
│   │       └── 📄 helpers.scss         # Clases de utilidad
│   │
│   └── 📁 environments/                # ⚙️ CONFIGURACIÓN DE ENTORNOS
│       ├── 📄 environment.ts           # Desarrollo
│       └── 📄 environment.prod.ts      # Producción
│
├── 📄 server.ts                        # Servidor Express para SSR
├── 📄 angular.json                     # Configuración Angular CLI
├── 📄 package.json                     # Dependencias y scripts
├── 📄 tsconfig.json                    # Config TypeScript base
├── 📄 tsconfig.app.json               # Config TS aplicación
└── 📄 tsconfig.spec.json              # Config TS testing
```

## 🏛️ Patrones de Arquitectura

### **1. Feature-Based Architecture**
```
features/
├── public-site/           # Funcionalidad del sitio público
├── auth/                 # Sistema de autenticación (futuro)
├── member-area/          # Área de miembros (futuro)
├── e-commerce/           # Tienda online (futuro)
├── training/             # Sistema de formación (futuro)
└── admin/                # Panel administración (futuro)
```

### **2. Layout System**
```
layout/
├── public-layout/        # Para visitantes y páginas públicas
├── member-layout/        # Para usuarios registrados (futuro)
└── admin-layout/         # Para administradores (futuro)
```

### **3. Component Organization**
```
feature/
├── components/           # Componentes reutilizables del feature
├── pages/               # Páginas completas del feature
├── services/            # Servicios específicos (futuro)
├── models/              # Modelos de datos (futuro)
└── guards/              # Guards de routing (futuro)
```

## 🛠️ Configuración de Desarrollo

### **Prerrequisitos**
- Node.js 18+ LTS
- npm 9+ o yarn
- Angular CLI 18.2.6
- Git

### **Instalación**

```bash
# 1. Clonar repositorio
git clone [REPO_URL]
cd Glazing.me

# 2. Instalar dependencias
npm install

# 3. Verificar instalación
ng version
```

### **Scripts de Desarrollo**

```bash
# 🚀 DESARROLLO
npm start                 # Servidor desarrollo (http://localhost:4200)
npm run ng               # Angular CLI directo
npm run watch            # Build con watch mode

# 🏗️ BUILD
npm run build            # Build producción
npm run build:dev        # Build desarrollo

# 🧪 TESTING
npm test                 # Tests unitarios con watch
npm run test:ci          # Tests para CI/CD (single run)

# 🌐 SSR
npm run serve:ssr:glazing # Servidor con SSR
```



## 🔐 Sistema de Niveles de Usuario (Planificado)

### **Nivel 1: Comprador Autorizado**
- Acceso a tienda online
- Compra de productos
- Soporte básico

### **Nivel 2: Instalador en Formación**
- Acceso mediante pago
- Formación técnica
- Presupuestador básico
- Soporte especializado

### **Nivel 3: Instalador Certificado**
- Clientes referidos
- Precios mayoristas
- Garantías oficiales
- Herramientas premium



## 🌍 Internacionalización (i18n)

### **Configuración**
- Archivos preparados: `assets/i18n/{es,en}.json`
- Angular Localize configurado
- Soporte multi-idioma listo para implementar

### **Uso Futuro**
```typescript
// En componentes
constructor(private translate: TranslateService) {}

// En templates
{{ 'COMMON.BUTTONS.SAVE' | translate }}



```
## 🚀 Server-Side Rendering (SSR)

### **Beneficios**
- ⚡ Mejor performance inicial
- 🔍 SEO optimizado
- 📱 Mejor experiencia en móviles

### **Configuración**
```typescript
// server.ts - Servidor Express
// main.server.ts - Bootstrap SSR
// app.config.server.ts - Config servidor
```


## 📦 Build y Deployment

### **Archivos de Salida**
```
dist/glazing/
├── browser/              # Archivos cliente
├── server/              # Archivos servidor
└── static/              # Assets estáticos
```

### **Configuraciones**
- **Desarrollo**: Source maps, hot reload
- **Producción**: Minificación, optimización, AOT

## 🔄 Flujo de Desarrollo

### **Feature Development**
1. Crear feature en `src/app/features/`
2. Implementar componentes y páginas
3. Configurar rutas
4. Agregar estilos específicos
5. Escribir tests
6. Integrar con layout apropiado

### **Component Development**
1. Generar con Angular CLI: `ng g c feature/components/component-name`
2. Implementar lógica
3. Crear estilos SCSS
4. Escribir tests unitarios
5. Documentar uso



### **Estructura de Commits**
```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato (no afectan lógica)
refactor: refactorización sin cambio funcional
test: agregar o modificar tests
chore: cambios en build, dependencias, etc.
```



## 🐛 Troubleshooting

### **Problemas Comunes**

1. **Error de dependencias**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Problemas con Angular CLI**
   ```bash
   npm uninstall -g @angular/cli
   npm install -g @angular/cli@18.2.6
   ```

3. **Problemas con SSR**
   - Verificar importaciones compatibles con servidor
   - Revisar uso de `window` o `document`
   - Validar configuración de Express

4. **Problemas de estilos**
   - Verificar orden de importación en `styles.scss`
   - Comprobar paths relativos en assets
   - Validar variables SCSS duplicadas



---

## 👥 Equipo de Desarrollo

**Desarrollado por Grupo AGNI**
- 📖 **Documentación**: Este README + `BUSINESS_MODEL.md`
---

*Última actualización técnica: Agosto 2025*

> 💡 **Tip para desarrolladores**: Este proyecto está preparado para escalar. La arquitectura modular permite agregar nuevas funcionalidades sin afectar el código existente. Seguir los patrones establecidos para mantener la consistencia del proyecto.